import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';

// Placeholder Pages
import Home from './pages/Home';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Blog from './pages/Blog';
import ExpressionOfInterest from './pages/ExpressionOfInterest';

// Protected Route Component
function PrivateRoute({ children, requireAdmin }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!currentUser) return <Navigate to="/" />;
  if (requireAdmin && userRole !== 'admin') return <Navigate to="/profile" />;

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-neutral-950 text-white font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/join" element={<ExpressionOfInterest />} />

            {/* Protected Routes */}
            <Route path="/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />

            <Route path="/admin" element={
              <PrivateRoute requireAdmin={true}>
                <Admin />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
