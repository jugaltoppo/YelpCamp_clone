var express = require("express");
//we do merge params to pass the ':id' 
var router = express.Router({mergeParams: true});
//not needed but done by instructor
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//render the add comment form
router.get("/new",isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("comment/new.ejs",{campground: foundCamp});
        }
    });
});

//comments 'create' route
router.post("/",isLoggedIn, function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            console.log(err);
        }else{
            // create new comment 
            Comment.create(req.body.comment,function(err,newComment){
                if(err){
                    console.log(err);
                }else{
                    // connect new comment to campground
                    foundCampground.comments.push(newComment);
                    foundCampground.save(function(err,campground){
                        if(err){
                            console.log(err);
                        }else{
                            //redirect campground showpage 
                            res.redirect("/campgrounds/" + req.params.id);
                        }
                    });
                }
            });
            
        }
    });
})

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;