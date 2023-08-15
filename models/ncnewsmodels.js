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
    