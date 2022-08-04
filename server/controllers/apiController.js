const apiKey = process.env.APIKEY
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI(apiKey);

module.exports = {
  //Return most recent newsapi.org business related articles
  getAll: (req, res) => {
    newsapi.v2
      .topHeadlines({country: 'us', category: "business", sortBy: "publishedAt", pageSize: "100" })
      .then(response => {
        res.json(response)
      });
  }
}
