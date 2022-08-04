const { Schema, model } = require('mongoose');
var moment = require('moment');

// const articleSchema = require('./Article');

const commentSchema = new Schema({
  articleId: {
    type: Schema.Types.ObjectId,
  },
  commentBody: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date,
    default: Date.now,
    get: (timestamp) => moment(timestamp).format('MMMM Do YYYY, h:mm:ss a'),
  },
  username: {
    type: String,
  },
});

const Comment = model('Comment', commentSchema);

module.exports = Comment;
