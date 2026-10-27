import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, AppNotification } from '../types.ts';
import { api } from '../services/api.ts';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  switchRole: (role: UserRole) => Promise<void>;
  login: (email: string) => Promise<void>;
  logout: () => void;
  notifications: AppNotification[];
  refreshNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Quick pre-defined demo users
const DEMO_USERS: Record<UserRole, User> = {
  student: {
    id: 'user-student-1',
    name: 'Harsh Sharma',
    email: 'student@demo.com',
    role: 'student',
    studentId: '2024-CS-042',
    department: 'Computer Science',
    year: '3rd Year',
  },
  staff: {
    id: 'user-staff-1',
    name: 'Ramesh Chef (Kitchen Ops)',
    email: 'staff@demo.com',
    role: 'staff',
  },
  admin: {
    id: 'user-admin-1',
    name: 'Dr. Anita Verma (Admin)',
    email: 'admin@demo.com',
    role: 'admin',
  },
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USERS.student);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const fetchNotifs = async (userRole?: UserRole) => {
    try {
      const data = await api.getNotifications(userRole || user?.role || 'student');
      setNotifications(data);
    } catch (e) {
      console.warn('Failed to fetch notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifs(user?.role);
    const interval = setInterval(() => fetchNotifs(user?.role), 15000);
    return () => clearInterval(interval);
  }, [user?.role]);

  const switchRole = async (targetRole: UserRole) => {
    const demoUser = DEMO_USERS[targetRole];
    setUser(demoUser);
    await fetchNotifs(targetRole);
  };

  const login = async (email: string) => {
    const res = await api.login(email);
    setUser(res.user);
    await fetchNotifs(res.user.role);
  };

  const logout = () => {
    setUser(null);
  };

  const markNotificationAsRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        switchRole,
        login,
        logout,
        notifications,
        refreshNotifications: () => fetchNotifs(user?.role),
        markNotificationAsRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
