const express = require('express');

const router = express.Router();


router.get('/getUser', async (req, res) => {
  res.json(res.locals.user);
});


module.exports = router;
