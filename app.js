require('dotenv').config();  
const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      flash       = require("connect-flash"),
      passport    = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      User        = require("./models/user"),
      Customer = require("./models/customer");
      
   
   //requiring routes
const indexRoutes       = require("./routes/index");
const authRoutes       = require("./routes/auth");
const documentRoutes = require("./routes/documents")

var options = {
     server: { 
        // sets how many times to try reconnecting
        reconnectTries: Number.MAX_VALUE,
        // sets the delay between every retry (milliseconds)
        reconnectInterval: 1000 
        } 
    
  };
mongoose.connect( process.env.MONGO_DB_URL, options, { useNewUrlParser: true });

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: process.env.PASSPORT_SECRET,
    resave: false, 
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
//passport.use(new LocalStrategy({
//    usernameField: 'email'
//  },User.authenticate()));
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});


//express router   
app.use(indexRoutes);
app.use(authRoutes);
app.use(documentRoutes);
   
   app.listen(process.env.PORT || 3000, function(){
    console.log("The server is up and running...");
});
