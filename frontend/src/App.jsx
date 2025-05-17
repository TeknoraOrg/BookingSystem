import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import UserBooking from "./components/UserBooking";
import AdminPanel from "./components/AdminPanel";
import DataChoiceModal from "./components/DataChoiceModal";
import { BookingService } from "./services/mockApiClient";
import AppProviders from "./contexts/AppProviders";
import ThemeToggle from "./components/ThemeToggle";
import LanguageSelector from "./components/LanguageSelector";
import "./App.css";

function App() {
  const { t } = useTranslation();
  const [view, setView] = useState('user'); // 'user' or 'admin'
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDataChoiceModal, setShowDataChoiceModal] = useState(false);
  const [initError, setInitError] = useState(null);
  
  // Check if the app is already initialized when it first loads
  useEffect(() => {
    const checkInitialization = async () => {
      try {
        setIsLoading(true);
        const initialized = await BookingService.isInitialized();
        
        if (initialized) {
          setIsInitialized(true);
        } else {
          setShowDataChoiceModal(true);
        }
      } catch (err) {
        console.error("Failed to check initialization:", err);
        setInitError(t('errors.initialization'));
      } finally {
        setIsLoading(false);
      }
    };
    
    checkInitialization();
  }, []);
  
  // Handle data choice selection
  const handleDataChoice = async (choice) => {
    try {
      setIsLoading(true);
      setShowDataChoiceModal(false);
      
      // Initialize with chosen data mode
      await BookingService.initialize(choice);
      
      setIsInitialized(true);
    } catch (err) {
      console.error("Failed to initialize app:", err);
      setInitError(t('errors.initialization'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle view change with potential authentication in a real app
  const handleViewChange = (newView) => {
    // In a real app, we might want to verify authentication before allowing access to admin
    if (newView === 'admin') {
      // Could add authentication check here
      // For now, just change the view
      setView(newView);
    } else {
      setView(newView);
    }
  };
  
  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('common.loading')}</h2>
          <p className="text-gray-500">{t('common.loading')}...</p>
        </div>
      </div>
    );
  }
  
  // Show error screen if initialization failed
  if (initError) {
    return (
      <div className="app-container flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">{t('common.error')}</h2>
          <p className="text-gray-500 mb-4">{initError}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }
  
  // Show data choice modal if needed
  if (showDataChoiceModal) {
    return <DataChoiceModal onChoose={handleDataChoice} />;
  }
  
  return (
    <AppProviders>
      <div className="app-container dark:bg-dark-background dark:text-dark-text">
        {view === 'user' ? (
          <div className="client-container">
            <header className="client-header">
              <h1>{t('app.title')}</h1>
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                <ThemeToggle />
                <div className="view-toggle">
                  <button 
                    className={view === 'user' ? 'active' : ''} 
                    onClick={() => handleViewChange('user')}
                  >
                    {t('app.clientView')}
                  </button>
                  <button 
                    className={view === 'admin' ? 'active' : ''} 
                    onClick={() => handleViewChange('admin')}
                  >
                    {t('app.adminView')}
                  </button>
                </div>
              </div>
            </header>
            
            <UserBooking />
          </div>
        ) : (
          <AdminPanel onViewChange={handleViewChange} />
        )}
      </div>
    </AppProviders>
  );
}

export default App;