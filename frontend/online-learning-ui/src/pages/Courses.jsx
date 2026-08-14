import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../store/slices/courseSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';

const Courses = () => {
  const dispatch = useDispatch();
  const { courses, loading, total } = useSelector((state) => state.courses);
  const { items } = useSelector((state) => state.cart);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    dispatch(fetchCourses({ search, level }));
  }, [search, level]);

  const handleAddToCart = (course) => {
    dispatch(addToCart(course));
    toast.success(`${course.title} added to cart!`);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">All Courses</h1>
        <p className="text-gray-600">{total} courses available</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No courses found</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-4xl">📚</span>
                )}
              </div>
              <div className="p-4">
                <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                  {course.level}
                </span>
                <h3 className="font-semibold text-gray-800 mt-2 mb-1 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  by {course.instructor?.firstName} {course.instructor?.lastName}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">₹{course.price}</span>
                  <div className="flex gap-2">
                    <Link
                      to={`/courses/${course.id}`}
                      className="text-sm text-blue-600 border border-blue-600 px-3 py-1 rounded-lg hover:bg-blue-50"
                    >
                      Details
                    </Link>
                    <button
                      onClick={() => handleAddToCart(course)}
                      disabled={items.some((i) => i.id === course.id)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
                    >
                      <FiShoppingCart size={14} />
                      {items.some((i) => i.id === course.id) ? 'Added' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Courses;
