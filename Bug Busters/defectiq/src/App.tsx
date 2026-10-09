import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './lib/store';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/layout/Header';
import { PublicHomePage } from './pages/PublicHomePage';
import { AboutPage } from './pages/AboutPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveInspectionPage } from './pages/LiveInspectionPage';
import { InspectionsPage } from './pages/InspectionsPage';
import { InspectionDetailPage } from './pages/InspectionDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BatchesPage } from './pages/BatchesPage';
import { BatchDetailPage } from './pages/BatchDetailPage';
import { QualityAnalyticsPage } from './pages/QualityAnalyticsPage';
import { DefectAnalyticsPage } from './pages/DefectAnalyticsPage';
import { AlertsPage } from './pages/AlertsPage';
import { ManualReviewPage } from './pages/ManualReviewPage';
import { ReportsPage } from './pages/ReportsPage';
import { ImageTestPage } from './pages/ImageTestPage';
import { ModelPerformancePage } from './pages/ModelPerformancePage';
import { UsersPage } from './pages/UsersPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpPage } from './pages/HelpPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AlertOctagon, RotateCcw } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { isAuthenticated, currentUser, login } = useApp();

  // Navigation state initialized with pathname or default '/' (Public Home Page)
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Sync browser URL
  const navigate = (path: string) => {
    // If not authenticated and attempting to access protected dashboard routes, redirect to login
    if (!isAuthenticated && path !== '/' && path !== '/home' && path !== '/about' && path !== '/login' && path !== '/register') {
      setCurrentPath('/login');
      window.history.pushState(null, '', '/login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCurrentPath(path);
    window.history.pushState(null, '', path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 1. Standalone Public Pages: Home (Welcome), About, Login, Register
  if (currentPath === '/' || currentPath === '/home') {
    return <PublicHomePage onNavigate={navigate} />;
  }

  if (currentPath === '/about') {
    return <AboutPage onNavigate={navigate} />;
  }

  if (currentPath === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }

  if (currentPath === '/register') {
    return <RegisterPage onNavigate={navigate} />;
  }

  // 2. Authentication guard for console operations
  if (!isAuthenticated) {
    return <LoginPage onNavigate={navigate} />;
  }

  // 3. Operational Console Pages (wrapped in Sidebar and Header)
  const renderCurrentPage = () => {
    if (currentPath === '/dashboard') {
      return <DashboardPage onNavigate={navigate} />;
    }
    if (currentPath === '/inspection/live') {
      return <LiveInspectionPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/inspections/')) {
      const id = currentPath.replace('/inspections/', '');
      return <InspectionDetailPage inspectionId={id} onNavigate={navigate} />;
    }
    if (currentPath === '/inspections') {
      return <InspectionsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/products/')) {
      const id = currentPath.replace('/products/', '');
      return <ProductDetailPage productId={id} onNavigate={navigate} />;
    }
    if (currentPath === '/products') {
      return <ProductsPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/batches/')) {
      const id = currentPath.replace('/batches/', '');
      return <BatchDetailPage batchId={id} onNavigate={navigate} />;
    }
    if (currentPath === '/batches') {
      return <BatchesPage onNavigate={navigate} />;
    }
    if (currentPath === '/analytics') {
      return <QualityAnalyticsPage onNavigate={navigate} />;
    }
    if (currentPath === '/analytics/defects') {
      return <DefectAnalyticsPage onNavigate={navigate} />;
    }
    if (currentPath === '/alerts') {
      return <AlertsPage onNavigate={navigate} />;
    }
    if (currentPath === '/reviews') {
      return <ManualReviewPage onNavigate={navigate} />;
    }
    if (currentPath === '/reports') {
      return <ReportsPage onNavigate={navigate} />;
    }
    if (currentPath === '/test') {
      return <ImageTestPage />;
    }
    if (currentPath === '/model-performance') {
      return <ModelPerformancePage />;
    }
    if (currentPath === '/admin/users') {
      return <UsersPage />;
    }
    if (currentPath === '/admin/audit') {
      return <AuditLogPage />;
    }
    if (currentPath === '/settings') {
      return <SettingsPage />;
    }
    if (currentPath === '/help') {
      return <HelpPage />;
    }

    // Branded 404 Page (Section 23)
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl border border-[#E5EAF2] max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#DC4545] flex items-center justify-center mb-4">
          <AlertOctagon size={28} />
        </div>
        <h2 className="text-xl font-bold text-[#172338]">404 — Operational Route Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
          The requested inspection record or interface route does not exist in the DefectIQ catalog.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-5 px-5 py-2.5 bg-[#4169E1] hover:bg-[#3457C2] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <RotateCcw size={14} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F5F7FB] text-[#172338]">
      {/* Responsive Fixed/Sticky Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={navigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Global 72px Header */}
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Scrollable Main Content Workspace */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
