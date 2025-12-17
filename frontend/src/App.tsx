import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ViewFile from './pages/ViewFile';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';

function App() {
  const { initialize, isAuthenticated } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
        <Route path="/" element={isAuthenticated ? <Layout><Dashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/view-file/:shareId" element={<ViewFile />} />
      </Routes>
    </Router>
  );
}

export default App;
