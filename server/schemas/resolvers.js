const { AuthenticationError } = require('apollo-server-express');
const { User, Article, Comment } = require('../models');
const { findOneAndDelete, findOneAndUpdate } = require('../models/Comment');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    // return all the users - for testing only!
    users: async (parent, args, context) => {
      const userData = await User.find({});
      return userData;
    },
    // return all the user information for the current logged in user
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .populate({ path: 'savedArticles', populate: { path: 'comments' } })
          .select('-__v');

        console.log(userData);

        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
    // return all the articles saved by all the users
    articles: async (parent, args, context) => {
      const articleData = await Article.find({})
        .populate({ path: 'comments', model: 'Comment', select: '-__v' })
        .select('-__v');
      console.log(articleData);

      return articleData;
    },

    // return a specific article by article id
    article: async (parent, { _id }, context) => {
      const articleData = await Article.findById({ _id: _id })
        .populate({ path: 'comments', model: 'Comment', select: '-__v' })
        .select('-__v');

      return articleData;
    },

    // return all the comments for all articles
    allComments: async (parent, args, context) => {
      const commentData = await Comment.find({});
      console.log(commentData);
      return commentData;
    },

    // return all comments for the selected article
    comments: async (parent, { articleId }, context) => {
      const commentData = await Comment.find({
        articleId: articleId,
      });

      return commentData;
    },

    // return a specific comment by comment id
    comment: async (parent, { _id }, context) => {
      const commentData = await Comment.findById({ _id: _id });

      return commentData;
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      console.log(email, password);
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },

    // Mark article as a post(public) by changing post to true
    postArticle: async (parent, { _id, post }, context) => {
      if (context.user) {
        const articleData = await Article.findOneAndUpdate(
          { _id: _id },
          { post: post },
          { new: true }
        );

        return articleData;
      }
      throw new AuthenticationError('Not logged in');
    },

    // Save article to logged in user
    saveArticle: async (
      parent,
      { post, articleDate, source, title, description, url },
      context
    ) => {
      if (context.user) {
        const articleData = await Article.create({
          username: context.user.username,
          userId: context.user._id,
          post: post,
          articleDate: articleDate,
          source: source,
          title: title,
          description: description,
          url: url,
        });

        const savedArticle = await User.findOneAndUpdate(
          { _id: context.user._id },
          {
            $addToSet: {
              savedArticles: articleData._id,
            },
          },
          { new: true }
        );

        return articleData;
      }
      throw new AuthenticationError('Not logged in');
    },
    // remove article from logged in user - user must be logged i
    removeArticle: async (parent, { _id }, context) => {
      if (context.user) {
        const removedArticle = await Article.findOneAndDelete({ _id: _id });

        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedArticles: _id } },
          { new: true }
        );

        return removedArticle;
      }
      throw new AuthenticationError('Not logged in');
    },
    // add a comment to the specified article - user must be logged i
    addComment: async (
      parent,
      { articleId, commentBody, username },
      context
    ) => {
      if (context.user) {
        commentData = await Comment.create({
          articleId,
          commentBody,
          username,
        });

        savedComment = await Article.findOneAndUpdate(
          { _id: articleId },
          { $addToSet: { comments: commentData._id } },
          { new: true }
        );

        return commentData;
      }
      throw new AuthenticationError('Not logged in');
    },
    // remove a specific comment from the specified article - user must be logged i
    removeComment: async (parent, { _id, articleId }, context) => {
      if (context.user) {
        commentData = await Comment.findOneAndDelete({ _id: _id });

        removedComment = await Article.findOneAndUpdate(
          { _id: articleId },
          { $pull: { comments: _id } },
          { new: true }
        );

        return commentData;
      }
      throw new AuthenticationError('Not logged in');
    },
    // edit the specified comment - user must be logged in
    editComment: async (parent, { _id, commentBody }, context) => {
      if (context.user) {
        commentData = await Comment.findOneAndUpdate(
          { _id: _id },
          { commentBody: commentBody },
          { new: true }
        );

        return commentData;
      }
      throw new AuthenticationError('Not logged in');
    },
  },
};

module.exports = resolvers;
