require('dotenv').config(); 
const express = require("express");
const passport = require("passport");
const router = express.Router();
const mongoose    = require("mongoose");
const User = require("../models/user");
const Customer = require("../models/customer");
const Document = require("../models/document");
const middleware = require("../middleware");



// shows register form
router.get("/admin/user/register", middleware.isLoggedIn, function(req, res) {
    res.render("admin/register_user", {page: 'register_user'});
 });
 //handle user sign up logic
 router.post("/admin/user/register", middleware.isLoggedIn, function(req, res){
     var newUser = new User({firstname: req.body.firstname, lastname: req.body.lastname, username: req.body.username});
     
     User.register(newUser, req.body.password, function(err, user){
        if(err){
             console.log(err);
             return res.render("admin/register_user", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "User is now logged in and registered, please inform them to reset password:  " + user.firstname);
            res.redirect("back");
        });
     });
 });

 //show create user form
router.get("/admin/customer/create", middleware.isLoggedIn, function(req, res) {
    res.render("admin/create_customer", {page: 'create_customer'});
 });

 //add customer to db
 router.post("/admin/customer/create",middleware.isLoggedIn, function(req, res){
    var newCustomer = new Customer({name: req.body.name, address:{state: req.body.state, city: req.body.city, street: req.body.street, zip: req.body.zip}});
    
    // Create a new customer and save to db
     Customer.create(newCustomer, function(err, newCustomer){
         if(err){
             console.log(err);
         } else {
             newCustomer.save();
            }
            var custID = newCustomer.id;
             Customer.findById( custID, function(err, customer){
            if(err){
              console.log(err);
              return;
            } 
            // three documents added when customer is created
        const networkDoc = {docType: 'Network', text: '', customer: customer.name}
        const emailDoc = {docType: 'Email', text: '', customer: customer.name}
        const passwordDoc = {docType: 'Password', text: '', customer: customer.name}
        
           
        
            Document.create([networkDoc, emailDoc, passwordDoc], function(err, document){
                if(err){
                    
                    console.log(err);
                } else {
                    
                    //save
                   customer.save();
                   customer.documents.push(document[0]);
                   customer.documents.push(document[1]);
                   customer.documents.push(document[2]);
                   
                   
                    req.flash('success', 'Customer created');
                    res.redirect("back");

         }
        });  
     });
    });
});

// DELETE - removes customer and its documents from the database
router.delete("/customer/:id", middleware.isLoggedIn,  function(req, res) {
    Customer.findById(req.params.id, function(err, customer){
        if(err){
            res.redirect("back");
        } else {
            Document.deleteMany({
      _id: {
        $in: customer.documents
      }
    }, function(err) {
      if(err) {
          req.flash('error', err.message);
          res.redirect('/');
      } else {
          customer.deleteOne(function(err) {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
            req.flash('error', 'Customer and documents deleted');
            res.redirect('/customers');
          });
      }
    })
        }
    });
    
});



    



    




module.exports = router;