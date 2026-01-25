const express = require('express');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const db = req.app.get('db');
    let {email} = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({message: 'error.emailRequired'});
    }

    const cleanEmail = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail) || cleanEmail.length > 254) {
      return res.status(400).json({message: 'error.invalidEmail'});
    }

    const existingUser = await db.collection('user_auth').findOne({username: cleanEmail});
    if (existingUser) {
      return res.status(409).json({message: 'error.emailRegistered'});
    }


    const insertion = await db.collection('user_auth').insertOne({username: cleanEmail});
    if (insertion.acknowledged) {
      const token = uuidv4();
      const tokenInsertion = await db.collection('token').insertOne({
        emailToken: token,
        emailTokenExpiresAt: new Date(Date.now() + (1000 * 60 * 60)),
        user_id: insertion.insertedId,
      });

      if (tokenInsertion.acknowledged) {
        console.log(`Activation link: http://localhost:3000/register/${token}`);

        res.status(201).send();
      } else {
        res.status(500).json({message: 'error.serverError'});
      }
    } else {
      res.status(500).json({message: 'error.serverError'});
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'error.serverError'});
  }
});


router.put('/:token', async (req, res) => {
  try {
    const db = req.app.get('db');
    const {first_name, last_name, password} = req.body;

    if (!first_name?.trim() || !last_name?.trim()) {
      return res.status(400).json({message: 'error.namesRequired'});
    }
    if (!password || password.length < 8) {
      return res.status(400).json({message: 'error.passwordTooShort'});
    }

    const token = await db.collection('token').findOne({
      emailToken: req.params.token,
      emailTokenExpiresAt: {$gt: new Date()},
    });

    if (!token) {
      return res.status(401).json({message: 'error.linkInvalid'});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userProfile = await db.collection('user').insertOne({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      permissions: {write: false},
    });

    if (!userProfile.acknowledged) throw new Error('Profile creation failed');

    // Update the auth credentials
    const authUpdate = await db.collection('user_auth').updateOne(
      {_id: token.user_id},
      {
        $set: {
          password: hashedPassword,
          user_id: userProfile.insertedId,
        },
      },
    );

    if (authUpdate.modifiedCount === 1) {
      await db.collection('token').deleteOne({emailToken: req.params.token});
      res.status(200).json({message: 'success.activated'});
    } else {
      await db.collection('user').deleteOne({_id: userProfile.insertedId});
      res.status(500).json({message: 'error.serverError'});
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'error.serverError'});
  }
});

router.get('/:token', async (req, res) => {
  try {
    const db = req.app.get('db');

    const tokenData = await db.collection('token').findOne({
      emailToken: req.params.token,
      emailTokenExpiresAt: {$gt: new Date()},
    });

    if (!tokenData) {
      return res.status(404).json({message: 'Activation link invalid or expired'});
    }

    const userAuth = await db.collection('user_auth').findOne({
      _id: tokenData.user_id,
    });

    if (!userAuth) return res.status(404).json({message: 'error.userNotFound'});

    res.json({email: userAuth.username});

  } catch (err) {
    console.error(err);
    res.status(500).json({message: 'error.serverError'});
  }
});


module.exports = router;

