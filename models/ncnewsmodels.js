const format = require("pg-format");
const db = require("../db/connection");

exports.selectTopics = () => {
  const selectQuery = format(`SELECT * FROM topics;`);
  return db.query(selectQuery).then((result) => {
    return result.rows
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
    .then(({rows}) => {
      if (rows.length === 0){
        return Promise.reject({status: 404, message: 'article does not exist'})
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
      COUNT(comments.comment_id) AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;
    `,
    );
    return db.query(selectArticlesQuery).then((result) => {
    return(result.rows)
   });
  };

