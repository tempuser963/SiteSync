import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Permission } from '../types';
import { mockUsers } from '../data/mockUsers';
import { hasPermission as checkPermission, ROLE_LABELS } from '../config/permissions';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  users: User[];
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    department: string;
    role: UserRole;
  }) => Promise<{ success: boolean; error?: string; user?: User }>;
  switchRole: (role: UserRole) => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: Permission) => boolean;
  updateProfile: (data: Partial<User>) => void;
  updateUser: (userId: string, data: Partial<User>) => void;
  deactivateUser: (userId: string) => void;
  resetUserPassword: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_AUTH = 'sitesync_auth';
const STORAGE_KEY_USER = 'sitesync_current_user';
const STORAGE_KEY_USERS = 'sitesync_users';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initialize users list from localStorage or fallback to mockUsers
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USERS);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return mockUsers;
  });

  // Default to Rahul Kumar (Project Planner) for instant enterprise demo richness
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default logged-in user is Rahul Kumar (Project Planner)
    return mockUsers.find((u) => u.email === 'planner@sitesync.ai') || mockUsers[2];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (storedAuth !== null) return storedAuth === 'true';
    } catch {
      // ignore
    }
    return true; // default demo authenticated
  });

  // Sync users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    } catch {
      // ignore
    }
  }, [users]);

  // Sync user & auth state to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } else {
        localStorage.removeItem(STORAGE_KEY_USER);
        localStorage.setItem(STORAGE_KEY_AUTH, 'false');
      }
    } catch {
      // ignore
    }
  }, [user]);

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<{ success: boolean; error?: string }> => {
    // Simulate brief network delay
    await new Promise((resolve) => setTimeout(resolve, 350));

    const foundUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!foundUser) {
      return {
        success: false,
        error: 'Invalid email or password. Please check your credentials and try again.',
      };
    }

    if (foundUser.status === 'Inactive') {
      return {
        success: false,
        error: 'Account inactive. Your account is currently inactive. Please contact an administrator.',
      };
    }

    if (foundUser.password && foundUser.password !== password) {
      return {
        success: false,
        error: 'Invalid email or password. Please check your credentials and try again.',
      };
    }

    const updatedUser = {
      ...foundUser,
      lastActive: 'Just now',
    };

    setUser(updatedUser);
    setIsAuthenticated(true);

    if (rememberMe) {
      localStorage.setItem('sitesync_remember_me', 'true');
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.setItem(STORAGE_KEY_AUTH, 'false');
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    department: string;
    role: UserRole;
  }): Promise<{ success: boolean; error?: string; user?: User }> => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Admin cannot be registered via public registration
    if (userData.role === 'ADMIN') {
      return {
        success: false,
        error: 'Administrator access is provisioned separately by IT Operations.',
      };
    }

    const existing = users.find(
      (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (existing) {
      return {
        success: false,
        error: 'An account with this email address is already registered.',
      };
    }

    const newUser: User = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      role: userData.role,
      department: userData.department.trim(),
      projectIds: ['PRJ-001'],
      status: 'Active',
      lastActive: 'Just now',
    };

    setUsers((prev) => [newUser, ...prev]);
    return { success: true, user: newUser };
  };

  const switchRole = (newRole: UserRole) => {
    // Look for matching demo user with this role first
    const demoUser = users.find((u) => u.role === newRole && u.status === 'Active');

    if (demoUser) {
      setUser(demoUser);
    } else if (user) {
      // Otherwise switch current user's role
      const updated = { ...user, role: newRole };
      setUser(updated);
      setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
    }
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(user.role);
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return checkPermission(user.role, permission);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    setUsers((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
  };

  const updateUser = (userId: string, data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...data };
          if (user && user.id === userId) {
            setUser(updated);
          }
          return updated;
        }
        return u;
      })
    );
  };

  const deactivateUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: 'Inactive' } : u))
    );
  };

  const resetUserPassword = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, password: 'Password@123' } : u))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        users,
        login,
        logout,
        register,
        switchRole,
        hasRole,
        hasPermission,
        updateProfile,
        updateUser,
        deactivateUser,
        resetUserPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
