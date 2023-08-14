const express = require("express");
const app = express();
const { getTopics } = require("./controllers/ncnewscontrollers");

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((error, request, response, next) => {
    console.log(error, 'inside error handler')
    response.status(500).send({message: 'error'})
})



module.exports = app;