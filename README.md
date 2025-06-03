# 📰 NC News API

This is a RESTful API for a news website. It provides access to articles, topics, users, and comments. The API is built using **Node.js**, **Express**, and **PostgreSQL**, and is thoroughly tested with **Jest** and **Supertest**.

---

## 📦 Tech Stack

- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Testing:** Jest, Supertest

---

## 📁 Project Structure

```
├── app.js
├── db
│   ├── connection.js
│   ├── data
│   │   ├── development-data
│   │   └── test-data
│   ├── setup-dbs.sql
│   └── seeds
│       └── run-seed.js
│       └── seed.js
│       └── utils.js
├── controllers
│       └── controllers.js
├── models
│       └── models.js
├── routes
│       └── api-router.js
│       └── articles-router.js
│       └── comments-router.js
│       └── topics-router.js
│       └── users-router.js
├── tests
│   └── app.test.js
├── endpoints.json
├── listen.js
└── package.json
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/nc-news-api.git
cd nc-news-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create two `.env` files in the root directory:

- `.env.development` containing:

  ```
  PGDATABASE=nc_news
  ```

- `.env.test` containing:

  ```
  PGDATABASE=nc_news_test
  ```

### 4. Set Up the Database

Make sure PostgreSQL is running locally, then run:

```bash
npm run setup-dbs
```

This will create both development and test databases.

### 5. Seed the Database

```bash
npm run seed
```

### 6. Run the Server

```bash
npm start
```

The server should now be running at `http://localhost:9090/`.

### 7. Run Tests

```bash
npm test
```

---

## 📌 Available Endpoints

A list of all available endpoints can be found by sending a GET request to:

```
GET /api
```

Returns a JSON object describing all available endpoints.

```
GET /api/topics
```

Returns an array of all topics.

```
GET /api/articles/:article_id
```

Returns an article by ID, including a comment count.

```
PATCH /api/articles/:article_id
```

Updates the vote count of an article.

```
GET /api/articles
```

Returns an array of articles, with optional queries for sorting, ordering, and filtering by topic.

```
GET /api/articles/:article_id/comments
```

Returns all comments for a given article ID.

```
POST /api/articles/:article_id/comments
```

Adds a new comment to an article.

```
DELETE /api/comments/:comment_id
```

Deletes a comment by ID.

```
PATCH /api/comments/:comment_id
```

Updates the vote count of a comment.

```
GET /api/users
```

Returns an array of all users.

```
GET /api/users/:username
```

Returns a user by username.

---

## ❗ Error Handling

The API will respond with appropriate status codes and messages for the following scenarios:

- **400 Bad Request:** Invalid input (e.g. invalid IDs or missing fields)
- **404 Not Found:** Resource not found
- **405 Method Not Allowed:** For unsupported methods

---

## 🧑‍💻 Author

Created by Pourya Azari

---

## 🛠 Author Notes

This project was built as part of a backend-focused portfolio piece. Future improvements may include authentication, user roles, and full CRUD functionality on more resources. Feel free to fork, clone, or contribute!

---
