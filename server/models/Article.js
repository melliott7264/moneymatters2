const { Schema, model } = require('mongoose');
var moment = require('moment');

const Comment = require('./Comment').schema;

const articleSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
    },
    post: {
      type: Boolean,
      default: false,
    },
    articleDate: {
      type: Date,
    },
    postDate: {
      type: Date,
      default: Date.now,
      get: (timestamp) => moment(timestamp).format('MMMM Do YYYY, h:mm:ss a'),
    },
    source: {
      type: String,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    url: {
      type: String,
    },
    username: {
      type: String,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    toJSON: {
      virtuals: true,
    },
  }
);

articleSchema.virtual('commentCount').get(function () {
  return this.comments.length;
});

const Article = model('Article', articleSchema);

module.exports = Article;
