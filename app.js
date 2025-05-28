const express = require("express");
const app = express();
const db = require("./db/connection");
const cors = require("cors");

const apiRouter = require("./routes/api-router");
const usersRouter = require("./routes/users-router");
const topicsRouter = require("./routes/topics-router");
const articlesRouter = require("./routes/articles-router");
const commentsRouter = require("./routes/comments-router");

app.use(express.json(), cors());

app.use("/api", apiRouter);

app.use("/api/users", usersRouter);

app.use("/api/topics", topicsRouter);

app.use("/api/articles", articlesRouter);

app.use("/api/comments", commentsRouter);

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

app.all("/*splat", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
