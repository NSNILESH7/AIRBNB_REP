const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema } = require("./validateSchema");
const { reviewSchema } = require("./validateSchema.js");

module.exports.isloggedin = (req, res, next) => {
  console.log(req.user);
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "you moust be logged in first");
    return res.redirect("/login");
  }
  next();
};

module.exports.redirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isowner = async (req, res, next) => {
  let { id } = req.params;
  let listings = await Listing.findById(id);
  if (!listings.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you have not permission");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isreviewauthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  console.log(review);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};


module.exports.validateSchema = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

module.exports. validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  // console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};