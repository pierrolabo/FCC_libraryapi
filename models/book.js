const Mongoose = require('mongoose');
const getDb = require('../utils/database').getDb;
const Schema = Mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String },
  comments: { type: Array, default: [] },
});
const MongoBook = Mongoose.model('book', bookSchema);

class Book extends MongoBook {
  constructor(title, comments) {
    super();
    this.title = title;
    this.comments = typeof comments === 'undefined' ? [] : comments;
  }

  saveBook(cb) {
    super.save(function (err, res) {
      if (err) {
        console.log(err);
      }
      cb(res);
    });
  }

  static fetchAll(cb) {
    super.find({}, function (err, res) {
      if (err) console.log(err);
      cb(res);
    });
  }
  static fetchById(id, cb) {
    super.findById(id, function (err, res) {
      if (err) console.log(err);
      cb(res);
    });
  }

  static async updateComments(id, comment, cb) {
    const query = { _id: id };
    const update = { $push: { comments: comment } };
    let res = await super.findOneAndUpdate(query, update, {
      new: true,
      upsert: true,
      rawResult: true,
      useFindAndModify: false,
    });
    cb(res.value);
  }
  static deleteById(id, cb) {
    super.deleteOne({ _id: id }, function (err) {
      if (err) console.log(err);
      cb('complete delete successful');
    });
  }
  static deleteAll(cb) {
    super.deleteMany({}, function (err, res) {
      if (err) console.log(err);
      cb('complete delete successful');
    });
  }
}
module.exports = Book;
