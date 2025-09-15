import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Layout } from 'antd';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Home from './pages/Home'; // Assume existing
import PropertyList from './pages/PropertyList'; // Assume existing
import Blog from './pages/Blog'; // Assume existing
import Auth from './components/Auth'; // Assume existing
import ForeclosureListings from './pages/ForeclosureListings'; // New page
import './App.css';

const { Header, Content, Footer } = Layout;

const AdminRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await fetch('/api/admin/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/control-panel/login" />;
};

const App = () => {
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <nav>
            <a href="/">Home</a>
            <a href="/properties">Properties</a>
            <a href="/foreclosures">Foreclosures</a>
            <a href="/blog">Blog</a>
            <a href="/join-buyers">Join Buyers</a>
            <a href="/control-panel/login">Admin</a>
          </nav>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 64 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<PropertyList />} />
            <Route path="/foreclosures" element={<ForeclosureListings />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/join-buyers" element={<Auth />} />
            <Route path="/control-panel/login" element={<AdminLogin />} />
            <Route path="/control-panel/*" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Investor Properties NY ©2024</Footer>
      </Layout>
    </Router>
  );
};

export default App;