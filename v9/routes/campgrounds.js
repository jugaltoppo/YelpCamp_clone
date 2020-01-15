var express = require("express");
var router = express.Router();
//not needed but done by instructor
var Campground = require("../models/campground");

//index page(show all campgrounds)
router.get("/",function(req,res){
    Campground.find({},function(err,allCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campground/index",{campgrounds : allCampground});
        }
    });
    
});

//add campground to database and redirect to index page
router.post("/", isLoggedIn,function(req,res){
    var name=req.body.name;
    var url=req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var data={name: name, image: url, description: desc, author: author};
    //add to database
    Campground.create(data,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect to index page
            res.redirect("/campgrounds");
        }
    });
    
})

//take the user to add new campground
router.get("/new", isLoggedIn, function(req,res){
    res.render("campground/new");
});

//show description of the campground on clicking the button on index page
router.get("/:id",function(req,res){
   Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
       if(err){
           console.log(err);
       }else{
           res.render("campground/show",{campground: campground});
       }
   }); 
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

module.exports = router;