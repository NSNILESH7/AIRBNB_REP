const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let listingSchme = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://unsplash.com/photos/a-https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D-of-palm-trees-sitting-in-the-middle-of-a-body-of-water-ur0JU-NBblk",
    set: (v) =>
      v ===""
        ? "https://unsplash.com/photos/a-https://images.unsplash.com/photo-1605649487212-47bdab064df7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D-of-palm-trees-sitting-in-the-middle-of-a-body-of-water-ur0JU-NBblk"
        : v,
  },
  price: Number,
  location: String,
  country: String,
});

let Listing = mongoose.model("Listing", listingSchme);

module.exports = Listing;
