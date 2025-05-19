const express = require("express");
const app = express();
const db = require("./db/connection");
const usersRouter = require("./routes/users-router");
const cors = require("cors");
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getArticlesComments,
  postComment,
  patchArticleById,
  deleteComment,
  getUsers,
} = require("./controllers/controllers");

app.use(express.json(), cors());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getArticlesComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticleById);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getUsers);

app.use("/api/users", usersRouter);

app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    return res.status(err.status).send({ msg: err.msg });
  } else if (err.code === "22P02" || err.code === "23502") {
    return res.status(400).send({ msg: "Bad request" });
  } else if (err.code === "23503") {
    return res.status(404).send({ msg: "Path not found" });
  } else {
    return res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
