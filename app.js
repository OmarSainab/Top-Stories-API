const express = require("express");
const app = express();
const {
  getTopics,
  getEndpoints,
  getArticlesById,
  getAllArticles,
  getAllComments,
  postComment
} = require("./controllers/ncnewscontrollers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getAllComments);

app.post("/api/articles/:article_id/comments", postComment);

app.use((request, response) => {
  response.status(404).send({ message: "Not Found" });
});

app.use((error, request, response, next) => {
  if (error.message && error.status) {
    response.status(error.status).send({ message: error.message });
  } else if (error.code === "22P02" || error.code === "23502") {
    response.status(400).send({ message: "Bad request" });
  } else {
    next(error);
  }
});
app.use((error, request, response, next) => {
  if(error.code === "23503" && error.detail.includes("Key (article_id)") || error.detail.includes("Key (author)"))
  response.status(404).send({ message: "Not Found" });
else {
  next(error)
}
});

app.use((error, request, response, next) => {
  response.status(500).send({ message: "error" });
});

module.exports = app;
