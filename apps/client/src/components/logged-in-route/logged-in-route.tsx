import { Navigate, Outlet, useLocation } from 'react-router-dom';

const LoggedInRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const isAuthenticated = token === "DumyTokenHere" ? "" : token;
  // Only redirect to dashboard if trying to access auth-related routes
  const authRoutes = ['/auth', '/forgot-password', '/reset-password'];
  
  if (isAuthenticated && authRoutes.includes(location.pathname)) {
    return <Navigate to="/dashboard" state={{ returnUrl: location.pathname }} replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default LoggedInRoute;