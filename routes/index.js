require('dotenv').config(); 
const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const middleware = require("../middleware");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const tokenTime = 3600000;

//show index
router.get("/", function(req, res){
  res.render("login", {page: 'login'});
});




//handle login logic
router.post("/", passport.authenticate("local",
    { 
        successRedirect: "/customers",
        failureRedirect: "/",
        successFlash: "Welcome back!",
        failureFlash: "Invalid username or password."
        
    }), function(req, res){
    
});

// forgot password
router.get('/forgotpassword', function(req, res) {
    res.render('forgotpassword');
  });
  
  router.post('/forgotpassword', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ username: req.body.username }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgotpassword');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + tokenTime; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.CSC_PASSWORD_RESET_EMAIL,
            pass: process.env.CSC_RESET_EMAIL_PASS
           // pass: process.env.GMAILPW
          },
          tls: {
            rejectUnauthorized: false
          } 
        });
        var mailOptions = {
          to: user.username,
          from: process.env.CSC_PASSWORD_RESET_EMAIL,
          subject: 'CSC Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/resetpassword/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.username + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgotpassword');
    });
  });
  
  router.get('/resetpassword/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgotpassword');
      }
      res.render('resetpassword', {token: req.params.token});
    });
  });
  
  router.post('/resetpassword/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: process.env.CSC_PASSWORD_RESET_EMAIL,
            pass: process.env.CSC_RESET_EMAIL_PASS
            // pass: process.env.GMAILPW
          },
          tls: {
            rejectUnauthorized: false
          } 
        });
        var mailOptions = {
          to: user.username,
          from: process.env.CSC_PASSWORD_RESET_EMAIL,
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.username + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
      res.redirect('/');
    });
  });


//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You have been logged out!");
    res.redirect("/");
});

module.exports = router;