import axios from "axios";

const PORT = process.env.PORT || 3001;
var serverPath = "/api/articles"
if (process.env.NODE_ENV === "development")
   { serverPath = `http://localhost:${PORT}` + "/api/articles"};

export default {
  getArticles: (query) => {
    return axios.get(serverPath);
  }
};