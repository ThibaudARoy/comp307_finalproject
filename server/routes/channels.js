var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/db');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var User = require("../models/Channel");
var User = require("../models/Board");
const Channel = require('../models/Channel');

router.post('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);

    if (token) {
      var boardId = req.params.boardId;
      var newChannel = new Channel({
        name: req.body.name,
        board: boardId,
        members: req.body.members,
        //messages: req.body.messages
      });
  
      newChannel.save().then(() => {
        res.status(200).json({success: true, msg: 'Successful created new channel.'});
      }).catch((err)=> {
        return res.status(401).json({success: false, msg: 'Create channel failed.'});
      });

    } else {
      return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
  });

  router.get('/', passport.authenticate('jwt', { session: false}), function(req, res) {
    var token = getToken(req.headers);

    if (token) {
        const board = Board.findById(req.params.boardId);
        if (board) {
            res.status(200).json({success: true, channels: board.channels});
        } else {
            return res.status(401).json({success: false, msg: "Board does not exist. Id : " + req.params.boardId});
        }
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});

    }
  });

  router.delete('/', passport.authenticate('jwt', { session: false}), function(req, res) {});


  getToken = function (headers) {
    if (headers && headers.authorization) {
      return headers.authorization;
    } else {
      return null;
    }
  };