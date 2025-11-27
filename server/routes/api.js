// api.js
var express = require('express');
var ObjectId = require('mongodb').ObjectId;

var router = express.Router();

// middleware to check write access
async function writeAccess(req, res, next) {
  try {
    var db = req.app.get('db');
    // after `oauth.authenticate()`, token info is in res.locals.oauth.token
    var user = await db.collection('user').findOne({ _id: res.locals?.oauth?.token?.user?.user_id });

    if (user?.permissions?.write) {
      res.locals.user = user; // store user object for later use
      next();
    } else {
      res.status(403).send();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
}

// route to create a todo
router.post('/todo', writeAccess, async function(req, res) {
  try {
    var db = req.app.get('db');
    var insertion = await db.collection('todo').insertOne({
      ...req.body,
      creator_id: res.locals.user._id
    });

    if (insertion.acknowledged) {
      var todo = await db.collection('todo').findOne({ _id: insertion.insertedId });

      if (todo) {
        res.status(201).json(todo);
      } else {
        res.status(404).send();
      }
    } else {
      res.status(500).send();
    }
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
