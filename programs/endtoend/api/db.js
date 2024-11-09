const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'usersdb';

let db;

async function connectToDatabase() {
  if (db) return db; // Return the existing connection if already connected

  try {
    const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(dbName);
    console.log('Connected to MongoDB');
    return db;
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    throw err;
  }
}

module.exports = connectToDatabase;