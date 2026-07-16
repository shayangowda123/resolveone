import { Navigate, Outlet, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext'

const ROLE_HOME_ROUTES = {
  STUDENT: '/student/dashboard',
  STAFF: '/staff/dashboard',
  CLASS_TEACHER: '/unauthorized',
  HOD: '/management/dashboard',
  DEAN: '/management/dashboard',
  PRINCIPAL: '/management/dashboard',
  ADMIN: '/admin/dashboard',
}

export const getHomeRouteForRole = (role) => {
  return ROLE_HOME_ROUTES[role] || '/unauthorized'
}

export const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    )
  }

  if (
    allowedRoles?.length > 0 &&
    !allowedRoles.includes(user?.role)
  ) {
    return (
      <Navigate
        to={getHomeRouteForRole(user?.role)}
        replace
      />
    )
  }

  return <Outlet />
}

export const PublicOnlyRoute = () => {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <Navigate
        to={getHomeRouteForRole(user?.role)}
        replace
      />
    )
  }

  return <Outlet />
}