// dependencies
var express = require("express");
var request = require("request");
var cheerio = require("cheerio");
var Comment = require("../models/Comment.js");
var Article = require("../models/Article.js");
var router = express.Router();

// homepage route /////////////////////////////////////////////////////////////////////////

// scrape data from The Outline site and save to mongodb
// would be nice if this also removed current scraped/outdated articles
router.get("/scrape", function(req, res) {

  // requesting the body of the html
  request("https://theoutline.com/", function(error, response, html) {
    // loading the result into cheerio and saving it as $ shorthand
    var $ = cheerio.load(html);
    // selecting all html with post cards
    $("div.card-stack__elements > .card-stack__element").each(function(i, element) {

      // saving the result to an empty object
      var result = {};
    
      // selecting the title and description of every article, and saving in result object
      result.title = $(element).find("h3>.text").text();
      
      result.link = $(element).find("a").attr("href");

      result.image = $(element).find(".card__bg__image>img").attr("src");

      // creating new db entry
      var entry = new Article(result);

      // saving new entry to db
      entry.save(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log(doc);
        }
      });

    });

    // reload to display newly scraped articles
    res.redirect("/");
  }); 
});

// getting scraped articles from mongodb
router.get("/articles", function(req, res) {
  Article.find({})
  .exec(function(err, doc) {
    if (err) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// when user clicks to save an article
router.post("/save/:id", function(req, res) {
  // using the article id to find and update saved to true
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("doc: ", doc);
    }
  });
});

// saved articles route //////////////////////////////////////////////////////////////////

// get article by its ObjectId
router.get("/articles/:id", function(req, res) {
  // get the article in the db with matching id
  Article.findOne({ "_id": req.params.id })
  // populate all associated comments
  .populate("comments")
  .exec(function(error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});

// create new comment
router.post("/comment/:id", function(req, res) {
  var newComment = new Comment(req.body);
  // save new comment in the db
  newComment.save(function(error, newComment) {
    if (error) {
      console.log(error);
    }
    else {
      // update the comment of the matching article id
      Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "comments": newComment._id }}, { new: true })
      .exec(function(err, doc) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("doc: ", doc);
          res.send(doc);
        }
      });
    }
  });
});

// remove a saved article
router.post("/unsave/:id", function(req, res) {
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false })
  .exec(function(err, doc) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("\n-----------------------");  
      console.log("SAVED ARTICLE REMOVED".magenta);
      console.log("-----------------------");
    }
  });
  res.redirect("/saved");
});

module.exports = router;