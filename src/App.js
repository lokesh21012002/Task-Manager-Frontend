import React from 'react';
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PrivateRoute from './config/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import TaskBoard from './pages/TaskBoard';



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<PrivateRoute element={<TaskBoard />} />} />

        </Routes>
      </Router>
    </AuthProvider>
  );

}

export default App;
