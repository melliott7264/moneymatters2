import { gql } from '@apollo/client';

// Variables must match variables used in callback function in components and pages.
// Property names must match resolvers on back-end
// Arguments must match typeDefs on back-end

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_POST = gql`
  mutation postArticle($_id: ID!, $post: Boolean!) {
    postArticle(_id: $_id, post: $post) {
      _id
      userId
      post
      articleDate
      postDate
      source
      title
      description
      url
      username
      commentCount
    }
  }
`;

export const ADD_ARTICLE = gql`
  mutation saveArticle(
    $articleDate: String!
    $source: String!
    $title: String!
    $description: String!
    $url: String!
  ) {
    saveArticle(
      articleDate: $articleDate
      source: $source
      title: $title
      description: $description
      url: $url
    ) {
      _id
      userId
      post
      articleDate
      postDate
      source
      title
      description
      url
      username
      commentCount
    }
  }
`;

export const REMOVE_ARTICLE = gql`
  mutation removeArticle($id: ID!) {
    removeArticle(_id: $id) {
      _id
      title
      username
    }
  }
`;

export const ADD_COMMENT = gql`
  mutation addComment(
    $articleId: ID!
    $commentBody: String!
    $username: String
  ) {
    addComment(
      articleId: $articleId
      commentBody: $commentBody
      username: $username
    ) {
      _id
      articleId
      commentBody
      postDate
      username
    }
  }
`;

export const REMOVE_COMMENT = gql`
  mutation removeComment($id: ID!, $articleId: ID!) {
    removeComment(_id: $id, articleId: $articleId) {
      _id
      articleId
    }
  }
`;

export const EDIT_COMMENT = gql`
  mutation editComment($id: ID!, $commentBody: String!) {
    editComment(_id: $id, commentBody: $commentBody) {
      _id
      articleId
      commentBody
      postDate
      username
    }
  }
`;
