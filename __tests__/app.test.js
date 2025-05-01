const request = require("supertest");
const app = require("../app");
const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const { response } = require("express");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("when the endpoint does not exist", () => {
  test("404: responds with 'Path not found' when given an invalid endpoint", () => {
    return request(app)
      .get("/api/invalid")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: responds with an array of topic objects, each having slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        topics.forEach((topics) => {
          expect(topics).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: responds with an article object, including comment_count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toEqual({
          author: "butter_bridge",
          title: "Living in the shadow of a great man",
          article_id: 1,
          body: "I find this existence challenging",
          topic: "mitch",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11,
        });
      });
  });

  test("404: responds with Article not found when article_id doesnt exist", () => {
    return request(app)
      .get("/api/articles/2000")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Article not found");
      });
  });

  test("400: responds with Bad request when article_id is invalid", () => {
    return request(app)
      .get("/api/articles/notANumber")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: responds with an array of article objects, each containing correct properties", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(13);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });

  test("200: if sort_by query is sorted by created_at ascending", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("created_at", { descending: false });
      });
  });

  test("200: if sort_by query is sorted by votes descending", () => {
    return request(app)
      .get("/api/articles?sort_by=votes&order=desc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSortedBy("votes", { descending: true });
      });
  });

  test("400: if sort_by query is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_column&order=asc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid sort_by column");
      });
  });

  test("400: if order query is invalid", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=invalid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid order value");
      });
  });

  test("200: responds with an array of articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=created_at&order=asc")
      .expect(200)
      .then((response) => {
        console.log(response.body);
        const articles = response.body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });

  test("200: responds with an array of all articles if no topic is provided", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=asc")
      .expect(200)
      .then((response) => {
        const articles = response.body.articles;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
      });
  });

  test("404: responds with a 'Topic not found' error for invalid topic", () => {
    return request(app)
      .get("/api/articles?topic=nonexistent&sort_by=created_at&order=asc")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Topic not found");
      });
  });

  test("400: responds with an 'Invalid sort_by column' error for invalid sort_by", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=invalid_column&order=asc")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid sort_by column");
      });
  });

  test("400: responds with an 'Invalid order value' error for invalid order", () => {
    return request(app)
      .get("/api/articles?topic=mitch&sort_by=created_at&order=invalid")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Invalid order value");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: responds with an array of comment objects for the given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const comments = response.body.comments;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              article_id: 1,
            })
          );
        });
      });
  });
  test("404: responds with Not Found when the article_id does not exist", () => {
    return request(app)
      .get("/api/articles/2000/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });

  test("400: responds with Bad Request when the article_id is invalid", () => {
    return request(app)
      .get("/api/articles/aaa/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: responds with the posted comment object", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Tehran is so Wild",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 1,
            author: "icellusedkars",
            body: "Tehran is so Wild",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });

  test("201: responds with the posted comment object with additional properties", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Tehran is so Wild",
      extra_property: "extra_value",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then((response) => {
        const comment = response.body.comment;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: 1,
            author: "icellusedkars",
            body: "Tehran is so Wild",
            votes: 0,
            created_at: expect.any(String),
          })
        );
        expect(comment).not.toHaveProperty("extra_property");
      });
  });

  test("400: responds with an error when body is missing fields", () => {
    const newComment = {
      username: "icellusedkars",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("404: responds with error when posting to non-existent article", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Tehran is so Wild",
    };

    return request(app)
      .post("/api/articles/2000/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });

  test("400: responds with Bad Request when article_id is invalid", () => {
    const newComment = {
      username: "icellusedkars",
      body: "Nice article!",
    };

    return request(app)
      .post("/api/articles/katherine/comments")
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad request");
      });
  });

  test("404: responds with Not Found when username does not exist", () => {
    const newComment = {
      username: "nonexistent_user",
      body: "Great post!",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Path not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: should increment votes and return updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(200)
      .then(({ body }) => {
        expect(typeof body.article).toBe("object");
        expect(body.article.votes).toBe(110);
      });
  });

  test("400: should respond with bad request for invalid inc_votes", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "two" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: should respond with article not found for invalid id", () => {
    return request(app)
      .patch("/api/articles/2000")
      .send({ inc_votes: 10 })
      .then(({ body }) => {
        expect(body.msg).toBe("Article not found");
      });
  });

  test("400: should respond with bad request when inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: should delete a comment and respond with no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("400: invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/one")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad request");
      });
  });

  test("404: comment not found for given comment_id", () => {
    return request(app)
      .delete("/api/comments/2000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });
});

describe("GET /api/users", () => {
  test("200: responds with an array of users objects, each containing correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const users = response.body.users;
        expect(Array.isArray(users)).toBe(true);
        expect(users).toHaveLength(4);
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
