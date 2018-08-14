var express=require("express"),
    router= express.Router({mergeParams: true}),
    Comment=require("../models/comment.js"),
    Car=require("../models/car.js"),
    {validId, isLoggedIn} = require("./middlewares");

//Comment routes

router.get("/cars/:id/comments/new", validId, isLoggedIn, function(req,res,next) {
    Car.findById(req.params.id, function(err, foundCar) {
            if (err) return next(err);
            if(!foundCar) return next();
            res.render("new_comment", {title: " New Comment", car: foundCar}); 
    });
});

router.post("/cars/:id/comments", validId, isLoggedIn, function(req,res) {
    Car.findById(req.params.id, function(err, foundCar) {
        if (err) return next(err);
        if(!foundCar) return next();
        var comment = Object.assign(req.body.comment, {author: {id: req.user._id, username: req.user.username}});
        Comment.create(comment, function(err, comment) {
            if(err) return res.render("new_comment", { title: " New Comment", car: foundCar, err: "Invalid input!"}); 
            foundCar.comments.push(comment);
            foundCar.save(function(err) {
                if(err) return next(err);
                res.redirect("/cars/" + foundCar._id); 
            });
        });
    });
});


module.exports = router;
