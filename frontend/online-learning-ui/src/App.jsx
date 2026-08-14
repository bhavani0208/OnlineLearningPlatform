import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Cart from './pages/Cart';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MyCourses from './pages/student/MyCourses';
import InstructorDashboard from './pages/instructor/Dashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import ManageCourse from './pages/instructor/ManageCourse';
import AdminDashboard from './pages/admin/Dashboard';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="cart" element={<Cart />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* Student protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="my-courses" element={<MyCourses />} />
        </Route>

        {/* Instructor protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin']} />}>
          <Route path="instructor/dashboard" element={<InstructorDashboard />} />
          <Route path="instructor/create-course" element={<CreateCourse />} />
          <Route path="instructor/courses/:id/manage" element={<ManageCourse />} />
        </Route>

        {/* Admin protected routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
