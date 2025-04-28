const endPoints = require("../endpoints.json");
const { fetchTopics } = require("../models/models");

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
