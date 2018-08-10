var express=require("express"),
    User=require("../models/user.js"),
    passport= require("passport"),
    router= express.Router({mergeParams: true});


//============== Login routes ==============//

router.get("/login", function(req,res) {
    res.render("login", {title: "Login"});
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/cars",
    failureRedirect: "/login"
}));

router.get("/register", function(req,res) {
    res.render("register", {title: "Register"});
});

router.post("/register", function(req,res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if (err) return res.redirect("/register");
        passport.authenticate("local")(req,res, function() {
            res.redirect("/");
        });
    });
});

router.get("/logout", function(req,res) {
    req.session.destroy(function() {
        //res.clearCookie('connect.sid');
        res.redirect("/cars");
    });
    //req.logOut();
    
});

module.exports= router;