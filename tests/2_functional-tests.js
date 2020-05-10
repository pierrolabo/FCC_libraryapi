/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var server = require('../server');
let testId = '';
const wrongId = '5eb71c9b3bcf4200774b82c7';
chai.use(chaiHttp);

suite('Functional Tests', function () {
  suite('Routing tests', function () {
    suite(
      'POST /api/books with title => create book object/expect book object',
      function () {
        test('Test POST /api/books with title', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({
              title: 'great gatsby',
            })
            .end(function (req, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, 'great gatsby');
              assert.isArray(res.body.comments, 'should be an empty array');
              assert.property(res.body, '_id', 'should have an _id property');
              testId = res.body._id;
              done();
            });
        });

        test('Test POST /api/books with no title given', function (done) {
          chai
            .request(server)
            .post('/api/books')
            .send({})
            .end(function (req, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body, 'missing title');
              done();
            });
        });
      }
    );

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai
          .request(server)
          .get('/api/books')
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(
              res.body[0],
              'commentcount',
              'Books in array should contain commentcount'
            );

            assert.property(
              res.body[0],
              'title',
              'Books in array should contain title'
            );
            assert.property(
              res.body[0],
              '_id',
              'Books in array should contain _id'
            );
            done();
          });
      });
    });

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${wrongId}`)
          .end(function (req, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'no book exists');

            done();
          });
      });

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai
          .request(server)
          .get(`/api/books/${testId}`)
          .end(function (req, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'great gatsby');
            assert.isArray(res.body.comments, 'Could be an empty/full array');
            assert.equal(res.body._id, testId);
            done();
          });
      });
    });

    suite(
      'POST /api/books/[id] => add comment/expect book object with id',
      function () {
        test('Test POST /api/books/[id] with comment', function (done) {
          //done();
          chai
            .request(server)
            .post(`/api/books/${testId}`)
            .send({
              comment: 'pleutre',
            })
            .end(function (req, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.title, 'great gatsby');
              assert.equal(res.body._id, testId);
              expect(res.body.comments).to.include('pleutre');
              done();
            });
        });
      }
    );
  });
});
