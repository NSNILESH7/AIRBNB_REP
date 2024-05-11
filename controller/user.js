const user = require("../models/user");


module.exports.signupform=(req, res) => {
    res.render("user/signup.ejs");
  }


  module.exports.signup=async (req, res) => {
    try {
      let { username, password, email } = req.body;
      const newUser = new user({ username, email });
      let registereduser = await user.register(newUser, password);
      console.log(registereduser);
      req.login(registereduser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "wellcome to Wonderloust");
        res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

  module.exports.loginform=(req, res) => {
    res.render("user/login.ejs");
  };

  module.exports.login=(req, res) => {
    req.flash("success", "well come back");
    let saveredirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(saveredirectUrl);
  }

  module.exports.logout=(req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you are logged out!");
      res.redirect("/listings");
    });
  };