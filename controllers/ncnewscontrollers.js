const {
  selectTopics,
  selectArticleById,
  selectAllArticles,
  selectAllComments,
  insertComment,
  updateArticle,
  removeCommentById
} = require("../models/ncnewsmodels");
const endPoints = require("../endpoints.json");
const { request } = require("../app");

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
  response.status(200).send(endPoints);
};

exports.getArticlesById = (request, response, next) => {
  const article_id = request.params.article_id;
  selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllArticles = (request, response, next) => {
  selectAllArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getAllComments = (request, response, next) => {
  const article_id = request.params.article_id;
  selectAllComments(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postComment = (request, response, next) => {
  const article_id = request.params.article_id;
  const newComment = request.body;

  insertComment(newComment.username, article_id, newComment.body).then((comment) => {
   
    response.status(201).send({comment})
  })
  .catch((error) => {
    next(error)
  })
}


exports.patchArticle = (request, response, next) => {
  const inc_votes = request.body.inc_votes
  const article_id = request.params.article_id;

  updateArticle(inc_votes, article_id).then((article) => {
    response.status(201).send({article})
  })
  .catch((error) => {
    next(error)
  })
}

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id).then(() => {
  
    response.status(204).send();
  })
  .catch((error) => {
    next(error)
  })
}
