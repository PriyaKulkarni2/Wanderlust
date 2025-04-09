const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const UserCotroller = require("../controllers/users");

router.get("/signup",UserCotroller.renderSignupForm);

router.post("/signup",wrapAsync(UserCotroller.signup));

router.get("/login",UserCotroller.renderLoginForm);

//we use saveRedirectUrl just before authenticating the user so that the req url gets stored 
router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login",failureFlash:true}),UserCotroller.login);

router.get("/logout",UserCotroller.logout);

module.exports = router;
