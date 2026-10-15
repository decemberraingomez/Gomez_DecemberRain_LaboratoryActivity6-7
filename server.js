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
