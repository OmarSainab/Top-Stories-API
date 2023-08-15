const { selectTopics, selectArticleById } = require("../models/ncnewsmodels");
const endPoints = require("../endpoints.json")

exports.getTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getEndpoints = (request, response, next) => {
      response.status(200).send( endPoints );

};

exports.getArticlesById = (request, response, next) => {
  const  article_id  = request.params.article_id;
  selectArticleById(article_id).then((article) => {
    response.status(200).send({ article });
  })
  .catch((error) => {
    next(error);
  })
};