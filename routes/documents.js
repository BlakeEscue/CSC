require('dotenv').config(); 
const express = require("express");
const router  = express.Router({mergeParams: true});
const mongoose    = require("mongoose");
const User = require("../models/user");
const Customer = require("../models/customer");
const Document = require("../models/document");
const middleware = require("../middleware");


// show all customers in db
router.get("/customers", middleware.isLoggedIn, function(req, res){
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        // search all users from DB
        Customer.find({name: regex}, function(err, searchResults){
           if(err){
               console.log(err);
           } else {
              if(searchResults.length === 0) {
                req.flash("error", "Document not found");
                return ("back");
              }
            
              res.render("documents/index", {customers: searchResults});
           }
        });
    } else {
        // Get all users from DB
      Customer.find({}, function(err, searchResults) {
           if(err){
               console.log(err);
           } else {
              res.render("documents/index",{customers: searchResults});
           }
        });
    }
});


// show customer profile
router.get("/customers/:id", middleware.isLoggedIn, function(req, res){
    // find the document with provided ID
    Customer.findById(req.params.id).exec(function(err, foundCust){
        if(err){
            console.log(err);
        } 
     // Get all users from DB
    Customer.find({}, function(err, searchResults) {
         if(err){
             console.log(err);
         } else {
             
            res.render("documents/show",{newCustomer: searchResults, customer: foundCust});
         }
          
      });
 });
   
});

// Displays Network File of Customer
router.get("/customers/:id/network", middleware.isLoggedIn, function(req, res){
    // find the document with provided ID
    Customer.findById(req.params.id).populate({ path: "documents", match: { docType: "Network" } }).exec(function(err, foundCustomer){
        if(err){
            console.log(err);
        } else {
            const document = foundCustomer.documents;
             res.render("documents/network", {customer: foundCustomer, document: document });
        }
    });
   
});

// render edit network file page
router.get("/customers/:id/network/:document_id/edit", middleware.isLoggedIn, function(req, res){
    Document.findById(req.params.document_id, function(err, foundDocument){
        if(err){
            res.redirect("back");
        } else {
            console.log(foundDocument.customer);
             res.render("documents/edit_network", {customer_id: req.params.id, document: foundDocument, customer: req.params.id});
        }
    });
 });
// sends a put request to edit document 
  router.put("/customers/:id/network/:document_id", middleware.isLoggedIn, function(req, res){
   Document.findByIdAndUpdate(req.params.document_id, req.body.document, function(err, updatedDocument){
        if(err){
           console.log(err);
            res.render("documents/edit_network");
        } else {
            res.redirect("/customers/" + req.params.id + "/network");
        }
    }); 
 });





// Displays email file of customer
router.get("/customers/:id/email", middleware.isLoggedIn, function(req, res){
    // find the document with provided ID
    Customer.findById(req.params.id).populate({ path: "documents", match: { docType: "Email" } }).exec(function(err, foundCustomer){
        if(err){
            console.log(err);
        } else {
            const document = foundCustomer.documents;
             res.render("documents/email", {customer: foundCustomer, document: document});
        }
    });
});

// render edit email file page
router.get("/customers/:id/email/:document_id/edit", middleware.isLoggedIn, function(req, res){
    Document.findById(req.params.document_id, function(err, foundDocument){
        if(err){
            res.redirect("back");
        } else {
             res.render("documents/edit_email", {customer_id: req.params.id, document: foundDocument});
        }
    });
 });
// sends a put request to edit document 
  router.put("/customers/:id/email/:document_id", middleware.isLoggedIn, function(req, res){
   Document.findByIdAndUpdate(req.params.document_id, req.body.document, function(err, updatedDocument){
        if(err){
           console.log(err);
            res.render("documents/edit_email");
        } else {
            res.redirect("/customers/" + req.params.id + "/email");
        }
    }); 
 });







// Displays password file of cust
router.get("/customers/:id/password", middleware.isLoggedIn, function(req, res){
    // find the document with provided ID
   Customer.findById(req.params.id).populate({ path: "documents", match: { docType: "Password" } }).exec (function(err, foundCustomer){
        if(err){
            console.log(err);
        } else {
            const document = foundCustomer.documents;
             res.render("documents/password", {customer: foundCustomer, document: document});
        }
    });
});

// render edit password file page
router.get("/customers/:id/password/:document_id/edit", middleware.isLoggedIn, function(req, res){
    Document.findById(req.params.document_id, function(err, foundDocument){
        if(err){
            res.redirect("back");
        } else {
             res.render("documents/edit_password", {customer_id: req.params.id, document: foundDocument});
        }
    });
 });
// sends a put request to edit document 
  router.put("/customers/:id/password/:document_id", middleware.isLoggedIn, function(req, res){
   Document.findByIdAndUpdate(req.params.document_id, req.body.document, function(err, updatedDocument){
        if(err){
           console.log(err);
            res.render("documents/edit_password");
        } else {
            res.redirect("/customers/" + req.params.id + "/password");
        }
    }); 
 });

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;