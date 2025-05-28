const express = require("express");
const commentsRouter = express.Router();
const {
  deleteComment,
  patchCommentById,
} = require("../controllers/controllers");

commentsRouter.delete("/:comment_id", deleteComment);
commentsRouter.patch("/:comment_id", patchCommentById);

module.exports = commentsRouter;
