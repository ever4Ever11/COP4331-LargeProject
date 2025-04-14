require('dotenv').config();
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

client.connect((err) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
  console.log('Connected to MongoDB');
});

const api = require('./api.js');
api.setApp(app, client);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

//for global server use
app.use(express.static('/var/www/html'));

app.get('*', (req, res) => {
  res.sendFile(path.join('/var/www/html', 'index.html'));
});
//--------------------------------------------


//-------------------------------------------
// for local machine use only
// app.use(express.static(path.join(__dirname, '../web/dist')));

// app.get('*', (req, res) =>
// {
//   res.sendFile(path.join(__dirname, '../web/dist', 'index.html'));
// });
//-------------------------------------------


app.listen(PORT, () =>
{
  console.log(`Server is running on port ${PORT}`);
});
