const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");

//review
//post
//to add a new review
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.createNewReview));

//to delete a review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.destroyReview));

module.exports = router;