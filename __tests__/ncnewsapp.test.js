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
        expect(response.body.articles[1]).toEqual( 
          {
            article_id: 6,
            title: 'A',
            topic: 'mitch',
            author: 'icellusedkars',
            created_at: "2020-10-18T01:00:00.000Z",
            votes: 0,
            comment_count: '1'
          }
        );
      });
  })
  test('GET:200 the articles should be sorted by date in descending order', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then((response) => {
        expect(response.body.articles[0]).toEqual( 
          {
            article_id: 3,
            title: 'Eight pug gifs that remind me of mitch',
            topic: 'mitch',
            author: 'icellusedkars',
            created_at: "2020-11-03T09:12:00.000Z",
            votes: 0,
            comment_count: '2'
          }
        );
      });
    });
});



