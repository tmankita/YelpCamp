var express     = require("express");
var router      = express.Router();
var Campground  = require("../models/campground");
var middleware  = require("../middleware");

//INDEX -  show all campgrounds
router.get("/", function(req,res) {
    //GET ALL CAMPGROUNDS FROM DB
    Campground.find({},function(err,allCampgrounds){
        if(err)
            console.log(err);
        else{
            res.render("./campgrounds/index",{campgrounds: allCampgrounds});
        }
    });
});

//Create Campground
router.post("/",middleware.isLoggedIn ,function(req,res){
    //get data and add to campgrounds array
  var name= req.body.name;
  var price= req.body.price;
  var image=req.body.image;
  var description=req.body.description;
  var author= {
      id: req.user._id,
      username: req.user.username
  }
  var newCamp={name:name, price: price ,image:image, description: description, author:author};
  //Create new campground and save in DB
  
  Campground.create(newCamp,function(err,newlyCamp){
      if(err)
            console.log(err);
      else{
        //redirect back to campground page
        res.redirect("/campgrounds")
      }
  })
});

//NEW route
router.get("/new",middleware.isLoggedIn,function(req, res) {
    res.render("./campgrounds/new");
});

//SHOW - shows more about campground
router.get("/:id",function(req,res){
    //find the campground with provided id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
       if(err)
            console.log(err);
        else{
            // render show tamplet
            res.render("./campgrounds/show", {campground: foundCampground});
        }
    });
});

//Edit Campground Route
router.get("/:id/edit",middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(err, foundCampground){
                    res.render("campgrounds/edit", {campground: foundCampground});  
        });
});
//Update Campground Route
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});





module.exports = router;
