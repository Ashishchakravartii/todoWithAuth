var express = require("express");
var router = express.Router();
const User = require("../models/userModel");
const { sendmail } = require("../utils/mail");

const upload = require("../utils/multer");

const passport = require("passport");
const LocalStrategy = require("passport-local");

passport.use(new LocalStrategy(User.authenticate()));

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userData = { username, email };
    await User.register(userData, password);
    res.redirect("/signin");
  } catch (err) {
    res.send(err.message);
  }
});
router.get("/signin", (req, res) => {
  res.render("signin", { user: req.user });
});

router.post(
  "/signin",
  passport.authenticate("local", {
    failureRedirect: "/signin",
    successRedirect: "/home",
  }),
  (req, res, next) => {}
);

router.get("/home", isLoggedIn, async (req, res, next) => {
  try {
    console.log(req.user);
    const proData = await User.find();
    res.render("home", { proData, user: req.user });
  } catch (error) {
    res.send(error);
  }
});

router.get("/profile", isLoggedIn, async (req, res, next) => {
  try {
    res.render("profile", { title: "Profile", user: req.user });
  } catch (error) {
    res.send(error);
  }
});

router.post("/avatar",upload.single("avatar"),isLoggedIn, async (req, res, next) => {
    try {
      console.log(req.file.filename);
      res.redirect("/profile");
    } catch (error) {
      res.send(error);
    }
  }
);


router.get("/signout", async (req, res, next) => {
  req.logout(() => {
    res.redirect("/signin");
  });
});

router.get("/delete/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/home");
  } catch (error) {
    res.send(error);
  }
});
router.get("/update/:userId", async (req, res) => {
  const currentUser = await User.findById({ _id: req.params.userId });
  res.render("updateUser", { currentUser, user: req.user });
});

router.post("/update/:userId", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, req.body);
    res.redirect("/home");
  } catch (error) {
    res.send(error);
  }
});

router.get("/get-email", (req, res) => {
  res.render("getemail", { user: req.user });
});

// router.post("/send-mail", function (req, res, next) {
//   sendmail(req, res);
// });

router.post("/get-email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
      return res.send(
        `User not found. <a href="/get-email">Forget PAssword</a>`
      );
    }
    sendmail(req, res, user);
  } catch (error) {
    res.send(error);
  }
});

router.get("/change-password/:id", (req, res, next) => {
  res.render("change-password", { id: req.params.id, user: null });
});
router.post("/change-password/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (user.passwordResetToken === 1) {
      await user.setPassword(req.body.password);
      user.passwordResetToken = 0;
    } else {
      res.send(
        `link expired try again <a href="/get-email">Forget Password</a>`
      );
    }
    await user.save();
    res.redirect("/signin");
  } catch (error) {
    res.send(error);
  }
});

router.get("/reset/:id", async (req, res) => {
  res.render("reset", { id: req.params.id, user: req.user });
});
router.post("/reset/:id", isLoggedIn, async (req, res) => {
  try {
    await req.user.changePassword(req.body.oldpassword, req.body.newpassword);
    await req.user.save();
    res.redirect("/home");
  } catch (error) {
    res.send(error);
  }
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/signin");
}

module.exports = router;
