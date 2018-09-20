// dependencies
var express = require("express");
var exphbs = require("express-handlebars");

// router
var router = express.Router();

// routes
router.get("/", (req, res) => {
  res.render("index");
});

router.get("/saved", (req, res) => {
	res.render("saved");
});

// export router
module.exports = router;