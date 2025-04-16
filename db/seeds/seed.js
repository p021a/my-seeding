const db = require("../connection");
const format = require("pg-format");
const { convertTimestampToDate, createRef } = require("./utils");
const data = require("../data/development-data/index");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE topics(
        slug VARCHAR PRIMARY KEY, 
        description VARCHAR NOT NULL, 
        img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users(
        username VARCHAR PRIMARY KEY, 
        name VARCHAR NOT NULL, 
        avatar_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles(
        article_id SERIAL PRIMARY KEY, 
        title VARCHAR NOT NULL, 
        topic VARCHAR REFERENCES topics(slug) NOT NULL, 
        author VARCHAR REFERENCES users(username) NOT NULL, 
        body TEXT NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
        votes INT DEFAULT 0, article_img_url VARCHAR(1000))`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE comments(
        comment_id SERIAL PRIMARY KEY, 
        article_id INT REFERENCES articles(article_id) NOT NULL, 
        body TEXT NOT NULL, 
        votes INT DEFAULT 0, 
        author VARCHAR REFERENCES users(username) NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
      );
    })
    .then(() => {
      const formatedTopics = topicData.map((topic) => {
        return [topic.slug, topic.description, topic.img_url];
      });

      const insertTopics = format(
        `INSERT INTO topics (slug, description, img_url) VALUES %L`,
        formatedTopics
      );
      return db.query(insertTopics);
    })
    .then(() => {
      const formatedUsers = userData.map((user) => {
        return [user.username, user.name, user.avatar_url];
      });

      const insertUsers = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L`,
        formatedUsers
      );
      return db.query(insertUsers);
    })
    .then(() => {
      const formatedArticles = articleData.map((article) => {
        const convertedArticle = convertTimestampToDate(article);
        return [
          article.title,
          article.topic,
          article.author,
          article.body,
          convertedArticle.created_at,
          article.votes,
          article.article_img_url,
        ];
      });

      const insertArticles = format(
        `INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *`,
        formatedArticles
      );
      return db.query(insertArticles);
    })
    .then((result) => {
      const articleRefObject = createRef(result.rows);
      const formatedComments = commentData.map((comment) => {
        const convertedComment = convertTimestampToDate(comment);
        return [
          articleRefObject[comment.article_title],
          comment.body,
          comment.votes,
          comment.author,
          convertedComment.created_at,
        ];
      });

      const insertComments = format(
        `INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L`,
        formatedComments
      );
      return db.query(insertComments);
    });
};

seed(data).then(() => {
  console.log("Seeding complete");
  return db.end();
});

module.exports = seed;
