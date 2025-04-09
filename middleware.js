const Listing = require("./models/listing");
const Review = require("./models/reviews");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {

    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl; // we are creating a variable in session, variable name redirectUrl and it stores req.originalUrl which is the whole path of the request
        req.flash("error","you need to be logged in to create new listing");
        return res.redirect("/login");
    }

    //req.isAuthenticated() is a method provided by passport.js, it is used to check whether the user that sent the request is authenticated(logged in) or not
    //when a user logs in successfully passport saves its info in a session, this isAuthenticated() checks if the session exists and is valid 

    next();
}

//we need this saveRedirectUrl middleware because when passport logs in a user it deletes all the previous req session info and variables 
module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){ // here we are checking whether there is a redirect Url or it is direct login
        res.locals.redirectUrl = req.session.redirectUrl; // saving rediectUrl of the req.session into res.locals
    }
    next();
}

module.exports.isOwner = async(req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
       req.flash("error","you are not the owner of this listing");
        return res.redirect(`${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
       req.flash("error","you are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    } else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    } else{
        next();
    }
};