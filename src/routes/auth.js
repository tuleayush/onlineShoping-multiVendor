const express = require("express");
const router = express.Router();
const passport = require('passport');

const AuthController = require("../controllers/auth");
const upload = require('../utilities/fileUploader');
const FacebookStrategy = require('passport-facebook').Strategy;

router.post("/register/:role?",
  upload.fields([{ name: 'storeLogoImage', maxCount: 1 }, { name: 'storeHomeImage', maxCount: 1 }]),
  AuthController.register);

router.get("/loginwithotp/:mobile", AuthController.loginWithMobile);

router.get("/otpverify/:otp/:token", AuthController.otpVerification);

router.get(
  "/adminotpverify/:otp/:token",
  AuthController.otpVerificationForAdmin
);

router.post("/login", AuthController.login);

router.post("/adminlogin", AuthController.adminLogin);

// router.post('/refresh-token', AuthController.refreshToken)

router.delete("/logout", AuthController.logout);

router.post("/requestResetPassword", AuthController.requestPasswordReset);

router.post("/resetPassword", AuthController.resetPassword);


router.get("/ping", AuthController.pingToken);

var userProfile;

/* Google Login */

router.get('/success', (req, res, next) => {
  req.userProfile = userProfile
  console.log(req.userProfile)
  next()
}, AuthController.googleLogin);
router.get('/error', (req, res) => res.send("error logging in"));


passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});


const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '110899709630-fptkoa1gnmuv08e13oihmq480t4gn4qq.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8089/api/v1/auth/google/callback"
},
  function (accessToken, refreshToken, profile, done) {
    userProfile = profile;
    return done(null, userProfile);
  }
));

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}), AuthController.googleLogin);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function (req, res) {
    // Successful authentication, redirect success.
    res.redirect('/api/v1/auth/success');
  }, AuthController.googleLogin);


/* Facebook Login */

passport.use(new FacebookStrategy({
  clientID: '1884418251766510',
  clientSecret: '32be93935ba17eee0faba40fab92f96b',
  callbackURL: 'http://localhost:8089/api/v1/auth/facebook/callback'
}, function (accessToken, refreshToken, profile, done) {
  console.log("facebook", profile);
  return done(null, profile);
}
));

// router.get('/profile', isLoggedIn, function (req, res) {
//   res.render('pages/profile.ejs', {
//     user: req.user // get the user out of session and pass to template
//   });
// });

// router.get('/error', isLoggedIn, function (req, res) {
//   res.render('pages/error.ejs');
// });

// router.get('/auth/facebook', passport.authenticate('facebook', {
//   scope: ['public_profile', 'email']
// }));

// router.get('/api/v1/auth/facebook/callback',
//   passport.authenticate('facebook', {
//     successRedirect: '/profile',
//     failureRedirect: '/error'
//   }));

router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/users');
  });


router.get('/logout', function (req, res) {
  req.logout();
  // res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  // res.redirect('/');
}


module.exports = router;
