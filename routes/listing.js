const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer  = require('multer');  //Multer adds a body object and a file or files object to the request object. The body object contains the values of the text fields of the form, the file or files object contains the files uploaded via the form.
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage }); //where to store the file

//router.route(path) compacts the code even more as we do not need to define the path again and again 
//we just put all the routes having same path in the same place
router.route("/")
.get(wrapAsync(ListingController.index)) //to show all the listings 
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.createNewListing)); //create new listing


//to go the the page that creates new listing
router.get("/new",isLoggedIn,ListingController.renderNewForm)// isLoggedIn is a middleware that check wheater the user that sent the reuest is logged in or not
    
router.route("/:id")
.get(wrapAsync(ListingController.showListing)) //to view a  particular listing
.put(isOwner,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.updateListing)) //to update a listing
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.destroyListing)); //to delete a listing

//to go to the page that edits the listing
router.get("/:id/edit",isLoggedIn,wrapAsync(ListingController.renderEditForm)); 

module.exports = router;