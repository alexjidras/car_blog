var express=require("express"),
    router= express.Router({mergeParams: true}),
    Car=require("../models/car.js");

//======== Initial Routes ========//

router.get("/", function(req,res) {
    res.render("landing", {title: "Main"});
    
});


router.get("/cars", function(req,res) {
    Car.find({}, function(err,cars) {
        if(err) throw err;
        else {
            console.log("======== Printing cars ==========");
            res.render("cars", {title: "Cars", cars: cars});
            
        };
    });
    
});


router.post("/cars", function(req,res) {
    Car.find({name: req.body.car.name } , function(err,cars) {
        if(err) throw err;
        else  
            if (cars.length>0) {console.log("Length:",cars.length); res.render("new", {title: "new Car", err: "Car already exists!"});}
            else
                Car.create(req.body.car,
                function(err, newcar) {
                    if (err) throw err;
                    else {
                        res.redirect("/cars");
                        console.log("=============== Successs! ==============");
                        console.log(newcar);
                         };
    });
    
});
});

router.get("/cars/new", function(req,res) {
    res.render("new",{title: "new Car"});
});

router.get("/cars/:id", function(req,res) {
            Car.findById(req.params.id).populate("comments").exec(function(err, foundCar) {       
                    if (err) throw err;
                    res.render("car_page", {title: foundCar.name, 
                                                 car: foundCar
                                                }); 
               
        });
    
    
});

router.delete("/cars/:id", isAdmin, function(req,res) {
    Car.findByIdAndRemove(req.params.id, function(err) {
        if (err) throw err;
        else res.redirect("/cars");
        
    });
});

router.get("/cars/:id/edit", isAdmin, function(req,res) {
    Car.findById(req.params.id, function(err, foundCar) {
    if (err) throw err;
    else res.render("edit", {title: "update Car", car: foundCar});
});
});

router.put("/cars/:id", isAdmin, function(req,res) {
    Car.findByIdAndUpdate(req.params.id, req.body.car, function(err, updatedCar) {
        if (err) throw err;
        else res.redirect("/cars/" + req.params.id);
    });
});

function isAdmin(req,res,next) {
    if (req.user && req.user.username === "alexjidras") {
        return next();
    }
    res.redirect("/login");
};

module.exports= router;
