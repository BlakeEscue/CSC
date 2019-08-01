var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");




var userSchema = new mongoose.Schema({
    username: {
        type: String, 
        lowercase: true, 
        unique: true,      
    },
    firstname: {
        type: String
    },
    lastname: {
        type: String
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
    },
    password: { 
        type: String
    },
     resetPasswordToken: {
        type: String 
     },
     resetPasswordExpires: {
        
        type: Date
     },
     
    
        
    



}, { timestamps: true });

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
