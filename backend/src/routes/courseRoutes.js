const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  createSection,
  getInstructorCourses,
} = require('../controllers/courseController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management endpoints
 */

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all published courses
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [beginner, intermediate, advanced]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get('/', getAllCourses);

/**
 * @swagger
 * /api/courses/instructor/my-courses:
 *   get:
 *     summary: Get instructor's own courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of instructor courses
 */
router.get('/instructor/my-courses', authenticate, authorize('instructor', 'admin'), getInstructorCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
router.get('/:id', getCourseById);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course (instructor only)
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, price, categoryId]
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               level:
 *                 type: string
 *                 enum: [beginner, intermediate, advanced]
 *               categoryId:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created
 */
router.post('/', authenticate, authorize('instructor', 'admin'), createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course (instructor only)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Course updated
 */
router.put('/:id', authenticate, authorize('instructor', 'admin'), updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course (instructor only)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted
 */
router.delete('/:id', authenticate, authorize('instructor', 'admin'), deleteCourse);

/**
 * @swagger
 * /api/courses/{id}/sections:
 *   post:
 *     summary: Add section to a course (instructor only)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, order]
 *             properties:
 *               title:
 *                 type: string
 *               order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Section created
 */
router.post('/:id/sections', authenticate, authorize('instructor', 'admin'), createSection);

module.exports = router;
