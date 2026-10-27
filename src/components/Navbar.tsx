import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useCart } from '../context/CartContext.tsx';
import { UserRole } from '../types.ts';
import {
  Bell,
  ShoppingBag,
  Sparkles,
  FileJson,
  User as UserIcon,
  ChevronDown,
  Layers,
  ChefHat,
  ShieldAlert,
  GraduationCap,
  LogOut,
  Flame,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenReport: () => void;
  onOpenLogin: () => void;
}

export const Navbar: React.FC<Props> = ({ currentTab, onSelectTab, onOpenReport, onOpenLogin }) => {
  const { user, role, switchRole, logout, notifications, markNotificationAsRead } = useAuth();
  const { totalCount, setIsCartOpen } = useCart();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleRoleChange = async (targetRole: UserRole) => {
    await switchRole(targetRole);
    setShowRoleDropdown(false);
    onSelectTab('dashboard');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Tagline */}
        <div className="flex items-center space-x-6">
          <div
            onClick={() => onSelectTab('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition transform">
              🐱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Canteen<span className="text-amber-500">Q</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase font-mono">
                  AI v2.6
                </span>
              </div>
              <span className="text-[11px] text-slate-500 block -mt-0.5 font-medium">
                Skip the Samosa Stampede
              </span>
            </div>
          </div>

          {/* Quick Nav Tabs for Current Role */}
          <nav className="hidden md:flex items-center space-x-1">
            {role === 'student' && (
              <>
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'dashboard'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => onSelectTab('menu')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'menu'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Menu & Pre-Order
                </button>
                <button
                  onClick={() => onSelectTab('orders')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'orders'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  My Orders & Passes
                </button>
                <button
                  onClick={() => onSelectTab('recommendations')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'recommendations'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Smart Timetable Advice
                </button>
              </>
            )}

            {role === 'staff' && (
              <>
                <button
                  onClick={() => onSelectTab('staff-dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'staff-dashboard'
                      ? 'bg-amber-50 text-amber-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Live Kitchen Queue
                </button>
                <button
                  onClick={() => onSelectTab('staff-prep')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'staff-prep'
                      ? 'bg-amber-50 text-amber-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Batch Prep Planner
                </button>
                <button
                  onClick={() => onSelectTab('staff-waste')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'staff-waste'
                      ? 'bg-amber-50 text-amber-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Waste Logger
                </button>
                <button
                  onClick={() => onSelectTab('staff-menu')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'staff-menu'
                      ? 'bg-amber-50 text-amber-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Stock Controls
                </button>
              </>
            )}

            {role === 'admin' && (
              <>
                <button
                  onClick={() => onSelectTab('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'admin-dashboard'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Analytics & Heatmap
                </button>
                <button
                  onClick={() => onSelectTab('admin-timetable')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'admin-timetable'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Timetable & Events
                </button>
                <button
                  onClick={() => onSelectTab('admin-upload')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'admin-upload'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Upload CSV & Train
                </button>
                <button
                  onClick={() => onSelectTab('admin-copilot')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    currentTab === 'admin-copilot'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  Gemini Operations AI
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Right Action Icons & Role Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Crowd Mini Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Crowd: <strong className="text-slate-900">68%</strong></span>
            <span className="text-slate-400">|</span>
            <span>Wait: <strong className="text-amber-600">12m</strong></span>
          </div>

          {/* Raw AI Output Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
            title="Inspect PRD JSON Output"
          >
            <FileJson className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">AI JSON</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl relative transition"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Operational Notifications
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {notifications.length} alerts
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto space-y-2 text-xs">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-2.5 rounded-xl transition cursor-pointer border ${
                        n.read
                          ? 'bg-slate-50 border-slate-100 text-slate-500'
                          : 'bg-indigo-50/60 border-indigo-200 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="flex justify-between items-baseline mb-0.5">
                        <span className="font-bold text-slate-900">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart Icon (Student view) */}
          {role === 'student' && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold transition flex items-center gap-1.5"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="bg-indigo-600 text-white text-[11px] font-extrabold px-1.5 py-0.2 rounded-full">
                  {totalCount}
                </span>
              )}
            </button>
          )}

          {/* 1-Click Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition shadow-2xs"
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs ${
                  role === 'admin'
                    ? 'bg-purple-600'
                    : role === 'staff'
                    ? 'bg-amber-600'
                    : 'bg-indigo-600'
                }`}
              >
                {role === 'admin' ? (
                  <ShieldAlert className="w-3.5 h-3.5" />
                ) : role === 'staff' ? (
                  <ChefHat className="w-3.5 h-3.5" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="capitalize hidden sm:inline">{role} View</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Role Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Demo Persona (1-Click)
                </div>

                <button
                  onClick={() => handleRoleChange('student')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition ${
                    role === 'student' ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <div>
                    <div>Student (Harsh S.)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Pre-orders & Pickup Tokens</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('staff')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition ${
                    role === 'staff' ? 'bg-amber-50 text-amber-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <ChefHat className="w-4 h-4 text-amber-600" />
                  <div>
                    <div>Canteen Staff (Ramesh)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Live KDS & Batch Fryer</div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleChange('admin')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition ${
                    role === 'admin' ? 'bg-purple-50 text-purple-900 font-bold' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  <div>
                    <div>Administrator (Dr. Verma)</div>
                    <div className="text-[10px] text-slate-400 font-normal">Analytics, CSV Upload & Events</div>
                  </div>
                </button>

                <div className="border-t border-slate-100 my-1 pt-1">
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      onOpenLogin();
                    }}
                    className="w-full text-left px-3 py-1.5 rounded-xl text-xs text-slate-600 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <UserIcon className="w-3.5 h-3.5" />
                    Custom Account Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
