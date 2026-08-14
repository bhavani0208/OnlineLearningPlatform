const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Order, Payment, Enrollment, Course } = require('../models/index');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (courseId, userId) => {
  // Check if course exists
  const course = await Course.findByPk(courseId);
  if (!course) throw new Error('Course not found');

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({ where: { userId, courseId } });
  if (existingEnrollment) throw new Error('Already enrolled in this course');

  // Amount in paise (Razorpay uses smallest currency unit)
  const amount = Math.round(course.price * 100);

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  });

  // Save order in DB
  const order = await Order.create({
    razorpayOrderId: razorpayOrder.id,
    amount: course.price,
    currency: 'INR',
    status: 'created',
    userId,
    courseId,
  });

  return {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    courseTitle: course.title,
    dbOrderId: order.id,
  };
};

const verifyPayment = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, userId }) => {
  // Verify signature
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new Error('Payment verification failed');
  }

  // Find order in DB
  const order = await Order.findOne({ where: { razorpayOrderId } });
  if (!order) throw new Error('Order not found');

  // Update order status
  await order.update({ status: 'paid' });

  // Create payment record
  await Payment.create({
    razorpayPaymentId,
    razorpaySignature,
    amount: order.amount,
    currency: order.currency,
    status: 'success',
    orderId: order.id,
  });

  // Create enrollment
  const enrollment = await Enrollment.create({
    userId,
    courseId: order.courseId,
  });

  // Increment total enrollments on course
  await Course.increment('totalEnrollments', { where: { id: order.courseId } });

  return { enrollment, message: 'Payment verified and enrollment created' };
};

const getMyEnrollments = async (userId) => {
  const enrollments = await Enrollment.findAll({
    where: { userId },
    include: [{ model: Course, as: 'course', include: [{ model: require('../models/User'), as: 'instructor', attributes: ['firstName', 'lastName'] }] }],
  });
  return enrollments;
};

module.exports = { createOrder, verifyPayment, getMyEnrollments };
