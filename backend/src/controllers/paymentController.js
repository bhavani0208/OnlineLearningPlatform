const paymentService = require('../services/paymentService');

const createOrder = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'courseId is required' });
    }
    const order = await paymentService.createOrder(courseId, req.user.id);
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ success: false, message: 'All payment fields are required' });
    }
    const result = await paymentService.verifyPayment({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      userId: req.user.id,
    });
    res.status(200).json({ success: true, message: result.message, data: result.enrollment });
  } catch (err) {
    next(err);
  }
};

const getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await paymentService.getMyEnrollments(req.user.id);
    res.status(200).json({ success: true, data: enrollments });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, verifyPayment, getMyEnrollments };
