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
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "article does not exist",
        });
      }
      return rows;
    });
};

exports.selectAllArticles = () => {
  const selectArticlesQuery = format(
    `SELECT 
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
      GROUP BY articles.article_id
      ORDER BY created_at DESC;
    `
  );
  return db.query(selectArticlesQuery).then((result) => {
    return result.rows;
  });
};

exports.selectAllComments = (id) => {
  const selectCommentsQuery = format(
    `SELECT * FROM comments WHERE article_id = %L
      ORDER BY created_at DESC;`,
    id
  );
  return db.query(selectCommentsQuery).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "article does not exist" });
    }
    return rows;
  });
};

exports.insertComment = ( author, article_id, body  ) => {
  return db.query(
    `INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *`,
    [body, article_id, author]
  )
  .then((result) => {
    return result.rows[0];
  });
};

exports.insertComment = ( author, article_id, body  ) => {
  return db.query(
    `INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *`,
    [body, article_id, author]
  )
  .then((result) => {
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
    return result.rows[0];
  });
};

exports.removeCommentById = (comment_id) => { 

  return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [comment_id])
  .then(({rows}) => {
    if (rows.length === 0) {
      return Promise.reject({status: 404, message: "comment does not exist"})
    }
  }) 
}
