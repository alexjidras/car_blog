var express=require("express"),
    router= express.Router({mergeParams: true}),
    Comment=require("../models/comment.js"),
    Car=require("../models/car.js");
    
//============ Comment Routes ==========//

router.get("/cars/:id/comments/new", isLoggedIn, function(req,res,next) {
    Car.findById(req.params.id, function(err, foundCar) {
            if (err) return next();
            res.render("new_comment", {title: " New Comment", 
                                         car: foundCar
                                        }); 
        });
});

router.post("/cars/:id/comments", isLoggedIn, function(req,res) {
    Car.findById(req.params.id, function(err, foundCar) {
            if (err) return next();
            var comment = Object.assign(req.body.comment, {author: {id: req.user._id, username: req.user.username}});
            Comment.create(comment, function(err, comment) {
                if(err)  return res.render("new_comment", { title: " New Comment", 
                                         car: foundCar,
                                         err: "Invalid input!"
                                        }); 
                foundCar.comments.push(comment);
                foundCar.save(function(err) {
                    if(err) return res.render("new_comment", { title: " New Comment", 
                                         car: foundCar,
                                         err: "Something went wrong!"
                                        }); 
                    res.redirect("/cars/" + foundCar._id); 
                });
            });
        });
});

function isLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = router;