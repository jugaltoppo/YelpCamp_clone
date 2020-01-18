var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

//only allow to edit or delete if the campground post belongs to owner
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err,foundCampground){
            if(err){
                console.log(err);
            }else{
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                    resizeBy.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
}

//allows to edit or change comment if it belongs to logged in user
middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                console.log(err);
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next()
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back")
    }
}

//to check if there is user logged in
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}



module.exports = middlewareObj