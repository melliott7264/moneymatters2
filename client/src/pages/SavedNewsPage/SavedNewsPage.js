import React, { useState, useEffect } from 'react';
import Auth from '../../utils/auth';
import { removeArticleid, saveArticleIds } from '../../utils/localstorage';
import { ADD_POST, REMOVE_ARTICLE } from '../../utils/mutations';
import { GET_ME } from '../../utils/queries';
import { useQuery, useMutation } from '@apollo/client';
import { Globe } from 'react-bootstrap-icons';
import { Nav, Button } from 'react-bootstrap';
import moment from 'moment';

// Imports the CSS from SavedNewsPage.css
import './SavedNewsPage.css';

// Import Bootstrap CSS
import {
    Container,
    Row,
} from 'react-bootstrap';

const SavedNewsPage = () => {
    const [articledata, setArticleData] = useState([]);
    const [userData, setUserData] = useState({});
    const [AddPostArticle] = useMutation(ADD_POST);
    const [deleteArticle] = useMutation(REMOVE_ARTICLE);
    const loggedIn = Auth.loggedIn();

    //User GraphQL query to collect currently logged in user data & authentication info 
    const { loading , data:userdata } = useQuery(GET_ME);

    // Starts once the data is loaded
    useEffect(() => {
        const user = userdata?.me || {};
        setUserData(user);
        // not an ideal solution but it prevents cell stack size errors.
        setTimeout(showArticles(),250);
    },[userdata, userData]);

    // keep executing until userData is updated 
    const showArticles = () => {
        try{
        var articles = userData.savedArticles
        var articleCopy = [...articles]
        articleCopy.sort((a,b) => {return a.articleDate - b.articleDate}).reverse();
        setArticleData(articleCopy)
        } catch (err) {
            //console.log(err)
        }
    }

    //Verify if saved Article info for logged in user has finished loading
    if (userData.savedArticles?.length) {
        //This creates a array of saved articleId from articles saved to database for sign-in User
        const savedArticles = userData.savedArticles.map(article => {
            return article.articleId;
        });
        saveArticleIds(savedArticles);
    }
    // Function that accepts the Article Id value as parameter and deletes the article from the database
    const handleDeleteArticle = async (articleId) => {
        try {
            var card = document.getElementById(articleId);
            var counter = document.getElementById("article_counter")
            var count = document.getElementById("card_holder").childElementCount;
            const response = await deleteArticle({variables: { id: articleId },})
            //console.log(response)
            if (response) {
                card.remove();
                count = count - 1  
                if (count > 0) {
                counter.innerHTML = 'Viewing ' + count + ' Saved Articles'
                } else {
                    counter.innerHTML = "No Saved Articles!"
                }
                removeArticleid(articleId);
            }
        } catch (err) {
            console.log(err);
        }
    };  
    const handleAddPostArticle = async (article) => {
    try {
        const articleId = article._id
        var button = document.getElementById(article.url);
        button.innerHTML = '';
        // Avoid posting the same article twice 
        var checkArticle = articledata.filter(a => (a.post === true && a._id === articleId))
        //console.log(articledata)
        if (!checkArticle.length){
        const response = await AddPostArticle({
            variables: { _id: articleId, post: true},
        })
        //console.log(response)
        button.innerHTML = '<Button variant="primary" disabled className="btn text-success">Posted</Button>';
    } else {
        button.innerHTML = '<Button variant="primary" disabled className="btn text-success">Already Posted</Button>';
    }
    } catch (err) {
        console.log(err);
    }
};

    // Failure to upload the data you will receive this message 
    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!loggedIn) {
        return ( 
          <div className="jumbotron">
              <h2 className="text-center">
                  Login to See Posts
              </h2>
          </div>)
        }
    else{
    // Returns the saved articles
    return (
        <>
            <Container>
                <h2 id="article_counter" style={{ color: 'darkgreen' }} className='text-center mt-2 mb-3'>
                    {userData.savedArticles?.length
                        ? `Viewing ${userData.savedArticles.length} Saved ${userData.savedArticles.length === 1 ? 'Article' : 'Articles'
                        }`
                        : 'No Saved Articles!'}
                </h2>
                <Row>
                    <div className="panel-body">
                        <ul id="card_holder" className="list-group">
                            {articledata.map((article => (
                                <li id={article._id} key={article._id} className="list-group-item px-2">
                                    <div className="d-flex align-items-end">
                                        <h4>{article.title}</h4>
                                        <Nav.Link href={article.url}>
                                            <Globe className="mb-3" color="royalblue" size={22} />
                                        </Nav.Link>
                                    </div>
                                    <p> {article.description}</p>
                                    <div>
                                        <div className="row g-0 align-middle">
                                            <div className="col-md-4 mt-2">
                                                <p>Published: {moment(Number(article.articleDate)).format('MMMM Do YYYY, h:mm a')}</p>
                                            </div>
                                            <div className="col-md-4 w-auto ms-auto">
                                                <span className="btn-group float-right" id={article.url}>
                                                    <Button variant='primary' onClick={() => handleAddPostArticle(article)} className="btn text-white">Post Article</Button>
                                                </span>
                                                <span className="btn-group float-right">
                                                    <Button variant='danger' onClick={() => handleDeleteArticle(article._id)} className="btn text-white">Delete Article</Button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                              )))}
                          </ul>
                      </div>
                  </Row>
              </Container>
          </>
      );
  };
}                         
export default SavedNewsPage;
                                
                                    



