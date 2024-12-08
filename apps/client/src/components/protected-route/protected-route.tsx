// ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = () => {
  const location = useLocation();
  const isAuthenticated = localStorage.getItem('token'); // Or your auth check method

  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return (
      <Navigate 
        to="/auth" 
        state={{ returnUrl: location.pathname }}
        replace 
      />
    );
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;