import './main.css';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ARTICLES, GET_ME } from '../../utils/queries';
import { ADD_ARTICLE } from '../../utils/mutations';
import { Globe } from 'react-bootstrap-icons';
import { Nav, Button } from 'react-bootstrap';
import moment from 'moment';
import Auth from '../../utils/auth';
import { Link } from 'react-router-dom';

const Main = () => {
  // Store filtered article data
  const [articleData, setArticleData] = useState([]);
  // Store user data to check if the article is already saved
  const [userData, setUserData] = useState({});
  const [addArticle] = useMutation(ADD_ARTICLE);
  //reassign data names
  const { data: articledata } = useQuery(GET_ARTICLES);
  const { data: userdata } = useQuery(GET_ME);
  // check if user is logged in
  const loggedIn = Auth.loggedIn();

  useEffect(() => {
    var article = articledata?.articles || [];
    // Store into an array for filtering and sorting
    var articleCopy = [...article];
    // Only show saved articles with the post boolean set to true
    articleCopy = articleCopy.filter((a) => a.post === true);
    // Sort by date in descending order
    articleCopy
      .sort((a, b) => {
        return a.articleDate - b.articleDate;
      })
      .reverse();
    setArticleData(articleCopy);

    const user = userdata?.me || {};
    setUserData(user);
  }, [articledata, userdata]);

  // Save article
  const handleSaveArticle = (article) => {
    // Avoid saving the same article more than once
    var alreadySaved = userData.savedArticles.filter(function (obj) {
      return obj.url === article.url;
    });

    try {
      // Provide feedback on wether a article is already saved or not.
      var button = document.getElementById(article._id);
      button.innerHTML = '';
      // Check if article is already saved
      if (!alreadySaved.length) {
        let description = '';
        // Allow article saving for null descriptions
        if (article.description !== null) {
          description = article.description;
        }
        const variables = {
          articleDate: article.articleDate,
          source: article.source,
          title: article.title,
          description: description,
          url: article.url,
        };
        addArticle({
          variables,
        });
        // button feedback
        button.innerHTML =
          '<Button variant="danger" disabled className="btn text-success">Saved</Button>';
      } else {
        button.innerHTML =
          '<Button variant="danger" disabled className="btn text-success">Already Saved</Button>';
      }
    } catch (err) {
      console.log(err);
    }
  }; // check if logged in
  if (!loggedIn) {
    return (
      <div className="jumbotron">
        <h2 className="text-center">Login to See Posts</h2>
      </div>
    );
  } else {
    // check for post content
    if (!articleData.length) {
      return (
        <div className="jumbotron">
          <h2 className="text-center">
            Go to Your Saved News Page to Create a Post
          </h2>
        </div>
      );
    }

    return (
      <div>
        <div className="jumbotron">
          <h2 className="text-center">Discuss the Latest Economy News Here</h2>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="card border-success mb-3">
                <div className="card-header text-center text-white bg-success border-success">
                  <span className="card-title">Posted Articles</span>
                </div>
                <div className="card-body">
                  <div className="panel-body">
                    <ul className="list-group">
                      {articleData.map((article) => (
                        <li key={article._id} className="list-group-item px-2">
                          <div className="row">
                            <div className="col-md-7">
                              <p>
                                Posted: {article.postDate} by {article.username}{' '}
                              </p>
                            </div>
                            <div className="col-md-5">
                              <p>Source: {article.source}</p>
                            </div>
                          </div>
                          <div className="d-flex align-items-end">
                            <h4>{article.title}</h4>
                            <Nav.Link href={article.url}>
                              <Globe
                                className="mb-3"
                                color="royalblue"
                                size={22}
                              />
                            </Nav.Link>
                          </div>
                          <p> {article.description}</p>
                          <div>
                            <div className="row g-0 align-middle">
                              <div className="col-md-3 mt-2">
                                <Nav.Link
                                  as={Link}
                                  to={{
                                    pathname: `/single/${article._id}`,
                                  }}
                                >
                                  <p className="text-primary">
                                    Comments: {article.commentCount}
                                  </p>
                                </Nav.Link>
                              </div>
                              <div className="col-md-5 mt-2">
                                <p>
                                  Published:{' '}
                                  {moment(Number(article.articleDate)).format(
                                    'MMMM Do YYYY, h:mm a'
                                  )}
                                </p>
                              </div>
                              <div className="col-md-3 w-auto ms-auto">
                                <span
                                  className="btn-group float-right"
                                  id={article._id}
                                >
                                  <Button
                                    variant='danger'
                                    onClick={() => handleSaveArticle(article)}
                                    className="btn text-white"
                                  >
                                    Save Article
                                  </Button>
                                </span>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
export default Main;
