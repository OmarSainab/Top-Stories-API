const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed')
const {articleData, commentData, topicData, userData} = require('../db/data/test-data')

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
          expect(response.body).toEqual({
            "GET /api": {
              "description": "serves up a json representation of all the available endpoints of the api"
            },
            "GET /api/topics": {
              "description": "serves an array of all topics",
              "queries": [],
              "exampleResponse": {
                "topics": [{ "slug": "football", "description": "Footie!" }]
              }
            },
            "GET /api/articles": {
              "description": "serves an array of all articles",
              "queries": ["author", "topic", "sort_by", "order"],
              "exampleResponse": {
                "articles": [
                  {
                    "title": "Seafood substitutions are increasing",
                    "topic": "cooking",
                    "author": "weegembump",
                    "body": "Text from the article..",
                    "created_at": "2018-05-30T15:59:13.341Z",
                    "votes": 0,
                    "comment_count": 6
                  }
                ]
              }
            },
            "GET /api/comments": {
              "description": "serves an array of all comments",
              "queries": ["comments", "votes", "sort_by", "order"],
              "exampleResponse": {
                "comments": [
                  {
                    "body": "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                    "votes": 16,
                    "author": "butter_bridge",
                    "article_id": 9,
                    "created_at": 1586179020000
                  }
                ]
              }
            },
            "GET /api/users": {
              "description": "serves an array of all users",
              "queries": ["username", "name"],
              "exampleResponse": {
                "users": [
                  {
                    "username": "butter_bridge",
                    "name": "jonny",
                    "avatar_url": "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
                  }
                ]
              }
            }
          }
          
          );
        });
    })
});