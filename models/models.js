const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics;`).then((result) => {
    return result.rows;
  });
};

exports.receivedArticleById = (article_id) => {
  return db
    .query(
      "SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id;",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return result.rows[0];
    });
};

exports.fetchArticles = (sort_by, order, topic) => {
  let queryArgs = [];
  const promiseArray = [];
  let queryCount = 0;

  let queryStr = `
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id`;

  if (topic) {
    queryCount++;
    queryStr += ` WHERE articles.topic = $${queryCount}`;
    queryArgs.push(topic);
    promiseArray.push(
      db.query(`SELECT * FROM topics WHERE slug = $1`, [topic])
    );
  }

  queryStr += ` GROUP BY articles.article_id`;

  const validSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  if (sort_by && validSortBy.includes(sort_by)) {
    queryStr += ` ORDER BY ${sort_by}`;
  } else {
    return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
  }

  const validOrder = ["ASC", "DESC"];

  if (order && validOrder.includes(order.toUpperCase())) {
    queryStr += ` ${order.toUpperCase()}`;
  } else if (order && !validOrder.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: "Invalid order value" });
  } else {
    queryStr += " DESC";
  }

  promiseArray.unshift(db.query(queryStr, queryArgs));

  return Promise.all(promiseArray).then((results) => {
    if (topic && results[1].rowCount === 0) {
      return Promise.reject({ status: 404, msg: "Topic not found" });
    }
    const queryResult = results[0];
    return queryResult.rows;
  });
};

exports.fetchArticlesComments = (article_id) => {
  return db
    .query(
      "SELECT comment_id, votes, created_at, author, body, article_id FROM comments WHERE article_id = $1 ORDER BY created_at DESC",
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Path not found",
        });
      }
      return result.rows;
    });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      "INSERT INTO comments (author, article_id, body) VALUES ($1, $2, $3) RETURNING *;",
      [username, article_id, body]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
  return db
    .query(
      "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }
      return result.rows[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING*;", [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
    });
};

exports.fetchUsers = () => {
  return db.query("SELECT * FROM users").then((result) => {
    return result.rows;
  });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(
      `SELECT username, avatar_url, name FROM users WHERE username = $1;`,
      [username]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      }
      return result.rows[0];
    });
};
