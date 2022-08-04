import { gql } from '@apollo/client';

// Query all articles for user (for the saved news page)
export const GET_ARTICLES = gql`
  query articles {
    articles {
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
      comments {
        _id
        articleId
        commentBody
        postDate
        username
      }
    }
  }
`;

// Query specific article for viewing or commenting
export const GET_ARTICLE = gql`
  query article($id: ID!) {
    article(_id: $id) {
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
      comments {
        _id
        articleId
        postDate
        username
        commentBody
      }
    }
  }
`;

// Query ALL comments for ALL users
export const GET_ALL_COMMENTS = gql`
  query allComments {
    allComments {
      _id
      articleId
      commentBody
      postDate
      username
    }
  }
`;

// Query all comments for user
export const GET_COMMENTS = gql`
  query comments($articleId: ID!) {
    comments(articleId: $articleId) {
      _id
      articleId
      commentBody
      postDate
      username
    }
  }
`;

// Query specific comment
export const GET_COMMENT = gql`
  query comment($id: ID!) {
    comment(_id: $id) {
      _id
      articleId
      commentBody
      postDate
      username
    }
  }
`;

// Query for logged-in user
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      articleCount
      savedArticles {
        _id
        articleDate
        post
        postDate
        source
        title
        description
        url
        username
        commentCount
        comments {
          _id
          articleId
          commentBody
          postDate
          username
        }
      }
    }
  }
`;

// Query ALL users for testing only
export const GET_ALL_USERS = gql`
  query users {
    users {
      _id
      username
      email
    }
  }
`;
