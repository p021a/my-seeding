const db = require("./connection");

function getAllUsers() {
  return db
    .query(`SELECT * FROM users`)
    .then((result) => console.log(result.rows, "Get All Users <========"));
}

function getArticlesCoding() {
  return db
    .query(`SELECT * FROM articles WHERE topic = $1;`, ["coding"])
    .then((result) =>
      console.log(result.rows, "Get Articles Coding <========")
    );
}

function getZeroVote() {
  return db
    .query(`SELECT * FROM comments WHERE votes < 0`)
    .then((result) => console.log(result.rows, "Get Zero Vote <========"));
}

function getAllTopics() {
  return db
    .query(`SELECT * FROM topics`)
    .then((result) => console.log(result.rows, "Get All Topics <========"));
}

function getGrumpy19Users() {
  return db
    .query(`SELECT * FROM articles WHERE author = 'grumpy19'`)
    .then((result) => console.log(result.rows, "Get All grumpy19 <========"));
}

function getAllCommentsMoreThan10() {
  return db
    .query(`SELECT * FROM comments WHERE votes > 10`)
    .then((result) => console.log(result.rows, "Get All +10 Votes <========"));
}

// getAllUsers();
// getArticlesCoding();
// getZeroVote();
// getAllTopics();
// getGrumpy19Users();
// getAllCommentsMoreThan10();
