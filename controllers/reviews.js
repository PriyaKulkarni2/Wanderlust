const Listing = require("../models/listing");
const Review = require("../models/reviews");

//post method to create new review
module.exports.createNewReview = async(req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success","Review created successfully");
    res.redirect(`/listings/${req.params.id}`);
}

module.exports.destroyReview = async(req,res) => {
    let {id,reviewId} = req.params;
    console.log(id);
    console.log(reviewId);
    await Listing.findByIdAndUpdate(id,{$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted successfully");
    res.redirect(`/listings/${id}`); 
}