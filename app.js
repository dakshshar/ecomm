const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Load environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(morgan('tiny'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use(`${process.env.API_URL}/users`, require('./routes/user'));
app.use(`${process.env.API_URL}/logout`, require('./routes/logout')); // Assuming logout router exists
app.use(`${process.env.API_URL}/products`, require('./routes/product'));

// Basic route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
