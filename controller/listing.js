const Listing = require("../models/listing");
const mbxGeoCoding= require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeoCoding({ accessToken: mapBoxToken });

module.exports.index= async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs", { alllisting });
  }


  module.exports.renderNewform=(req, res) => {
    res.render("listing/new.ejs");
  }


  module.exports.newListing=async (req, res, next) => {

    let coordinate=await geocodingClient.forwardGeocode({
      query: req.body.listing.location,
      limit: 1
    })
      .send()
      
    let url=req.file.path;
    let filename=req.file.filename; 

    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;

    newlisting.image={url,filename}
    newlisting.geometry=coordinate.body.features[0].geometry;

    let saved=await newlisting.save();
console.log(saved);
    req.flash("success", "new Listing created!");
    res.redirect("/listings");
    console.log(newlisting);
  }

  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", " Listing you requested for is does not exist!");
      res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
  }

  module.exports.editListing=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", " Listing you requested for is does not exist!");
      res.redirect("/listings");
    }
    let originalImg=listing.image.url;
    originalImg=originalImg.replace("/uploads/","/uplods/h_300,w_250");
    res.render("listing/edit.ejs", { listing,originalImg });
  }


  module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    //console.log(req.body);
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

if(typeof req.file!="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image= {url,filename}
    await listing.save();
}

    req.flash("success", " Listing updated!");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
  };