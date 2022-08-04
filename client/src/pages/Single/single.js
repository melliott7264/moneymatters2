import React, { useEffect, useState } from 'react';
import { Container, Row, Form, Button } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ARTICLE, GET_ME } from '../../utils/queries';
import { ADD_COMMENT } from '../../utils/mutations';
import { useParams } from 'react-router-dom';

import './single.css';

import Article from '../../components/Article';
import Comment from '../../components/Comment';

// page to display articles with comments - need to pass in article id - we can retrieve the rest
const Single = () => {
  // get id from params passed in URL
  const { id } = useParams();

  // use useState to update logged-in  user data
  const [userData, setUserData] = useState();
  // use useState to update screen with article data
  const [articleData, setArticleData] = useState();
  // get comment state
  const [commentData, setComment] = useState();

  // define callback functions for mutations
  const [addComment, { addError }] = useMutation(ADD_COMMENT);

  // GET_ARTICAL returns: (user)_id, (article)articleDate, postDate, source, title, description, url, username, commentCount
  // (comment)_id, articleId, postDate, username, commentBody
  const { loading, error, data } = useQuery(GET_ARTICLE, {
    variables: { id: id },
  });

  // Need to get logged-in user to get username for saving comment
  const { loading: loadingMe, error: errorMe, data: dataMe } = useQuery(GET_ME);

  // runs once data has loaded from both article and logged-in user
  useEffect(() => {
    if (!error && !errorMe) {
      // grab the data from the returned value
      const article = data?.article || {};
      const user = dataMe?.me || {};

      // set userData displaying logged-in user information
      setUserData(user);
      //sets articleData displaying article information
      setArticleData(article);
    } else {
      if (error) {
        console.error('There has been an error loading article data: ' + error);
      } else {
        console.error(
          'There has been an error loading article data: ' + errorMe
        );
      }
    }
  }, [data, error, dataMe, errorMe]);

  const handleComment = async (event) => {
    try {
      const response = await addComment({
        variables: {
          articleId: articleData._id,
          commentBody: commentData,
          username: userData.username,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  if (loading || loadingMe) {
    return <h2>Loading...</h2>;
  }

  if (error || errorMe) {
    if (error) {
      return <h2>Error! ${error.message}</h2>;
    } else {
      return <h2>Error! ${errorMe.message}</h2>;
    }
  }

  return renderPage();

  function renderPage() {
    return (
      <Container>
        <Row>
          <Article key={articleData.url} article={articleData} />
          <Row>
            <Form onSubmit={handleComment}>
              <Form.Group>
                <Form.Label>Comment on Article:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  name="commentBody"
                  value={commentData}
                  onChange={handleCommentChange}
                />
              </Form.Group>

              <Button className="mt-2" type="submit" variant="primary">
                Add Comment
              </Button>
            </Form>
            <Comment
              key={articleData._id}
              articleId={articleData._id}
              username={userData.username}
            />
          </Row>
        </Row>
      </Container>
    );
  }
};

export default Single;
