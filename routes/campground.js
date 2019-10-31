 var express=require("express");
var router=express.Router();  
var Campground=require("../models/campground");
var flash=require("connect-flash");
router.get("/",function(req,res){
    //we need to get all campground form dbs
    console.log("nner");
    Campground.find({},function(err,allcampa){
        console.log("nner");
    
        if(err){
            console.log("error in page");
            console.log("i am here");
        }
        else{
            console.log("campgrounds are");
            console.log("i am here2");
            res.render("campground/index.ejs",{camp:allcampa,currentuser:req.user});
        }
    });
        
        //res.render("campground.ejs",{camp:camp});
    });
        
    
    
    router.get("/new",isauth,function(req,res){
    
    //	res.send("hi sajal");
                res.render("campground/new.ejs");
        });
    
    
    
        
        router.post("/",isauth,function(req,res){
        var name=req.body.name;
        var image=req.body.image;
        var desc=req.body.description;
        var auth={
           id: req.user._id,
           username:req.user.username
        };
        var newcampgr={name:name,image:image,description:desc,author:auth};
        Campground.create(newcampgr,function(err,campa){
            if(err){
                console.log("error "+err);
            }
            else{
                console.log("new campaa is created ");
                console.log(campa);
        
        res.redirect("/campground");		
            }
        });
        
        
        
        //by default is get request campgroud
    });
    
    
    router.get("/:id",function(req,res){
            //find the campgroud with required id and 
                //render the show template with that campground
                //res.send("this weill be show page one day");
            console.log("inside");
                var thing=req.params.id;
            Campground.findById(thing).populate("comment").exec(function(err,found){
                if(err){
                    console.log("there is an error"+err);
                }
                else{
                console.log("we hav found the camp "+found);
                    res.render("campground/show.ejs",{camp:found});
                }
            });  
            });


            //edit campground

router.get("/:id/edit",checkauthor,function(req,res){
                //is user logged in
                                   var id=req.params.id;
    Campground.findById(id,function(err,camp){
        res.render("campground/edit.ejs",{camp:camp});
   
    });
            }); 
        


router.put("/:id",checkauthor,function(req,res){
    var id=req.params.id;
    console.log("Yipee i am in put route");
  var data={
      name:req.body.name , image:req.body.image , description:req.body.description 
  }  
Campground.findByIdAndUpdate(req.params.id,data,function(err,user){
    if(err){
        console.log("cannot be updated");
        res.render("/campground");
    
    }
    else{
        req.flash("success","Updated the Campground");
        console.log("log long long ");
        res.redirect("/campground/"+req.params.id);
    }
})
});

router.delete("/campground/:id",checkauthor,function(req,res){
//res.send("this will be delete");
Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
        res.redirect("/campground");
    }
    else{
        req.flash("success","Deleted the Campground");
            res.redirect("/campground");
                
    }
})
});


    function isauth(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error","You Need To Loggedin To do That");
        res.redirect("/login");
        }

function checkauthor(req,res,next){
    if(req.isAuthenticated()){


        var id=req.params.id;
        Campground.findById(id,function(err,camp){
        if(err){
         
    req.flash("error","Campground not found");

            console.log("there is error");
        res.redirect("back");
        }
        else{
    if(camp.author.id.equals((req.user._id))){
          next();
    }
    else{
    req.flash("error","You Do not Permission to that");
        res.redirect("back");
        // res.send("you are not allowed to do that");
    }
         }
        });
        }
    else{
        req.flash("error","You Do not Logged in to that");
    
        console.log("you need to be logged in to tht");
     //   res.send("you need to be logged in to");
     res.redirect("back");
    }
}


        module.exports=router;

