var express=require("express"),
    User=require("../models/user.js"),
    passport= require("passport"),
    router= express.Router({mergeParams: true}),
    {isValidId} =  require("./middlewares");


router.get("/login", function(req,res) {
    res.render("login", {title: "Login"});
});

router.post("/login", (req, res, next) => {
    passport.authenticate('local', function(err, user) {
    if (err) return next(err);
    if(!user) return res.render("login", {title: "Login", err: "Invalid username/password"});
    req.login(user, () => res.redirect("/"));
  })(req, res);
});

router.get("/register", function(req,res) {
    res.render("register", {title: "Register"});
});

router.post("/register", function(req,res,next) {
    User.register(new User({username: req.body.username}), req.body.password, function(err) {
        if (err) return res.render("register", {title: "Register", err: "Username already exists"});        
        passport.authenticate("local")(req, res, () => res.redirect("/")); 
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