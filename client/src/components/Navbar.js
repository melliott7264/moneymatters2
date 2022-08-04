import React, { useState } from 'react';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SignUp from './Signup';
import Login from './Login';

import Auth from '../utils/auth';

const AppNavbar = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid className="justify-content-center">
          <Navbar.Brand style={{ color: 'lightgreen' }} href="/">
            <img
              alt=""
              src="/logo.svg"
              width="30"
              height="30"
              fill="green"
              className="d-inline-block align-top"
            />{' '}
            Money Matters
          </Navbar.Brand>
          <Nav className="ml-auto justify-content-end">
            {Auth.loggedIn() ? (
              <>
                <Nav.Link style={{ color: 'white' }} as={Link} to="/saved">
                  Your Saved News
                </Nav.Link>
                <Nav.Link style={{ color: 'white' }} as={Link} to="/browse">
                  Browse Latest News
                </Nav.Link>
                <Nav.Link style={{ color: 'white' }} onClick={Auth.logout}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <Nav.Link
                style={{ color: 'white' }}
                onClick={() => setShowModal(true)}
              >
                Login/Sign Up
              </Nav.Link>
            )}
          </Nav>
        </Container>
      </Navbar>
      <Modal
        size="md"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
      >
        <Tab.Container defaultActiveKey="login">
          <Modal.Header className="border-bottom-0" closeButton>
            <Modal.Title id="signup-modal">
              <Nav fill variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <Login handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignUp handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
