const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./db');
const userRoutes = require('./routes/user');
const cors = require('cors')

const app = express();
const PORT = 3000;
app.use(cors())
app.use(bodyParser.json());

app.use(async (req, res, next) => {
  try {
    req.db = await connectToDatabase();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Failed to connect to database' });
  }
});

app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});