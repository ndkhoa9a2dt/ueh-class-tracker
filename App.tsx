import React, { useState } from 'react';
import { User, Role, ViewState } from './types';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';

function App() {
  console.log("App đã cập nhật v2");
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>('LOGIN');

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === Role.STUDENT) {
      setCurrentView('STUDENT_DASHBOARD');
    } else {
      setCurrentView('ADMIN_DASHBOARD');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('LOGIN');
  };

  const renderContent = () => {
    if (!user) return <Login onLogin={handleLogin} />;

    switch (currentView) {
      case 'STUDENT_DASHBOARD':
        return user.role === Role.STUDENT ? <StudentDashboard user={user} /> : <div>Access Denied</div>;
      case 'STUDENT_PROFILE':
        return user.role === Role.STUDENT ? <StudentProfile user={user} /> : <div>Access Denied</div>;
      case 'ADMIN_DASHBOARD':
        return user.role === Role.ADMIN ? <AdminDashboard /> : <div>Access Denied</div>;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <Layout 
      user={user} 
      onLogout={handleLogout} 
      currentView={currentView}
      onChangeView={(view) => setCurrentView(view)}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;