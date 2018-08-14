var express=require("express"),
    app=express(),
    bodyParser= require("body-parser"),
    mongoose=require("mongoose"),
    methodOverride=require("method-override"),
    Car=require("./models/car.js"),
    Comment=require("./models/comment.js"),
    User=require("./models/user.js"),
    passport= require("passport"),
    LocalStrategy =require("passport-local"),
    passportLocalMongoose =require("passport-local-mongoose"),
    basicRoutes= require("./routes/basic.js"),
    authRoutes= require("./routes/auth.js"),
    commentRoutes=require("./routes/comments.js"),
    sanitizer = require('express-sanitizer');


mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/mydb");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended :true}));
app.use(sanitizer());
app.use(methodOverride("_method"));


app.use(require("express-session")({
    secret: process.env.SECRET || "ilikecars",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res, next) {
    res.locals.loggedUser = req.user;
    res.locals.err = null;
    next();
});

app.use(basicRoutes);
app.use(authRoutes);
app.use(commentRoutes);


app.use((req,res)=> res.render("error", {title: "Error", message: "Page not found!"}));

app.use((err, req,res,next) => {
    console.error(err);
    res.render("error", {title: "Error", message: "Something went wrong!"});
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port " + this.address().port);
});