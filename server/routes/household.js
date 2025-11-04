var express = require('express');
const { ObjectId } = require('mongodb');
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

const COLLECTION_NAME = 'households';

router.get('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const all = await db.collection(COLLECTION_NAME).find({}).toArray();
    res.json(all);
  } catch(error) {
    console.error(error);
    res.status(500).send();
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const result = await db.collection(COLLECTION_NAME).findOne({_id: new ObjectId(req.params.id)});
    if (result) {
      res.json(result);
    } else {
      res.status(404).send();
    }
  } catch(error) {
    console.error(error);
    res.status(500).send();
  }
});

router.post('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    const insertion = await db.collection(COLLECTION_NAME).insertOne(req.body);
    if (insertion.acknowledged) {
      const newItem = await db.collection(COLLECTION_NAME)
        .findOne({ _id: insertion.insertedId });

      if (newItem) {
        res.status(201).json(newItem);
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

router.put('/:id', async (req, res) => {
  try {
    const db = req.app.get('db');

    const updateData = req.body;
    delete updateData._id;

    const updated = await db.collection(COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });

    if (updated.modifiedCount === 1) {
      const toDo = await db.collection(COLLECTION_NAME)
        .findOne({ _id: new ObjectId(req.params.id) });

      if (toDo) {
        res.json(toDo);
      } else {
        res.status(404).send();
      }
    } else {
      res.status(404).send();
    }
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.get('db');
    const deleted = await db.collection(COLLECTION_NAME)
      .deleteOne({ _id: new ObjectId(req.params.id) });

    if (deleted.deletedCount === 1) {
      res.send();
    } else {
      res.status(404).send();
    }
  } catch(err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
