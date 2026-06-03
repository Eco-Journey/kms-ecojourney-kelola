import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import { Eye, Layout } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState({
    name: 'Budi',
    email: 'budi@example.com',
    role: 'Administrator',
    username: '@budijagobanget'
  });
  const [showDevPanel, setShowDevPanel] = useState(true);

  // Navigation controller
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Mock authentication callbacks
  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('landing');
  };

  const handleUpdateUser = (updatedData) => {
    setUser(updatedData);
  };

  // Page renderer switcher
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'login':
        return (
          <LoginPage 
            onNavigate={navigate} 
            onLoginSuccess={handleLoginSuccess} 
          />
        );
      case 'signup':
        return <SignUpPage onNavigate={navigate} />;
      case 'profile':
        return (
          <ProfilePage 
            user={user} 
            onUpdateUser={handleUpdateUser} 
            onLogout={handleLogout} 
            onNavigate={navigate}
          />
        );
      case 'dashboard':
        return <DashboardPage user={user} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-kms-gray-bg font-sans">
      {/* Shared Adaptive Header */}
      <Header 
        currentPage={currentPage} 
        user={user} 
        onNavigate={navigate} 
      />

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col w-full">
        {renderPage()}
      </main>

      {/* Shared Footer */}
      <Footer />

      {/* ================= FLOATING DEV CONTROLS ================= */}
      {/* Allows developer/reviewers to instantly jump between all mockups */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
        {showDevPanel && (
          <div className="bg-[#1E293B]/95 backdrop-blur-md text-white rounded-[5px] p-4 shadow-2xl border border-slate-700/60 mb-2 w-60 text-left animate-slide-up select-none">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center">
                <Layout className="w-3.5 h-3.5 mr-1 text-kms-green-light" />
                Dev Page Switcher
              </span>
              <button 
                onClick={() => setShowDevPanel(false)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-gray-300 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Hide
              </button>
            </div>
            
            <div className="flex flex-col space-y-1.5">
              {[
                { id: 'landing', label: '1. Landing Page' },
                { id: 'login', label: '2. Login Page' },
                { id: 'signup', label: '3. Sign Up Page' },
                { id: 'dashboard', label: '4. Dashboard Page' },
                { id: 'profile', label: '5. Profile Page' }
              ].map((pg) => (
                <button
                  key={pg.id}
                  onClick={() => navigate(pg.id)}
                  className={`text-left text-xs px-2.5 py-2 rounded-[3px] transition duration-150 cursor-pointer ${
                    currentPage === pg.id 
                      ? 'bg-kms-green-dark text-white font-bold' 
                      : 'hover:bg-slate-800 text-gray-300'
                  }`}
                >
                  {pg.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 mt-3 text-center leading-normal font-normal">
              Gunakan panel ini untuk meninjau masing-masing mockup desain dengan instan.
            </p>
          </div>
        )}

        {/* Toggle Button */}
        {!showDevPanel && (
          <button
            onClick={() => setShowDevPanel(true)}
            className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-full shadow-lg border border-slate-700 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center"
            title="Tampilkan Page Switcher"
          >
            <Eye className="w-5 h-5 text-kms-green-light" />
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
