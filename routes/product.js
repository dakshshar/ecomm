const express = require('express');

const router = express.Router();

// Example: Get all products
router.get('/', (req, res) => {
    res.json({ message: 'List of products' });
});

// Example: Get a single product by ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Product details for ID: ${id}` });
});

// Example: Create a new product
router.post('/', (req, res) => {
    // const newProduct = req.body;
    res.status(201).json({ message: 'Product created' });
});

// Example: Update a product by ID
router.put('/:id', (req, res) => {
    const { id } = req.params;
    // const updatedProduct = req.body;
    res.json({ message: `Product with ID: ${id} updated` });
});

// Example: Delete a product by ID
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    res.json({ message: `Product with ID: ${id} deleted` });
});

module.exports = router;