var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/db');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var User = require("../models/User");
const key = process.env.JWT_SECRET;

router.post('/register', function(req, res) {
    if (!req.body.email|| !req.body.password || !req.body.firstName || !req.body.lastName) {
      res.status(401).json({success: false, msg: 'Please pass email, password, first name, and last name.'});
    } else {
      var newUser = new User({
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
      });
      newUser.save().then(() =>{
        res.status(200).json({success: true, msg: 'Created new user.'});
      }).catch((err) => {
        return res.status(401).json({success: false, msg: 'User with that email already exists.'});
      });
    }
  });

  router.post('/login', function(req, res) {
    User.findOne({
      email: req.body.email
    }).then((user) => {
        
        if (!user) {
            res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            console.log("found user");
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
              if (isMatch && !err) {
                // if user is found and password is right create a token
                var token = jwt.sign({ email: user.email }, key,  {expiresIn: "1h"});
                // return the information including token as JSON
                res.json({success: true, token: token});
              } else {
                res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
              }
            });
        }
    }).catch((err) => {
        throw err;
    }); 
  });

  module.exports = router;
