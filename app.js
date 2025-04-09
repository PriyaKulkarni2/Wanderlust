if(process.env.NODE_ENV != "production"){ //this checks that you are not in production phase and still developing
    require('dotenv').config()
}
//install dotenv which is a module that stores the environment variables of the .env file to process.env
  

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL = "mongodb://localhost:27017/wanderlust";
const atlasUrl = process.env.ATLASDB_URL;

const store = MongoStore.create({
    mongoUrl : atlasUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600
});

store.on("error", (err) => {
    console.log("Error in mongo session storing",err);
});

const sessionVariable = {
    store:store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : false,
    //defining cookie variables
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000, //when the cookie will be deleted
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    }
};

const listing = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public/css")));
app.use(express.static(path.join(__dirname,"public/js")));

app.engine("ejs",ejsMate);

app.use(session(sessionVariable));    
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //never forget this paranthesis
passport.deserializeUser(User.deserializeUser()); //never forget this paranthesis

//middleware to render the flash in variable successMsg
app.use((req,res,next) => {
    res.locals.successMsg = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//creating a new user
app.get("/newuser",async(req,res) => {
    let fakeUser = new User({
        email : "student@gmail.com",
        username : "delta-student"
    });
    let registeredUser = await User.register(fakeUser,"hello"); //here .register is the function ehich takes inputs user and password
    res.send(registeredUser);
});

app.use("/listings",listing);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);

main()
.then(() => {
    console.log("conected to db");
}).catch(err =>{
    console.log(err);
});

async function main() {
    await mongoose.connect(atlasUrl);
}

app.get("/",(req,res) => {
    res.send("root working properly");
});



//page not found
app.all("*",(req,res,next) => {
    next( new ExpressError(404,"Page not found"));
});

//error handling
app.use((err,req,res,next) => {
    let {statusCode = 500, message = "something went wrong!"} = err;
    res.render("error.ejs",{message});
});

app.listen(8080,() => {
    console.log("server listening on port 8080");
});