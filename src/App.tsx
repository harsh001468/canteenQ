import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingView } from './views/LandingView.tsx';
import { StudentDashboard } from './views/StudentDashboard.tsx';
import { StaffDashboard } from './views/StaffDashboard.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { RawJsonReportModal } from './components/RawJsonReportModal.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { api } from './services/api.ts';
import { CrowdPredictionResponse } from './types.ts';

const AppContent: React.FC = () => {
  const { role } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [predictionData, setPredictionData] = useState<CrowdPredictionResponse | null>(null);

  const fetchGlobalPredictions = async () => {
    try {
      const data = await api.getCrowdPredictions();
      setPredictionData(data);
    } catch (e) {
      console.warn('Prediction load warning:', e);
    }
  };

  useEffect(() => {
    fetchGlobalPredictions();
    const interval = setInterval(fetchGlobalPredictions, 15000);
    return () => clearInterval(interval);
  }, []);

  // When role changes, if we are not on landing page, sync to that role's primary view
  const handleSelectTab = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {currentTab === 'landing' && (
          <LandingView
            onStartOrder={() => handleSelectTab('menu')}
            onExploreDemo={() => {
              if (role === 'staff') handleSelectTab('staff-dashboard');
              else if (role === 'admin') handleSelectTab('admin-dashboard');
              else handleSelectTab('dashboard');
            }}
            onOpenReport={() => setIsReportOpen(true)}
            predictionData={predictionData}
          />
        )}

        {/* Student Views */}
        {['dashboard', 'menu', 'orders', 'recommendations'].includes(currentTab) && (
          <StudentDashboard
            activeSubTab={currentTab}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}

        {/* Staff Views */}
        {['staff-dashboard', 'staff-prep', 'staff-waste', 'staff-menu'].includes(currentTab) && (
          <StaffDashboard
            activeSubTab={currentTab}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}

        {/* Admin Views */}
        {['admin-dashboard', 'admin-timetable', 'admin-upload', 'admin-copilot', 'admin-settings'].includes(
          currentTab
        ) && (
          <AdminDashboard
            activeSubTab={currentTab}
            onOpenReport={() => setIsReportOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="text-base">🐱</span>
            <span className="font-bold text-slate-800">CanteenQ</span>
            <span>— Skip the Samosa Stampede.</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>AI Crowd Prediction</span>
            <span>•</span>
            <span>Smart Pickup Slots</span>
            <span>•</span>
            <span>Waste Reduction Buffer</span>
          </div>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <CartDrawer
        onOrderPlaced={() => handleSelectTab('orders')}
        recommendedSlot={predictionData?.best_low_crowd_pickup_slot || '02:00 PM - 02:15 PM'}
      />

      <RawJsonReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        predictionData={predictionData}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
