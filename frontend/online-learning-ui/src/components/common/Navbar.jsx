import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">LearnHub</Link>

        <div className="flex items-center gap-4">
          <Link to="/courses" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
            Courses
          </Link>

          {user ? (
            <>
              {user.role === 'instructor' && (
                <Link to="/instructor/dashboard" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                  Dashboard
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                  Admin
                </Link>
              )}
              {user.role === 'student' && (
                <Link to="/my-courses" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                  My Courses
                </Link>
              )}
              <Link to="/cart" className="relative text-gray-600 hover:text-blue-600">
                <FiShoppingCart size={20} />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <FiUser size={16} /> {user.firstName}
              </span>
              <button onClick={handleLogout} className="text-gray-600 hover:text-red-500">
                <FiLogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm font-medium">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
