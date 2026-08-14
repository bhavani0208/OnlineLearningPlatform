const express = require('express');
const router = express.Router();
const { createLesson } = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

// Add lesson to a section
router.post('/:id/lessons', authenticate, authorize('instructor', 'admin'), createLesson);

module.exports = router;
