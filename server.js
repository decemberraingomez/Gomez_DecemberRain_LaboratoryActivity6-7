require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

const Pokemon = mongoose.model('pokemon', new mongoose.Schema({
  name: String,
  type: String,
  level: Number,
  nature: String
}));

// GET: read all pokemon from the database
app.get('/api/pokemon', async (req, res) => {
  const pokemon = await Pokemon.find();
  res.send(pokemon);
});

// POST: save a new pokemon
app.post('/api/pokemon', async (req, res) => {
  const pokemon = new Pokemon(req.body);
  await pokemon.save();
  res.send(pokemon); console.log("Added new pokemon:", pokemon);
});

// DELETE: remove a pokemon by its MongoDB _id
app.delete('/api/pokemon/:id', async (req, res) => {
  await Pokemon.findByIdAndDelete(req.params.id);
  res.sendStatus(204); // 204 = success, no content to send back
});

// PUT: update a pokemon by its MongoDB _id
app.put('/api/pokemon/:id', async (req, res) => {
  const updated = await Pokemon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updated); // { new: true } returns the updated document
});