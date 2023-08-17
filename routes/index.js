var express = require("express");
var router = express.Router();
const User = require("../models/userModel");


router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});
router.post("/signup", async (req, res) => {
  try {
  
    res.redirect("/signin");
  } catch (err) {
    res.send(err.message);
  }
});
router.get("/signin", (req, res) => {
  res.render("signin", { user: req.user });
});

router.post("/signin",
  (req, res, next) => {}
);

router.get("/home",async (req, res, next) => {
  try {
    console.log(req.user);
    const proData = await User.find();
    res.render("home", { proData, user: req.user });
  } catch (error) {
    res.send(error);
  }
});

router.get("/profile", async (req, res, next) => {
  try {
    res.render("profile", { title: "Profile", user: req.user });
  } catch (error) {
    res.send(error);
  }
});

router.post("/avatar", async (req, res, next) => {
    try {
     
      res.redirect("/profile");
    } catch (error) {
      res.send(error);
    }
  }
);


router.get("/signout", async (req, res, next) => {
 
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


router.post("/get-email", async (req, res) => {
  try {
   
  } catch (error) {
    res.send(error);
  }
});

router.get("/change-password/:id", (req, res, next) => {
  res.render("change-password", { id: req.params.id, user: null });
});
router.post("/change-password/:id", async (req, res, next) => {
  try {
   
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
   
    res.redirect("/home");
  } catch (error) {
    res.send(error);
  }
});


module.exports = router;
