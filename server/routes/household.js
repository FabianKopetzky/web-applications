var express = require('express');
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

const householdData = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Beta' }
];

router.get('/', (req, res) => {
  res.json(householdData);
});

router.get('/:id', (req, res) => {
  const household = householdData.find(h => h.id === req.params.id);
  if (household) {
    res.json(household);
  } else {
    res.status(404).send();
  }
});

module.exports = router;
