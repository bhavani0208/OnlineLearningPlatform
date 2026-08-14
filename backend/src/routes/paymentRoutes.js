const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getMyEnrollments } = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Razorpay payment endpoints
 */

/**
 * @swagger
 * /api/payments/create-order:
 *   post:
 *     summary: Create Razorpay order for a course
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [courseId]
 *             properties:
 *               courseId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Razorpay order created
 */
router.post('/create-order', authenticate, authorize('student'), createOrder);

/**
 * @swagger
 * /api/payments/verify:
 *   post:
 *     summary: Verify Razorpay payment and enroll student
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [razorpayOrderId, razorpayPaymentId, razorpaySignature]
 *             properties:
 *               razorpayOrderId:
 *                 type: string
 *               razorpayPaymentId:
 *                 type: string
 *               razorpaySignature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified and enrollment created
 */
router.post('/verify', authenticate, authorize('student'), verifyPayment);

/**
 * @swagger
 * /api/payments/my-enrollments:
 *   get:
 *     summary: Get all enrolled courses of logged in user
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of enrollments
 */
router.get('/my-enrollments', authenticate, getMyEnrollments);

module.exports = router;
