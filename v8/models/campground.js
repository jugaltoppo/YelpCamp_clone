var mongoose= require("mongoose");

//define database schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
});

//model the database
module.exports = mongoose.model("Campground",campgroundSchema);