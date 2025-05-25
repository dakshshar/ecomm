const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

// Load environment variables
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan('tiny'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  dbName: process.env.DB_NAME,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection e rror:', err));

// API Routes
app.use(`${process.env.API_URL}/users`, require('./routes/user'));
app.use(`${process.env.API_URL}/logout`, require('./routes/logout'));
app.use(`${process.env.API_URL}/products`, require('./routes/product'));

// Default route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
