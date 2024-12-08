import { Navigate, Outlet, useLocation } from 'react-router-dom';

const LoggedInRoute = () => {
  const location = useLocation();
  const profile = localStorage.getItem('profile');
  const parsedProfile = profile ? JSON.parse(profile) : null;
  const token = parsedProfile?.token;
  
  const authRoutes = ['/auth', '/forgot-password', '/reset-password'];
  
  if (!!token && authRoutes.includes(location.pathname)) {
    console.log('Redirecting to dashboard');
    return <Navigate to="/dashboard" state={{ returnUrl: location.pathname }} replace />;
  }

  return <Outlet />;
};

export default LoggedInRoute;