var mongoose = require("mongoose");
var passport = require("passport");
var config = require("../config/db");
require("../config/passport")(passport);
var express = require("express");
var jwt = require("jsonwebtoken");
var router = express.Router();
var User = require("../models/User");
const key = process.env.JWT_SECRET;
const { isAuthenticated } = require("../middleware/auth");

router.post("/auth/register", function (req, res) {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.firstName ||
    !req.body.lastName
  ) {
    res
      .status(400)
      .json({
        success: false,
        msg: "Please pass email, password, first name, and last name.",
      });
  } else {
    var newUser = new User({
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });

    newUser
      .save()
      .then(() => {
        res.status(201).json({ success: true, msg: "Created new user." });
      })
      .catch((err) => {
        if (err.code === 11000) {
          // MongoDB duplicate key error code
          res
            .status(409)
            .json({
              success: false,
              msg: "User with that email already exists.",
            });
        } else {
          res
            .status(500)
            .json({ success: false, msg: "Error registering new user." });
        }
      });
  }
});

router.post("/auth/login", function (req, res) {
  User.findOne({
    email: req.body.email,
  })
    .then((user) => {
      if (!user) {
        res.status(400).send({
          success: false,
          msg: "Authentication failed. User not found.",
        });
      } else {
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            var token = jwt.sign({ id: user._id }, key, { expiresIn: "1h" });
            res.json({ success: true, token: "Bearer " + token });
          } else {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. Wrong password.",
            });
          }
        });
      }
    })
    .catch((err) => {
      throw err;
    });
});

router.post("/auth/logout/", isAuthenticated(), async (req, res) => {
  res.json({success: true});
});

router.get("/auth/user/", isAuthenticated(), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
})

router.get("/users/:email/user", isAuthenticated(), async (req, res) => {
  try {
    const user = await User.find({email: req.params.email});
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*router.get("/users/:email/user/online", isAuthenticated(), async (req, res) => {

});*/

module.exports = router;
