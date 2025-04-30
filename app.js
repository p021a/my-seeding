const express = require("express");
const app = express();
const db = require("./db/connection");
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticlesComments,
  postComment,
  patchArticleById,
  deleteComment,
} = require("./controllers/controllers");

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticlesComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad request" });
  }
  if (err.code === "23503") {
    res.status(404).send({ msg: "Path not found" });
  }
});

module.exports = app;
