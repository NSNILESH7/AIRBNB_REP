const express=require('express');
const router= express.Router({mergeParams:true});
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../validateSchema.js");
const Review = require("../models/review");
const { isloggedin, isreviewauthor,validateReview } = require("../midleware.js");
const { postReview, deleteReview } = require('../controller/review.js');
 





  // post review route
router.post("/", validateReview,isloggedin, postReview);
  
  //delete review route
  
  router.delete(
    "/:reviewId",isloggedin,isreviewauthor,
    wrapAsync(deleteReview)
  );

  module.exports=router