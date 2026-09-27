import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { UserRole, Permission } from '../types';

interface RoleGuardProps {
  children: React.ReactElement;
  allowedRoles?: UserRole[];
  requiredPermission?: Permission;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  requiredPermission,
}) => {
  const { user, hasRole, hasPermission } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          currentRole: user.role,
          requiredRoles: allowedRoles,
          from: location.pathname,
        }}
        replace
      />
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <Navigate
        to="/unauthorized"
        state={{
          currentRole: user.role,
          requiredPermission,
          from: location.pathname,
        }}
        replace
      />
    );
  }

  return children;
};
