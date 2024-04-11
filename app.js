const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
let mongoose_url = "mongodb://127.0.0.1:27017/wanderlust";
let path = require("path");
const methodoverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./validateSchema.js");

main()
  .then(() => {
    console.log("conmmectd to Db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoose_url);
}

app.get("/", (req, res) => {
  res.send("hello bro");
});

// app.get("/testing", async (req, res) => {
//   let testing = new Listing({
//     title: "my villa",
//     description: "wonderful view...:)",
//     price: 20000,
//     loction: "coorg",
//     country: "India",
//   });

//   await testing.save();
//   console.log("db saved");
//   res.send("sucesfully");
// });

app.set("view engine", "ejs");
app.set("/views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "public")));

// index Rout
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const alllisting = await Listing.find({});
    res.render("listing/index.ejs", { alllisting });
  })
);

const validateSchema = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  // console.log(result);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, error);
  } else {
    next();
  }
};


// add New
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

app.post(
  "/listings",validateSchema,
  wrapAsync(async (req, res, next) => {
    let newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
  })
);

// show Routs
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/show.ejs", { listing });
  })
);

//edit Route

app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  })
);

//update Route
app.put(
  "/listings/:id",validateSchema,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    //console.log(req.body);
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page Not found!"));
});

// ERRO HNADLER
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somthing went Wrong!" } = err;
  res.status(statusCode).render("listing/error.ejs", { err });
  // res.status(statusCode).send(message);
});

// listening Port
app.listen(8080, () => {
  console.log("app is listining");
});


