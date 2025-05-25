const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const db = mongoose.connection;





require('dotenv/config');

// Load environment variables from .env file
dotenv.config();
// Connect to MongoDB               


// Middleware to parse JSON
app.use(bodyParser.json());
app.use(express.json());
app.use(express.json({ 
    extended: true }));

app.use(morgan('tiny'));


app.use(`${process.env.API_URL}`, require('./routes/user'));
app.use(`${process.env.API_URL}`, require('./routes/logout'));
app.use(`${process.env.API_URL}`, require('./routes/product'));
const Coffee = require('./modules/products');


mongoose.connect(process.env.MONGODB_URI
    , {
        dbName: process.env.DB_NAME
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello from Express!');

});


app.get(`${process.env.API_URL}/products`, async (req, res) => {
  const coffeeData = await Coffee.find();
  res.json(coffeeData);
});

// API route to add coffee (optional)
app.post(`${process.env.API_URL}/products`, async (req, res) => {
  const newCoffee = new Coffee(req.body);
  await newCoffee.save();
  res.status(201).json(newCoffee);
});







// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`);
});