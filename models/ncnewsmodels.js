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
          message: "Not Found",
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
    `,
    );
    return db.query(selectArticlesQuery).then((result) => { 
    return(result.rows)
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