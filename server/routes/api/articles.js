const router = require("express").Router();
const apiController = require("../../controllers/apiController");

router.route("/")
  .get(apiController.getAll)

module.exports = router;