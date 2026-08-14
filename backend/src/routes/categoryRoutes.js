const express = require('express');
const router = express.Router();
const { Category } = require('../models/index');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Get all categories - public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({ where: { isActive: true } });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create category - admin only
router.post('/', authenticate, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });
    const category = await Category.create({ name, description });
    res.status(201).json({ success: true, message: 'Category created', data: category });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
