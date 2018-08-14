var express=require("express"),
    router= express.Router({mergeParams: true}),
    Car=require("../models/car.js"),
    {validId, isAdmin}= require("./middlewares");

//Basic routes

router.get("/", function(req,res) {
    res.render("landing", {title: "Main"});   
});


router.get("/cars", function(req,res,next) {
    Car.find({}, function(err,cars) {
        if(err) return next(err);
        res.render("cars", {title: "Cars", cars: cars});
    }); 
});


router.post("/cars", function(req,res, next) {
    Car.find({name: req.body.car.name } , function(err, cars) {
        if(err) return next(err);
        if (cars.length) return res.render("new", { title: "new Car", err: "Car already exists!" });
        Car.create(req.body.car, function(err, newcar) {
            if (err) return res.render("new", { title: "new Car", err: "Invalid input!" });
            return res.redirect("/cars");
        });   
    });
});

router.get("/cars/new", function(req,res) {
    res.render("new", {title: "new Car"});
});

router.get("/cars/:id", validId, function(req,res,next) {
    Car.findById(req.params.id).populate("comments").exec(function(err, foundCar) {       
        if (err) return next(err);
        if(!foundCar) return next();
        res.render("car_page", {title: foundCar.name, car: foundCar });     
    });  
});

router.delete("/cars/:id", validId, isAdmin, function(req,res, next) {
    Car.findByIdAndRemove(req.params.id, function(err, foundCar) {
        if (err) return next(err);
        if(!foundCar) return next();
        else res.redirect("/cars"); 
    });
});

router.get("/cars/:id/edit", validId, isAdmin, function(req,res, next) {
    Car.findById(req.params.id, function(err, foundCar) {
        if (err) return next(err);
        if(!foundCar) return next();
        res.render("edit", {title: "update Car", car: foundCar});
    });
});

router.put("/cars/:id", validId, isAdmin, function(req,res,next) {
    Car.findByIdAndUpdate(req.params.id, req.body.car, function(err, updatedCar) {
        if (err) return next(err);
        if(!updatedCar) return next();
        else res.redirect("/cars/" + req.params.id);
    });
});


module.exports= router;
