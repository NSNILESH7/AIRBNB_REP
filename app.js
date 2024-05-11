if (process.env.NODE_ENV != "PRODUCTION") {
  require("dotenv").config();
}
// console.log(process.env.CLOUD_NAME);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
let mongoose_url = "mongodb://127.0.0.1:27017/wanderlust";
let path = require("path");
const methodoverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { log } = require("console");

let dburl=process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("conmmectd to Db");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dburl);
}

// app.get("/", (req, res) => {
//   res.send("hello bro");
// });

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


const store=MongoStore.create({
  mongoUrl:dburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter:24 * 3600,
});

store.on("error",()=>{
  console.log("error in mongoSession",err);
});

const sessionOption = {
  store,
  secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};




app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// error handler
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


