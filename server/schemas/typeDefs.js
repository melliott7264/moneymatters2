const { gql } = require('apollo-server-express');

// Mutation names and arguments (including types) must match contents of mutations file on front-end

const typeDefs = gql`
  type Query {
    me: User
    users: [User]
    articles: [Article]
    article(_id: ID!): Article
    allComments: [Comment]
    comments(articleId: ID!): [Comment]
    comment(_id: ID!): Comment
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveArticle(
      post: Boolean
      articleDate: String!
      source: String!
      title: String!
      description: String!
      url: String!
    ): Article
    postArticle(_id: ID!, post: Boolean!): Article
    removeArticle(_id: ID!): Article
    addComment(articleId: ID!, commentBody: String!, username: String): Comment
    removeComment(_id: ID!, articleId: ID!): Comment
    editComment(_id: ID!, commentBody: String!): Comment
  }

  type User {
    _id: ID
    username: String
    email: String
    articleCount: Int
    savedArticles: [Article]
  }

  type Article {
    _id: ID
    userId: ID
    post: Boolean
    articleDate: String
    postDate: String
    source: String
    title: String
    description: String
    url: String
    username: String
    commentCount: Int
    comments: [Comment]
  }

  type Comment {
    _id: ID
    articleId: ID
    commentBody: String
    postDate: String
    username: String
  }

  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;
