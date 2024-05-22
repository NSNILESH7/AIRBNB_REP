const mongoose = require("mongoose");
const review = require("./review");
let Schema = mongoose.Schema;

let listingSchme = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  geometry:{
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: false
      },
      coordinates: {
        type: [Number],
        required: false
      }
  }
});

listingSchme.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

let Listing = mongoose.model("Listing", listingSchme);

module.exports = Listing;
