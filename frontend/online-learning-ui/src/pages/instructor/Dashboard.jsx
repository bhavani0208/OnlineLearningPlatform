import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInstructorCoursesAPI } from '../../services/courseService';
import { FiPlus, FiBook, FiUsers, FiEye } from 'react-icons/fi';

const InstructorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getInstructorCoursesAPI();
        setCourses(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Instructor Dashboard</h1>
        <Link
          to="/instructor/create-course"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
        >
          <FiPlus /> New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg"><FiBook className="text-blue-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{courses.length}</p>
              <p className="text-sm text-gray-500">Total Courses</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg"><FiUsers className="text-green-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {courses.reduce((sum, c) => sum + (c.enrollments?.length || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg"><FiEye className="text-purple-600" size={20} /></div>
            <div>
              <p className="text-2xl font-bold text-gray-800">
                {courses.filter((c) => c.isPublished).length}
              </p>
              <p className="text-sm text-gray-500">Published</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">My Courses</h2>
        </div>
        {courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No courses yet. Create your first course!</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Course</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Students</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{course.title}</td>
                  <td className="px-6 py-4 text-gray-600">₹{course.price}</td>
                  <td className="px-6 py-4 text-gray-600">{course.enrollments?.length || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${course.isPublished ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InstructorDashboard;
