var express = require('express');
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

const userData = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Beta' }
];

router.get('/', (req, res) => {
  res.json(userData);
});

router.get('/:id', (req, res) => {
  const user = userData.find(u => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).send();
  }
});

module.exports = router;
