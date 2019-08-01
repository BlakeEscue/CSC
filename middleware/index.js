var User = require("../models/user");

var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Log in.")
    res.redirect("/");
}

middlewareObj.isAdmin = function(req, res, next){
    if(req.user.isAdmin){
        return next();
    }
    req.flash("error", "You need to be an Admin to view this page.")
    res.redirect("/");
}



module.exports = middlewareObj;
