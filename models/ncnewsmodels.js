const format = require("pg-format");
const db = require("../db/connection");

exports.selectTopics = () => {
  const selectQuery = format(`SELECT * FROM topics;`);
  return db.query(selectQuery).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query(
      `SELECT 
    articles.article_id,
    articles.title,
    articles.topic,
    articles.author,
    articles.created_at,
    articles.body,
    articles.votes,
    articles.article_img_url,
    COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id
  `,[article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Not Found",
        });
      }

      return result.rows[0];
    });
};

exports.selectAllArticles = (topic, sort_by, order) => {

  const acceptedSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  if (sort_by && !acceptedSortBy.includes(sort_by)) {

    return Promise.reject({ status: 400, message: "Bad Request" });
  }

  const queryValues = [];

  let baseSQLString = `SELECT 
  articles.article_id,
  articles.title,
  articles.topic,
  articles.author,
  articles.created_at,
  articles.votes,
  articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  JOIN comments ON articles.article_id = comments.article_id
`;
  if (topic) {
    (baseSQLString += ` WHERE topic = $1   GROUP BY articles.article_id`),
      queryValues.push(topic);
  }
  if (sort_by && sort_by !== "comment_count") {
    baseSQLString += ` GROUP BY articles.article_id ORDER BY articles.${sort_by}`;
  }

  if (sort_by === "comment_count"){
    baseSQLString += ` GROUP BY articles.article_id ORDER BY comment_count`
  }

  if (order) {
    baseSQLString += ` GROUP BY articles.article_id ORDER BY articles.created_at ${order}`;
  }

  if (sort_by && order) {
    baseSQLString = `
      SELECT 
      articles.article_id,
      articles.title,
      articles.topic,
      articles.author,
      articles.created_at,
      articles.votes,
      articles.article_img_url,
      COUNT(comments.comment_id) AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE topic = $1
      GROUP BY articles.article_id
      ORDER BY
      `;
    
    if (sort_by === 'created_at') {
      baseSQLString += `articles.created_at ${order === 'asc' ? 'ASC' : 'DESC'}`;
    } else if (sort_by === 'votes') {
      baseSQLString += `articles.votes ${order === 'asc' ? 'ASC' : 'DESC'}`;
    } else if (sort_by === 'comments') {
      baseSQLString += `comment_count ${order === 'asc' ? 'ASC' : 'DESC'}`;
    } else {
  
      baseSQLString += 'articles.created_at DESC';
    }
  }

  if (!sort_by && !order && !topic) {
    baseSQLString += ` GROUP BY articles.article_id ORDER BY articles.created_at DESC`;
  }


  return db.query(
    baseSQLString, queryValues).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Not Found" });
    }
    return result.rows;
  });
};

exports.selectAllComments = (id) => {
  const selectArticlesQuery = format(
    `SELECT * FROM articles WHERE article_id = %L;`,
    id
  );
  return db.query(selectArticlesQuery).then((result) => {
    
    if (result.rows !== 0 && result.rows.length !== 0) {
      const selectCommentsQuery = format(
        `SELECT * FROM comments WHERE article_id = %L
          ORDER BY created_at DESC;`,
        id
      );
      return db.query(selectCommentsQuery).then((result) => {
     
        if (result.rows.length === 0) {
          return result.rows;
        } else {
          return result.rows;
        }
      });
    } else {
      return Promise.reject({ status: 404, message: "Not Found" });
    }
  });
};
exports.insertComment = ( author, article_id, body  ) => {
  return db.query(
    `INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *`,
    [body, article_id, author]
  )
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Not Found" });
    }
    return result.rows[0];
  });
};
exports.updateArticle = (updVote, article_id  ) => {
  return db.query(
    `UPDATE articles
    SET
    votes = votes + $1 
    WHERE article_id = $2
    RETURNING *`,
    [updVote, article_id]
  )
  .then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        message: "article does not exist",
      });
    }
    return result.rows[0];
  });
};
exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "comment does not exist",
        });
      }
    });
};
exports.selectUsers = () => {
  const selectUsersQuery = format(
    `SELECT * FROM users;`
  );
  return db.query(selectUsersQuery)
  .then(({rows}) => {
    return rows
  })
}