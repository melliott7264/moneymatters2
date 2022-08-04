import React, {useState,useEffect} from 'react';
import moment from 'moment';
import { Globe } from 'react-bootstrap-icons';
import { Nav, Button } from 'react-bootstrap';
import './article_browsing.css';
import { useQuery,useMutation } from '@apollo/client';
import { ADD_ARTICLE} from '../../utils/mutations';
import { GET_ME } from '../../utils/queries';

const Article = ({ article}) => {

  const [addArticle] = useMutation(ADD_ARTICLE)

  const [userData, setUserData] = useState({});
  const {data } = useQuery(GET_ME);

  // save user data after rendering 
  useEffect(() => {
      const user = data?.me || {};
      setUserData(user);
  }, [data]);


  const handleSaveArticle = (article) => {
    // avoid saving the same article more than once
    var alreadySaved = userData.savedArticles.filter(function(obj) {
      return obj.url === article.url;
    })
    try {
      // provide feedback on wether a article is already saved or not. 
      var button = document.getElementById(article.url);
      button.innerHTML = '';
      // avoid saving a duplicate article
      if (!alreadySaved.length)
      {
        let description = ""
        // allow saving of articles with null descriptions
        if (article.description !== null) {description = article.description}
        const variables = { articleDate: article.publishedAt, source: article.source.name,
           title: article.title, description: description, url: article.url }
        addArticle({
            variables,
        });
        // button feedback
        button.innerHTML = '<Button variant="danger" disabled className="btn text-success">Saved</Button>';
      } else {
        button.innerHTML = '<Button variant="danger" disabled className="btn text-success">Already Saved</Button>';
      }
    } catch (err) {
        console.log(err);
    }
};
  // return article card for the browsing page
  return (
  <li className="list-group-item px-2">
    <div className="d-flex align-items-end">
      {/* <h4>{source.name} : {title}</h4> */}
      <h4>{article.title}</h4>
      <Nav.Link href={article.url}>
        <Globe className="mb-3" color="royalblue" size={22} />
      </Nav.Link>
    </div>
    <p> {article.description}</p>
    <div>
      <div className="row g-0 align-middle">
        <div className="col-md-4 mt-2">
          <p>Date: {moment(article.publishedAt).format('MMMM Do YYYY, h:mm a')}</p>
        </div>
        <div className="col-md-4 w-auto ms-auto">
          <span className="btn-group float-right" id={article.url}>
            <Button variant="danger" onClick={() => handleSaveArticle(article)} className="btn text-white">Save Article</Button>
          </span>
        </div>
      </div>
    </div>
  </li>
);
}

export default Article;
