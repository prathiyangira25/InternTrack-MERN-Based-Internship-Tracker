import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Student Components
import StudentDashboard from './components/student/Dashboard';
import SubmitInternship from './components/student/SubmitInternship';
import MyInternships from './components/student/MyInternships';

// Coordinator Components
import CoordinatorDashboard from './components/coordinator/Dashboard';
import InternList from './components/coordinator/InternList';
import VerifyInternship from './components/coordinator/VerifyInternship';
import Reports from './components/coordinator/Reports';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import NotFound from './components/common/NotFound';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [user, setUser] = React.useState(null);

  // Mock login function for now
  const login = (token, userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <div className="app">
      <Header isAuthenticated={isAuthenticated} user={user} logout={logout} />
      <main className="container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login login={login} />} />
          <Route path="/register" element={<Register login={login} />} />
          
          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard user={user} />} />
          <Route path="/student/submit" element={<SubmitInternship user={user} />} />
          <Route path="/student/my-internships" element={<MyInternships user={user} />} />
          
          {/* Coordinator Routes */}
          <Route path="/coordinator/dashboard" element={<CoordinatorDashboard user={user} />} />
          <Route path="/coordinator/internships" element={<InternList user={user} />} />
          <Route path="/coordinator/verify/:id" element={<VerifyInternship user={user} />} />
          <Route path="/coordinator/reports" element={<Reports user={user} />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </div>
  );
}

export default App;