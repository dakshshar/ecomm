const express = require('express');
const router = express.Router();
const Coffee = require('../modules/products');

// Get all products
router.get('/', async (req, res) => {
  try {
    const data = await Coffee.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const coffee = await Coffee.findById(req.params.id);
    if (!coffee) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(coffee);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching product' });
  }
});

// Create a new product
router.post('/', async (req, res) => {
  try {
    const newCoffee = new Coffee(req.body);
    const saved = await newCoffee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Invalid product data' });
  }
});

// Update product by ID
router.put('/:id', async (req, res) => {
  try {
    const updated = await Coffee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
});

// Delete product by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Coffee.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
