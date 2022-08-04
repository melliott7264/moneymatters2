// Display all comments for an article
import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COMMENTS } from '../../utils/queries';
import { REMOVE_COMMENT, EDIT_COMMENT } from '../../utils/mutations';

import './comment.css';

// passing in: articleId and logged-in username and querying all comments
const Comment = ({ articleId, username }) => {
  // set comment data state
  const [commentData, setComment] = useState();
  // set state for modal - false - closed
  const [setModalData, setModal] = useState(false);
  // set state for comment edit
  const [editCommentData, setEditComment] = useState();
  // set state to monitor/pass the comment _id for editing
  const [editId, setEditId] = useState(' ');

  // functions to open and close edit modal
  const openModal = () => setModal(true);
  const closeModal = () => setModal(false);

  // function to open editing modal and pass the comment _id amd current commentBody
  const editIdData = (id, commentBody) => {
    setEditId(id);
    setEditComment(commentBody);
    openModal();
  };

  // define callback functions for mutations
  const [deleteComment, { delError }] = useMutation(REMOVE_COMMENT);
  const [editComment, { editError }] = useMutation(EDIT_COMMENT);
  // GET_COMMENTS returns: (comment)_id, articleId, postDate, username, commentBody
  const { loading, error, data } = useQuery(GET_COMMENTS, {
    variables: { articleId: articleId },
  });

  // runs once data has loaded
  useEffect(() => {
    if (!error) {
      const comment = data?.comments || [];
      //sets commentData displaying comments
      setComment(comment);
    } else {
      console.error('There was an error loading comment data: ' + error);
    }
  }, [data, error]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Error! ${error.message}</h2>;
  }

  // This function takes the passed comment id and articleId and deletes the comment
  const handleDeleteComment = async (commentId, articleId) => {
    try {
      const response = await deleteComment({
        variables: { id: commentId, articleId: articleId },
      });

      // force a page reload
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // function to submit comment edit via EDIT_COMMENT mutation
  const handleEditComment = async (event) => {
    // without the event.preventDefault() this function would be erroneously triggered each time the page refreshed
    event.preventDefault();

    try {
      // *** getting varibles to pass from state data: editId and editCommentData ***
      const response = await editComment({
        variables: {
          id: editId,
          commentBody: editCommentData,
        },
      });
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  // functon to update setEditComment state while editing comment text - each change will be displayed
  const handleCommentChange = (event) => {
    setEditComment(event.target.value);
  };

  return renderPage();

  function renderPage() {
    return commentData.map((comment) => (
      <div key={comment._id}>
        <div>
          <hr
            style={{
              height: '5px',
              opacity: '1',
              color: 'darkseagreen',
              background: 'darkseagreen',
            }}
          />
        </div>
        <div className="metaGrp">
          <span className="postDate">{comment.postDate}</span>
          <span className="username">{comment.username}</span>
        </div>
        <div className="commentBody">
          <p>{comment.commentBody}</p>
        </div>
        <div>
          {comment.username === username && (
            <Button
              className="btn editBtn"
              variant="primary"
              onClick={() => editIdData(comment._id, comment.commentBody)}
            >
              Edit Comment
            </Button>
          )}
          {comment.username === username && (
            <Button
              className="btn deleteBtn"
              variant="danger"
              onClick={() =>
                handleDeleteComment(comment._id, comment.articleId)
              }
            >
              Delete Comment
            </Button>
          )}
        </div>
        <Modal show={setModalData} onHide={closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Comment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditComment}>
              <Form.Group>
                <Form.Label>Comment Text:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  name="commentBody"
                  value={editCommentData}
                  onChange={handleCommentChange}
                />
              </Form.Group>
              <Button className="mt-2" type="submit" variant="primary">
                Submit Changes
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    ));
  }
};

export default Comment;
