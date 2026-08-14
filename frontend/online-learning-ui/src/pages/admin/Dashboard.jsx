import { FiUsers, FiBook, FiDollarSign, FiGrid } from 'react-icons/fi';

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Users', value: '0', icon: FiUsers, color: 'blue' },
          { label: 'Total Courses', value: '0', icon: FiBook, color: 'green' },
          { label: 'Total Revenue', value: '₹0', icon: FiDollarSign, color: 'purple' },
          { label: 'Categories', value: '0', icon: FiGrid, color: 'yellow' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600`} size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <p className="text-gray-500 text-center py-8">Admin features coming soon...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
