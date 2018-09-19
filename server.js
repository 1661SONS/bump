// base dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// scraping tools
// axios is a promised-based http library, similar to jQuery's ajax method
var axios = require("axios");
var cheerio = require("cheerio");

// models
var db = require("./models");

var PORT = 3000;

// express
var app = express();

// middleware
// morgan is for logging requests
app.use(logger("dev"));
// body-parser is for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// express.static will serve the public folder as a static directory
app.use(express.static("public"));

// connect to mongo db
mongoose.connect("mongodb://localhost/bumps", { useNewUrlParser: true });

// routes
// a GET route for scraping the intercept website
// was /scrape
app.get("/", function(req, res) {
    axios.get("https://theintercept.com/").then(function(response) {  
    var $ = cheerio.load(response.data);

    $("div.Promo-title-block").each(function(i, element) {
        var result = {};
        // var title = $(element).children("span").text();
        // var link = $(element).children("a").attr("href");

      result.title = $(this)
        .children("span")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      db.Article.create(result)
        .then(function(dbArticle) {
          console.log(dbArticle);
        })
        .catch(function(err) {
          return res.json(err);
        });
    });

        // this sends success message to client
        res.json(dbArticle);
    });
});

// route for getting all Articles from the db
app.get("/articles", function(req, res) {
  
    db.Article.find({})
        .then(function(dbArticle) {
            res.json(dbArticle);
        })
        .catch(function(err) {
            res.json(err);
        });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  db.Article.findOne({ _id: req.params.id })
    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Note.create(req.body)
    .then(function(dbNote) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});