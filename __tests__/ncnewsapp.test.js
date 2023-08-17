const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data')
const endPoints = require("../endpoints.json")

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe('/api/topics', () => {
    test('GET:200 sends an array of topic objects with slug and description properties to the client', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
          expect(response.body.topics).toEqual(expect.any(Array));
          expect(Object.keys(response.body.topics[0])).toEqual(
            expect.arrayContaining(['slug', 'description'])
          );
        });
    })
});
describe('/api', () => {
    test('GET:200 Responds with an object describing all the available endpoints on your API', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
          expect(response.body).toEqual( endPoints
          );
        });
    })
});
describe('ALL /notapath', () => {
  test('404: should respond with a custom 404 message when the path is not found', () => {
    return request(app)
      .get('/api/banana')
      .expect(404)
      .then(({ body }) => {
        const { message } = body;
        expect(message).toBe( 'Not Found'
        );
      });
  })
});
describe('/api/articles/:article_id', () => {
  test('GET:200 sends a single article to the client', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then((response) => {
        expect(response.body.article).toMatchObject([{
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }]);
      });
  });
  test('GET:404 sends an appropriate error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('article does not exist');
      });
  });
  test('GET:400 sends an appropriate error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/not-an-article')
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('Invalid id');
      });
  });
});

describe('/api/articles', () => {
  test('GET:200 Responds with an articles array of article objects, each of which with specific properties: ', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
        articles.forEach((article) => {
          expect(article).toHaveProperty('article_id', expect.any(Number));
          expect(article).toHaveProperty('title', expect.any(String));
          expect(article).toHaveProperty('topic', expect.any(String));
          expect(article).toHaveProperty('author', expect.any(String));
          expect(article).toHaveProperty('created_at', expect.any(String));
          expect(article).toHaveProperty('votes', expect.any(Number));
          expect(article).toHaveProperty('article_img_url', expect.any(String));
          expect(article).toHaveProperty('comment_count', expect.any(String));

        })
      });
  })
  test('GET:200 the articles should be returned in descending order of created_at ', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        expect(response.body.articles).toBeSortedBy("created_at", { descending: true });
      });
    });
});
describe('/api/articles/:article_id/comments', () => {
  test('200: Responds with an array of comments for the given article_id of which each comment should have the specified properties', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toHaveLength(11)
        expect(Array.isArray(comments)).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty('comment_id');
          expect(comment).toHaveProperty('author');
          expect(comment).toHaveProperty('article_id');
          expect(comment).toHaveProperty('votes');
          expect(comment).toHaveProperty('created_at');
          expect(comment).toHaveProperty('body');
        });
      });
  });

test('200: Comments should be served with the most recent comments first. ', () => {
  return request(app)
    .get('/api/articles/3/comments')
    .expect(200)
    .then((response) => {
      expect(response.body.comments).toBeSortedBy("created_at", { descending: true });
    });
  });

  test('GET:404 sends an appropriate error message when given a valid but non-existent id', () => {
    return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then((response) => {
        expect(response.body.message).toBe('article does not exist');
      });
  });
  test('GET:400 sends an appropriate error message when given an invalid id', () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe('Invalid id');
      });
  });
  test('GET:200 sends an appropriate error message when given a valid article ID but article has no comments ', () => {
    return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then((response) => {
        expect(response.body.message).toBe('article has no comments');
      });
  });
});
