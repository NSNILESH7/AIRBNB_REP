const express = require("express");
const router = express.Router();
const user = require("../models/user");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {redirectUrl}=require("../midleware.js");
const { signupform, signup, login, loginform, logout } = require("../controller/user.js");

router.get("/signup", signupform);

router.post(
  "/signup",
  wrapAsync(signup)
);

router.get("/login", loginform);

router.post(
  "/login",redirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  login
);

// logout
router.get("/logout", logout);

module.exports = router;
