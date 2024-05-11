const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../validateSchema.js");
const { isloggedin, isowner, validateSchema } = require("../midleware.js");
const {
  index,
  renderNewform,
  newListing,
  showListing,
  editListing,
  updateListing,
  destroyListing,
} = require("../controller/listing.js");


const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({storage})

// new listing
router.route("/")
.get(wrapAsync(index))
.post( isloggedin, 
 (upload.single('listing[image]')),validateSchema,wrapAsync(newListing));

// add New
router.get("/new", isloggedin, renderNewform);

// show Routs
router.route("/:id")
.get( wrapAsync(showListing))
.put(
  isloggedin,
  isowner,
  (upload.single('listing[image]')),
  validateSchema,
  wrapAsync(updateListing)
)
.delete( isloggedin, isowner, wrapAsync(destroyListing));

//edit Route

router.get("/:id/edit", isloggedin, isowner, wrapAsync(editListing));


module.exports = router;
