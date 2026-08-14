import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById } from '../store/slices/courseSlice';
import { addToCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiClock, FiBook } from 'react-icons/fi';

const CourseDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedCourse: course, loading } = useSelector((state) => state.courses);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCourseById(id));
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(course));
    toast.success('Added to cart!');
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;
  if (!course) return <div className="text-center py-12 text-gray-500">Course not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left - Course Info */}
      <div className="lg:col-span-2">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{course.level}</span>
        <h1 className="text-3xl font-bold text-gray-800 mt-3 mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <p className="text-sm text-gray-500 mb-6">
          By {course.instructor?.firstName} {course.instructor?.lastName}
        </p>

        <div className="flex gap-6 mb-8">
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FiBook /> {course.totalLessons} lessons
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FiClock /> {course.totalDuration} mins
          </div>
        </div>

        {/* Sections */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Course Content</h2>
        {course.sections?.length === 0 ? (
          <p className="text-gray-500">No content yet</p>
        ) : (
          <div className="space-y-3">
            {course.sections?.map((section) => (
              <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-4 py-3 font-semibold text-gray-700">{section.title}</div>
                {section.lessons?.map((lesson) => (
                  <div key={lesson.id} className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm text-gray-600">{lesson.title}</span>
                    {lesson.isFree && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Free</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right - Purchase Card */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
          <div className="h-40 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
            <span className="text-white text-5xl">📚</span>
          </div>
          <p className="text-3xl font-bold text-blue-600 mb-4">₹{course.price}</p>
          <button
            onClick={handleAddToCart}
            disabled={items.some((i) => i.id === course.id)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <FiShoppingCart />
            {items.some((i) => i.id === course.id) ? 'Added to Cart' : 'Add to Cart'}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">30-Day Money-Back Guarantee</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
