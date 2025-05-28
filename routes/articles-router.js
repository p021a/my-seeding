const express = require("express");
const articlesRouter = express.Router();
const {
  getArticles,
  getArticleById,
  getArticlesComments,
  postComment,
  patchArticleById,
} = require("../controllers/controllers");

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getArticlesComments);
articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.patch("/:article_id", patchArticleById);

module.exports = articlesRouter;
