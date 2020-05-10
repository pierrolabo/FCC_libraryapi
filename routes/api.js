/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';

var expect = require('chai').expect;
const Book = require('../models/book');

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.fetchAll(function (result) {
        let parsedResult = [...result].map((obj) => {
          let newObj = {
            _id: obj._id,
            title: obj.title,
            commentcount: obj.comments ? obj.comments.length : 0,
          };
          return newObj;
        });
        res.json(parsedResult);
      });
    })

    .post(function (req, res) {
      var title = req.body.title;
      if (req.body.title) {
        const newBook = new Book(title);
        newBook.saveBook(function (result) {
          res.json(result);
        });
      } else {
        res.json('missing title');
      }

      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.deleteAll(function (result) {
        res.json(result);
      });
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      var bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.fetchById(bookid, function (result) {
        if (result) {
          res.json(result);
        } else {
          res.json('no book exists');
        }
      });
    })

    .post(function (req, res) {
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get

      Book.updateComments(bookid, comment, function (result) {
        res.json(result);
      });
    })

    .delete(function (req, res) {
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteById(bookid, function (result) {
        res.json(result);
      });
    });
};
