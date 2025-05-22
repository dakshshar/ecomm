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


mongoose.connect(process.env.MONGO_URI
    , {
        dbName: process.env.DB_NAME
    })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

app.get(`${process.env.API_URL}/products`, (req, res) => {

console.log('Products route');
    res.send('Products route');
});



// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running at ${process.env.PORT}`);
});