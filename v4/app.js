var express     = require("express"),
app         = express(),
bodyParser  = require("body-parser")
mongoose    = require("mongoose"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
seedDB      = require("./seeds");
//to remove warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//running the seed.js
// seedDB();

//connect mongoose
mongoose.connect("mongodb://localhost/yelp_camp");
//set ejs engine
app.set("view engine","ejs");
//make use of body parser
app.use(bodyParser.urlencoded({extended : true}));



// Campground.create({
//     name:"Granite Hill", 
//     image:"https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//     description: "This is the Granite Hill. No bathroom, no toilet.... only beautiful Granite Hill."
// },function(err,campground){
//     if(err){
//         console.log(err);
//     }else{
//         console.log("Success");
//         console.log(campground);
//     }
// });

//homepage
app.get("/",function(req,res){
    res.render("landing");
});

//index page(show all campgrounds)
app.get("/campgrounds",function(req,res){
    Campground.find({},function(err,allCampground){
        if(err){
            console.log(err);
        }else{
            res.render("campground/index",{campgrounds : allCampground});
        }
    });
    
});

//add campground to database and redirect to index page
app.post("/campgrounds",function(req,res){
    var name=req.body.name;
    var url=req.body.image;
    var desc = req.body.description;
    var data={name: name, image: url, description: desc};
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
app.get("/campgrounds/new",function(req,res){
    res.render("campground/new");
});

//show description of the campground on clicking the button on index page
app.get("/campgrounds/:id",function(req,res){
   Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
       if(err){
           console.log(err);
       }else{
           res.render("campground/show",{campground: campground});
       }
   }); 
});

//render the add comment form
app.get("/campgrounds/:id/comment/new",function(req,res){
    Campground.findById(req.params.id,function(err,foundCamp){
        if(err){
            console.log(err);
        }else{
            res.render("comment/new.ejs",{campground: foundCamp});
        }
    });
});

//comments 'create' route
app.post("/campgrounds/:id/comment",function(req,res){
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


//listen to port 3000
app.listen(3000,function(){
    console.log("listening to port 3000");
});