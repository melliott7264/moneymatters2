import React, {Component} from 'react';
import Article from '../../components/Article_browsing';

import API from "../../utils/API";
import './browsing.css'

class Browsing extends Component {
    state = {
        articles: [],
    }

    // return all articles after rendering
    componentDidMount() {
        this.getArticles();
      }

    handleInputChange = event => {
        const { name, value } = event.target;
        this.setState({
            [name]: value
        });
    };

    // return all articles related to economics ordeered by date published. 
    getArticles = () => {
    API.getArticles()
      .then(res =>{
        this.setState({ articles: res.data.articles}) 
      })
      .catch(err => console.log(err));
  };

    render() {
        return (
            <div>
                <div className="jumbotron">
                    <h2 className="text-center">
                        Get the Latest Economy News Here
                    </h2>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card border-success mb-3">
                                <div className="card-header text-center text-white bg-success border-success">
                                    <span className="card-title text-center">Latest Headlines</span>
                                </div>
                            <div className="card-body">
                                <div className="panel-body">
                                        <ul className= "list-group">
                                            {this.state.articles.map(article => (
                                                <Article
                                                key={article.url}
                                                article={article}
                                                />
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
}

export default Browsing;