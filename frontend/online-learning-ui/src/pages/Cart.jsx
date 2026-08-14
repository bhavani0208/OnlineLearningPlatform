import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, clearCart } from '../store/slices/cartSlice';
import { createOrderAPI, verifyPaymentAPI } from '../services/paymentService';
import toast from 'react-hot-toast';
import { FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const total = items.reduce((sum, item) => sum + Number(item.price), 0);

  const handleCheckout = async (course) => {
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    try {
      const { data } = await createOrderAPI(course.id);
      const order = data.data;

      // Mock payment for development
      if (order.isMock) {
        await verifyPaymentAPI({
          razorpayOrderId: order.orderId,
          razorpayPaymentId: `pay_mock_${Date.now()}`,
          razorpaySignature: `sig_mock_${Date.now()}`,
        });
        dispatch(removeFromCart(course.id));
        toast.success('Payment successful! Course enrolled.');
        navigate('/my-courses');
        return;
      }

      // Real Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'LearnHub',
        description: order.courseTitle,
        order_id: order.orderId,
        handler: async (response) => {
          try {
            await verifyPaymentAPI({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            dispatch(removeFromCart(course.id));
            toast.success('Payment successful! Course enrolled.');
            navigate('/my-courses');
          } catch {
            toast.error('Payment verification failed');
          }
        },
        prefill: { name: `${user.firstName} ${user.lastName}`, email: user.email },
        theme: { color: '#2563eb' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-5xl mb-4">🛒</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-600">Add some courses to get started</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((course) => (
            <div key={course.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{course.title}</h3>
                <p className="text-sm text-gray-500">{course.level}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-blue-600">₹{course.price}</span>
                <button
                  onClick={() => handleCheckout(course)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                >
                  Buy Now
                </button>
                <button onClick={() => dispatch(removeFromCart(course.id))} className="text-red-500 hover:text-red-700">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>{items.length} course(s)</span>
            <span>₹{total}</span>
          </div>
          <hr className="my-3" />
          <div className="flex justify-between font-bold text-gray-800 mb-6">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
          <button
            onClick={() => dispatch(clearCart())}
            className="w-full border border-red-500 text-red-500 py-2 rounded-lg text-sm hover:bg-red-50"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
