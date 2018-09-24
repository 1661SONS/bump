// dependencies
var colors = require("colors");
var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// models n such
var Article = require("./models/Article.js");
var Comment = require("./models/Comment.js");

var methodOverride = require("method-override");

// var db = require("./models");
var db = mongoose.connection;

var PORT = process.env.PORT || 3000;

// express
var app = express();

// middleware
// morgan logger for logging requests
app.use(logger("dev"));
// body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// express.static to serve the public folder as a static directory
app.use(express.static("public"));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(methodOverride("_method"));

var bumpRouter = require("./controllers/bump-routes.js");
var htmlRouter = require("./controllers/html-routes.js");

app.use("/", htmlRouter);
app.use("/", bumpRouter);

// connect to the mongo db, (localhost db = "bumpdb", mlab db = "heroku_x71xqjgg")
mongoose.Promise = Promise;

// mongoose.connect("mongodb://localhost:27017/bumpdb", { useNewUrlParser: true });

if (process.env.MONGODB_URI) {
	//THIS EXECUTES IF THIS IS IN HEROKU
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect("mongodb://localhost/bumpdb", { useNewUrlParser: true });
}

db.on("error", function(error) {
    console.log("mongoose error: ", error)
});
db.once("open", function() {
    console.log("MONGOOSE CONNECTION SUCCESSFUL".green);
    console.log("-------------------------------".magenta);
});

// start server
app.listen(PORT, function() {
    console.log("\n-------------------------------".magenta);
    console.log("APP RUNNING ON PORT ".green + PORT + "!".green);
});
