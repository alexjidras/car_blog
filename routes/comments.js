var express=require("express"),
    router= express.Router({mergeParams: true}),
    Comment=require("../models/comment.js"),
    Car=require("../models/car.js");
    
//============ Comment Routes ==========//

router.get("/cars/:id/comments/new", isLoggedIn, function(req,res) {
    Car.findById(req.params.id, function(err, foundCar) {
            if (err) throw err;
            else res.render("new_comment", {title: " New Comment", 
                                         car: foundCar
                                        }); 
        });
});

router.post("/cars/:id/comments", isLoggedIn, function(req,res) {
    Car.findById(req.params.id, function(err, foundCar) {
            if (err) throw err;
            else {
                Comment.create(req.body.comment, function(err, comment) {
                  if (err) throw err;
                    else {
                        comment.author.id = req.user._id;
                        comment.author.username = req.user.username;
                        comment.save();
                        foundCar.comments.push(comment);
                        foundCar.save();
                        res.redirect("/cars/"+foundCar._id);
                         }
                });
                
                 }
        });
});

function isLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports=router;