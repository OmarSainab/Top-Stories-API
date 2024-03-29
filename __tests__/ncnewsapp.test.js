const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data");
const endPoints = require("../endpoints.json");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET:200 sends an array of topic objects with slug and description properties to the client", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toEqual(expect.any(Array));
        expect(Object.keys(response.body.topics[0])).toEqual(
          expect.arrayContaining(["slug", "description"])
        );
      });
  });
});
describe("/api", () => {
  test("GET:200 Responds with an object describing all the available endpoints on your API", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual(endPoints);
      });
  });
});
describe("ALL /notapath", () => {
  test("404: should respond with a custom 404 message when the path is not found", () => {
    return request(app)
      .get("/api/banana")
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe("Not Found");
      });
  });
});
describe("/api/articles/:article_id", () => {
  test("GET:200 sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => { expect(response.body.article).toHaveProperty(
        "article_id",
        expect.any(Number)
      );
      expect(response.body.article).toHaveProperty(
        "title",
        expect.any(String)
      );
      expect(response.body.article).toHaveProperty(
        "topic",
        expect.any(String)
      );
      expect(response.body.article).toHaveProperty(
        "author",
        expect.any(String)
      );
      expect(response.body.article).toHaveProperty(
        "created_at",
        expect.any(String)
      );
      expect(response.body.article).toHaveProperty(
        "votes",
        expect.any(Number)
      );
      expect(response.body.article).toHaveProperty(
        "article_img_url",
        expect.any(String)
      );
      expect(response.body.article).toHaveProperty(
        "comment_count",
        expect.any(String)
      );
      });
  });
  test("GET:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
  test("GET:400 sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});

describe("/api/articles", () => {
  test("GET:200 Responds with an articles array of article objects, each of which with specific properties: ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id", expect.any(Number));
          expect(article).toHaveProperty("title", expect.any(String));
          expect(article).toHaveProperty("topic", expect.any(String));
          expect(article).toHaveProperty("author", expect.any(String));
          expect(article).toHaveProperty("created_at", expect.any(String));
          expect(article).toHaveProperty("votes", expect.any(Number));
          expect(article).toHaveProperty("article_img_url", expect.any(String));
          expect(article).toHaveProperty("comment_count", expect.any(String));
        });
      });
  });
  test("GET:200 the articles should be returned in descending order of created_at ", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});
describe("/api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id of which each comment should have the specified properties", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toHaveLength(11);
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("article_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("body");
        });
      });
  });

  test("200: Comments should be served with the most recent comments first. ", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });

  test("GET:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
  test("GET:400 sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .get("/api/articles/banana/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("GET:200 sends an appropriate message when given a valid article ID but article has no comments ", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toEqual([]);
      });
  });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('POST:201 inserts a new comment to the db and sends the new comment back to the client', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'This is amazing'
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual(   {
          comment_id: 19,
          body: 'This is amazing',
          article_id: 1,
          author: 'butter_bridge',
          votes: 0,
          created_at: expect.any(String)
        } );
      });
  });
  test('POST:201 inserts a new comment to the db and sends the new comment back ignoring the invalid property', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'This is amazing',
      fruit: 'apple'
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(201)
      .then((response) => {
        expect(response.body.comment).toEqual(   {
          comment_id: 19,
          body: 'This is amazing',
          article_id: 1,
          author: 'butter_bridge',
          votes: 0,
          created_at: expect.any(String)
        } );
      });
  });
  test('POST:400 responds with an appropriate error message when provided with a bad username (no name)', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        body: 'This is amazing'
      })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('Bad Request');
      });
  });
  test('POST:404 sends an appropriate error message when given a valid but non-existent id', () => {
      const newComment = {
        username: 'butter_bridge',
        body: 'This is amazing'
      };
    return request(app)
      .post('/api/articles/999/comments')
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('Not Found');
      });
  });
  test('POST:400 sends an appropriate error message when article_id is not a number', () => {
    const newComment = {
      username: 'butter_bridge',
      body: 'This is amazing'
    };
    return request(app)
      .post('/api/articles/not-an-article/comments')
      .send(newComment)
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('Bad Request');
      });
  });
  test('POST:404 responds with an appropriate error message when username is not a registered user', () => {
    const newComment = {
      username: 'unregistered',
      body: 'This is amazing'
    };
    return request(app)
      .post('/api/articles/1/comments')
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('Not Found');
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("PATCH:201 updates an article by article_id - increments the current article's vote", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 10 })
      .expect(201)
      .then((response) => {
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 110,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:201 updates an article by article_id - decrements the current article's vote", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -30 })
      .expect(201)
      .then((response) => {
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 70,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:200 updates an article by article_id ignoring the invalid property", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -30, title: "title", topic: "topic" })
      .expect(201)
      .then((response) => {
        expect(response.body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 70,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("PATCH:400 sends an appropriate error message when given an invalid vote value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "ten" })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("PATCH:404 sends an appropriate error message when given a valid but non-existent id", () => {
    return request(app)
      .patch("/api/articles/999")
      .send({ inc_votes: 10 })
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("article does not exist");
      });
  });
  test("PATCH:400 sends an appropriate error message when given an invalid id", () => {
    return request(app)
      .patch("/api/articles/not-an-article")
      .send({ inc_votes: 10 })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("PATCH:400 sends an appropriate error message when given incorrect object key", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ donothing: 10 })
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});
describe("/api/comments/:comment_id", () => {
  test("DELETE: 204 deletes the given comment by comment_id and sends no body back", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("DELETE: 404 responds with appropriate error message when given non-existent id", () => {
    return request(app)
      .delete("/api/comments/999")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("comment does not exist");
      });
  });
});
describe("/api/users", () => {
  test("GET 200: responds with an array of objects, each object should have the specified properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toEqual(expect.any(Array));
        expect(Object.keys(response.body.users[0])).toEqual(
          expect.arrayContaining(["username", "name", "avatar_url"])
        );
      });
  });
});
describe("FEATURE:/api/articles", () => {
  test("GET 200: Allows client to filter articles by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles.length).toBe(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
      });
  });
  test("GET 200: If the query is omitted, the endpoint should respond with all articles.", () => {
    return request(app)
      .get("/api/articles?topic")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        expect(articles.length).toBe(5);
        articles.forEach((article) => {
          expect(article).toHaveProperty("topic");
        });
      });
  });
  test("GET 404: Returns an error message when passed an invalid topic query", () => {
    return request(app)
      .get("/api/articles?topic=invalid")
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe("Not Found");
      });
  });
  test("GET 200: Allows client to sort_by, which sorts the articles by any valid column (defaults to date)", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("votes");
      });
  });
  test("GET 400: Returns an error message when passed an invalid sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
  test("GET 200: Allows client to order, which can be set to asc or desc for ascending or descending (defaults to descending)", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy(
          "created_at", {ascending: true}
        )
      });
  });
  test("GET 400: Returns an error message when passed an invalid order query", () => {
    return request(app)
      .get("/api/articles?order=invalid")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Bad Request");
      });
  });
});
describe("FEATURE:/api/articles/:article_id", () => {
  test("GET 200: response includes comment_count by article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        expect(response.body.article).toHaveProperty("comment_count", "11");
      });
  });
});