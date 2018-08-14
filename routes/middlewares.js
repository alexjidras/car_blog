let mongoose = require("mongoose");

const validId = (req,res,next) => {
    if(mongoose.Types.ObjectId.isValid(req.params.id)) return next();
    next("route");
}

function isAdmin(req,res,next) {
    if (req.isAuthenticated() && req.user.isAdmin) {
        return next();
    }
    res.redirect("/login");
};

function isLoggedIn(req,res,next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

module.exports = { validId, isAdmin, isLoggedIn };
