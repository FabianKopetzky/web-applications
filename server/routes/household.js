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

router.get('/from_user', async (req, res) => {
  try {
    const db = req.app.get('db');
    const user_id = res.locals?.oauth?.token?.user?.user_id.toString();
    console.log(user_id);

    const all_from_user = await db.collection(COLLECTION_NAME).find({members: user_id}).toArray();
    res.json(all_from_user);
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

    const toDo = await db.collection(COLLECTION_NAME)
      .findOne({ _id: new ObjectId(req.params.id) });

      if (!toDo.members || toDo.members.length === 0) {
        await db.collection(COLLECTION_NAME).deleteOne({ _id: toDo._id });
        return res.status(200).json({ message: "Household deleted because it had no members" });
      }

    if (toDo) {
      res.json(toDo);
    } else {
      res.status(404).send();
    }

    // as below, why would i send a 404 if the requested data and the persisted data are identical?
    // if (updated.modifiedCount === 1) {
    //   const toDo = await db.collection(COLLECTION_NAME)
    //     .findOne({ _id: new ObjectId(req.params.id) });

    //     if (!toDo.members || toDo.members.length === 0) {
    //       await db.collection(COLLECTION_NAME).deleteOne({ _id: toDo._id });
    //       return res.status(200).json({ message: "Household deleted because it had no members" });
    //     }

    //   if (toDo) {
    //     res.json(toDo);
    //   } else {
    //     res.status(404).send();
    //   }
    // } else {
    //   // res.status(404).send();
    //   // why would i send a 404 if the requested data and the persisted data are identical?
    // }
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
