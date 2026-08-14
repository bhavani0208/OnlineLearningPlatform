import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Learn Without Limits</h1>
        <p className="text-blue-100 text-lg mb-8">
          Start, switch, or advance your career with thousands of courses
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/courses" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
            Browse Courses
          </Link>
          {!user && (
            <Link to="/register" className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Get Started Free
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Courses', value: '500+' },
          { label: 'Students', value: '10,000+' },
          { label: 'Instructors', value: '100+' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 text-center shadow-sm">
            <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            <p className="text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-white rounded-xl p-8 text-center shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to start learning?</h2>
        <p className="text-gray-600 mb-6">Join thousands of students already learning on LearnHub</p>
        <Link to="/courses" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
          Explore Courses
        </Link>
      </div>
    </div>
  );
};

export default Home;
