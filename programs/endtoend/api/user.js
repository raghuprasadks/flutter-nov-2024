const express = require('express');
const router = express.Router();

// Create a new user
router.post('/', async (req, res) => {
  console.log("req.body:post##",req.body)
  const { name, email, mobile, password } = req.body;
  const newUser = { name, email, mobile, password };

  try {
    const result = await req.db.collection('users').insertOne(newUser);
    console.log("result##",result)
    res.status(201).json({"message":"User created successfully"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await req.db.collection('users').findOne({ email, password });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read all users
router.get('/', async (req, res) => {
  try {
    const users = await req.db.collection('users').find().toArray();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Read a single user by ID
router.get('/:id', async (req, res) => {
  const { ObjectId } = require('mongodb');
  try {
    const user = await req.db.collection('users').findOne({ _id: new ObjectId(req.params.id) });
    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
  const { ObjectId } = require('mongodb');
  const { name, email, mobile, password } = req.body;
  const updatedUser = { name, email, mobile, password };

  try {
    const result = await req.db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedUser },
      { returnOriginal: false }
    );
    if (!result.value) return res.status(404).send('User not found');
    res.json(result.value);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a user by ID
router.delete('/:id', async (req, res) => {
  const { ObjectId } = require('mongodb');
  try {
    const result = await req.db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).send('User not found');
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;