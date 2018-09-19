// mongoose
var mongoose = require("mongoose");

// schema
var Schema = mongoose.Schema;

// article schema
var ArticleSchema = new Schema({
  
    // title is a required string
    title: {
        type: String,
        required: true
    },
    // link is a required string
    link: {
        type: String,
        required: true
    },
    // probably want to add date?
    saved: {
        type: Boolean,
        default: false
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

// article model with ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// export model
module.exports = Article;