import { useEffect, useState } from 'react';
import { getMyEnrollmentsAPI } from '../../services/paymentService';
import { FiBook } from 'react-icons/fi';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await getMyEnrollmentsAPI();
        setEnrollments(data.data);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Courses</h1>
      {enrollments.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">📚</p>
          <h2 className="text-xl font-bold text-gray-800 mb-2">No courses yet</h2>
          <p className="text-gray-600">Purchase a course to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enrollment) => (
            <div key={enrollment.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-36 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                <FiBook className="text-white" size={40} />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-1">{enrollment.course?.title}</h3>
                <p className="text-sm text-gray-500 mb-3">
                  by {enrollment.course?.instructor?.firstName} {enrollment.course?.instructor?.lastName}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${enrollment.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{enrollment.progress}% complete</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
