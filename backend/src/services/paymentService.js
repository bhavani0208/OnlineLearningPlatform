const Razorpay = require('razorpay');
const crypto = require('crypto');
const { Order, Payment, Enrollment, Course } = require('../models/index');
require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (courseId, userId) => {
  const course = await Course.findByPk(courseId);
  if (!course) throw new Error('Course not found');

  const existingEnrollment = await Enrollment.findOne({ where: { userId, courseId } });
  if (existingEnrollment) throw new Error('Already enrolled in this course');

  const amount = Math.round(course.price * 100);

  // Use real Razorpay if keys are available, otherwise use mock
  let razorpayOrderId;
  if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_ID.includes('dummy') && !process.env.RAZORPAY_KEY_ID.includes('test_1DP5')) {
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    razorpayOrderId = razorpayOrder.id;
  } else {
    // Mock order ID for development
    razorpayOrderId = `order_mock_${Date.now()}`;
  }

  const order = await Order.create({
    razorpayOrderId,
    amount: course.price,
    currency: 'INR',
    status: 'created',
    userId,
    courseId,
  });

  return {
    orderId: razorpayOrderId,
    amount,
    currency: 'INR',
    courseTitle: course.title,
    dbOrderId: order.id,
    isMock: razorpayOrderId.includes('mock'),
  };
};

const verifyPayment = async ({ razorpayOrderId, razorpayPaymentId, razorpaySignature, userId }) => {
  // Skip signature verification for mock orders
  if (!razorpayOrderId.includes('mock')) {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    if (expectedSignature !== razorpaySignature) {
      throw new Error('Payment verification failed');
    }
  }

  const order = await Order.findOne({ where: { razorpayOrderId } });
  if (!order) throw new Error('Order not found');

  await order.update({ status: 'paid' });

  await Payment.create({
    razorpayPaymentId,
    razorpaySignature,
    amount: order.amount,
    currency: order.currency,
    status: 'success',
    orderId: order.id,
  });

  const enrollment = await Enrollment.create({
    userId,
    courseId: order.courseId,
  });

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
