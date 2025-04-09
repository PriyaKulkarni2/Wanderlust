const Listing = require("../models/listing");

module.exports.index = async (req,res,next) => {
    let listings = await Listing.find({});
    res.render("listings/index.ejs",{listings});
}

module.exports.renderNewForm  = (req,res) => {
    res.render("listings/new.ejs");
}

module.exports.createNewListing = async (req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success","new listing created successfully");// flash message 
    res.redirect("listings/");
}

module.exports.showListing = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
    if(!listing){
        req.flash("error","listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
}

module.exports.renderEditForm = async (req,res,next) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","listing does not exist");
        res.redirect("/listings");
    }
    let originalListingUrl = listing.image.url;
    originalListingUrl = originalListingUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,originalListingUrl});
}

module.exports.updateListing = async (req,res,next) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing edited successfully");
    res.redirect(`${id}`);
}

module.exports.destroyListing  = async (req,res,next) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully");
    res.redirect("/listings");
}