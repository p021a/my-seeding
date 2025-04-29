const endPoints = require("../endpoints.json");
const { fetchTopics, receivedArticleById } = require("../models/models");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endPoints });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  receivedArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
