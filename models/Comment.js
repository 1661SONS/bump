// mongoose
var mongoose = require("mongoose");

// schema class
var Schema = mongoose.Schema;

// comment schema
var CommentSchema = new Schema({
    body: {
        type: String
    }
});

// comment model with the CommentSchema
var Comment = mongoose.model("Comment", CommentSchema);

// export comment model
module.exports = Comment;