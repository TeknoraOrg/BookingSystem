// src/components/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import BookingList from './BookingList';
import AdminCalendar from './AdminCalendar';
import Settings from './Settings'; // Import the new Settings component
import { Line } from 'recharts';
import { BookingService, DashboardService } from '../services/mockApiClient';
import ThemeToggle from './ThemeToggle';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next'; 
import '../i18n';

const AdminPanel = ({ onViewChange }) => {
  // State for active tab and period selection
  const [activeTab, setActiveTab] = useState('dashboard');
  const [period, setPeriod] = useState('week');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const { t } = useTranslation(); 
  
  // New state for dashboard linking
  const [bookingFilter, setBookingFilter] = useState(null);
  
  // New state for API data
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Add refreshTrigger state to force data refresh
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch data from our mock API client
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch stats data
        const statsData = await DashboardService.getStats();
        setStats(statsData);
        
        // Fetch chart data based on selected period
        const chartData = await DashboardService.getChartData(period);
        setChartData(chartData);
        
        // Fetch recent activity
        const activityData = await DashboardService.getRecentActivity();
        setRecentActivity(activityData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [period, resetSuccess, refreshTrigger]); // Added refreshTrigger to dependencies

  // Function to refresh dashboard data
  const refreshDashboardData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle dashboard card click to navigate to bookings with filters
  const handleDashboardCardClick = (filterType) => {
    setActiveTab('bookings');
    setBookingFilter(filterType);
  };

  // Clear filter when navigating back to dashboard
  const handleTabChange = (tab) => {
    if (tab === 'dashboard') {
      setBookingFilter(null);
      // Refresh dashboard data when returning to dashboard
      refreshDashboardData();
    }
    setActiveTab(tab);
  };

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  
  // Reset data with demo data
  const handleResetData = async () => {
    if (window.confirm('Are you sure you want to reset all data to the initial demo data? This action cannot be undone.')) {
      try {
        setIsResetting(true);
        setError(null);
        
        // Reset data using the API
        await BookingService.resetData('demo');
        
        // Show success message briefly
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 3000);
        
        // Return to dashboard
        setActiveTab('dashboard');
        setBookingFilter(null);
      } catch (err) {
        console.error('Error resetting data:', err);
        setError('Failed to reset data. Please try again later.');
      } finally {
        setIsResetting(false);
      }
    }
  };
  
  // Simplified chart render function for AdminPanel.jsx
  const renderChart = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64">Loading chart data...</div>;
    }
    
    if (error) {
      return <div className="text-red-500 p-4">{error}</div>;
    }
    
    return (
      <div style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }} className="rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-medium">Booking Trends</h4>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-1 rounded-md text-sm ${period === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setPeriod('week')}
            >
              Week
            </button>
            <button
              className={`px-3 py-1 rounded-md text-sm ${period === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              onClick={() => setPeriod('month')}
            >
              Month
            </button>
          </div>
        </div>
        
        <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-end h-64">
            {chartData.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="flex space-x-1 items-end mb-2">
                  <div 
                    className="w-6 bg-blue-600 rounded-t"
                    style={{ height: `${item.bookings * 10}px` }}
                  ></div>
                  <div 
                    className="w-6 bg-blue-300 rounded-t"
                    style={{ height: `${item.revenue / 20}px` }}
                  ></div>
                </div>
                <span style={{ color: 'var(--text-secondary)' }} className="text-xs">{item.name}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-600 rounded mr-1"></div>
              <span style={{ color: 'var(--text-secondary)' }} className="text-xs">Bookings</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-300 rounded mr-1"></div>
              <span style={{ color: 'var(--text-secondary)' }} className="text-xs">Revenue</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render activity icon based on type
  const renderActivityIcon = (type) => {
    switch(type) {
      case 'new_booking':
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'status_change':
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'cancellation':
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };
  
  // Render dashboard content
  const renderDashboard = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-64 rounded-lg shadow p-6" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}>Loading dashboard data...</div>;
    }
    
    if (error) {
      return <div className="rounded-lg shadow p-6 text-red-500" style={{ backgroundColor: 'var(--surface)' }}>{error}</div>;
    }
    
    return (
      <>
        {resetSuccess && (
          <div className="mb-6 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded relative">
            <span className="block sm:inline">Data has been successfully reset to the initial demo data.</span>
          </div>
        )}
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
            onClick={() => handleDashboardCardClick('today')}
          >
            <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">Today's Appointments</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.todaysAppointments}</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{stats.changeToday}</p>
          </div>
          <div 
            className="rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
            onClick={() => handleDashboardCardClick('pending')}
          >
            <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">Pending Confirmations</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.pendingConfirmations}</p>
            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>{stats.changePending}</p>
          </div>
          <div 
            className="rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
            onClick={() => handleDashboardCardClick('all')}
          >
            <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">Total Bookings (Month)</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.totalBookings}</p>
            <p className="text-sm text-green-500 mt-2">{stats.changeTotal}</p>
          </div>
          <div 
            className="rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}
            onClick={() => handleDashboardCardClick('confirmed')}
          >
            <h3 style={{ color: 'var(--text-secondary)' }} className="text-sm font-medium mb-2">Revenue (Month)</h3>
            <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>${stats.revenue}</p>
            <p className="text-sm text-green-500 mt-2">{stats.changeRevenue}</p>
          </div>
        </div>
        
        <div className="rounded-lg shadow mb-6 p-6" style={{ backgroundColor: 'var(--surface)' }}>
          {renderChart()}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-lg shadow p-6" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}>
            <h4 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>Recent Activity</h4>
            {recentActivity.length > 0 ? (
              <div className="space-y-4 max-h-80 overflow-auto">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="flex items-start pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                    {renderActivityIcon(activity.type)}
                    <div className="ml-4">
                      <div className="flex items-center">
                        <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{activity.user}</span>
                        <span className="text-xs ml-2" style={{ color: 'var(--text-secondary)' }}>{activity.time}</span>
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{activity.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)' }}>No recent activity to display.</p>
            )}
          </div>
          
          <div className="rounded-lg shadow p-6" style={{ backgroundColor: 'var(--surface)' }}>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Completion Rate</h5>
                <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.completionRate}%</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.completionRate}%` }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h5 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Cancellations Today</h5>
                <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{stats.cancellations}</span>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(stats.cancellations / (stats.todaysAppointments || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  // Render admin panel content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'bookings':
        return <BookingList 
                 initialFilter={bookingFilter} 
                 onBookingUpdated={refreshDashboardData} // Pass callback to BookingList
               />;
      case 'calendar':
        return <AdminCalendar />;
      case 'settings':
        return <Settings />; // Use the new Settings component
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Sidebar */}
      <div className="w-64 text-white" style={{ backgroundColor: '#1F2937' }}>
        <div className="p-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h2 className="text-xl font-bold">BookAdmin</h2>
        </div>
        
        <nav className="mt-6">
          <button 
            className={`flex items-center px-6 py-3 w-full border-l-4 ${activeTab === 'dashboard' 
              ? 'border-blue-500 text-white' 
              : 'border-transparent text-gray-300 hover:text-white'}`}
            style={{ backgroundColor: '#374151' }}
            onClick={() => handleTabChange('dashboard')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span className="text-inherit">Dashboard</span>
          </button>
          
          <button 
            className={`flex items-center px-6 py-3 w-full border-l-4 ${activeTab === 'bookings' 
              ? 'border-blue-500 text-white' 
              : 'border-transparent text-gray-300 hover:text-white'}`}
            style={{ backgroundColor: '#374151' }}
            onClick={() => handleTabChange('bookings')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-inherit">Bookings</span>
          </button>
          
          <button 
            className={`flex items-center px-6 py-3 w-full border-l-4 ${activeTab === 'calendar' 
              ? 'border-blue-500 text-white' 
              : 'border-transparent text-gray-300 hover:text-white'}`}
            style={{ backgroundColor: '#374151' }}
            onClick={() => handleTabChange('calendar')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-inherit">Calendar</span>
          </button>
          
          <button 
            className={`flex items-center px-6 py-3 w-full border-l-4 ${activeTab === 'settings' 
              ? 'border-blue-500 text-white' 
              : 'border-transparent text-gray-300 hover:text-white'}`}
            style={{ backgroundColor: '#374151' }}
            onClick={() => handleTabChange('settings')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-inherit">Settings</span>
          </button>
        </nav>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="shadow h-16 flex items-center justify-between px-6 relative z-20" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}>
          <h2 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            {bookingFilter && activeTab === 'bookings' && (
              <span className="ml-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                ({bookingFilter === 'today' ? "Today's appointments" : 
                  bookingFilter === 'pending' ? "Pending confirmations" : 
                  bookingFilter === 'confirmed' ? "Confirmed bookings" : "All bookings"})
              </span>
            )}
          </h2>
          
          <div className="flex items-center">
            <LanguageSelector />
            <ThemeToggle />
            <div className="relative">
              <input
                type="text"
                placeholder={t('adminPanel.header.search_placeholder')}
                className="w-64 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ 
                  backgroundColor: 'var(--surface)', 
                  color: 'var(--text-primary)', 
                  borderColor: 'var(--border)' 
                }}
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" style={{ color: 'var(--text-secondary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              </div>
            </div>
            
            {/* Manual Dashboard Refresh Button */}
            <button
              onClick={refreshDashboardData}
              className="ml-4 px-3 py-2 rounded-md text-white flex items-center"
              style={{ backgroundColor: 'var(--accent)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {t('adminPanel.header.buttons.refreshData')}
            </button>
            
            {/* Reset Data Button */}
            <button
              onClick={handleResetData}
              disabled={isResetting}
              className={`ml-4 px-3 py-2 rounded-md text-white flex items-center ${isResetting ? 'opacity-50 cursor-not-allowed' : ''}`}
              style={{ backgroundColor: '#ED8936' }}
            >
               {isResetting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('adminPanel.header.buttons.resetting')}
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {t('adminPanel.header.buttons.resetData')}
                </>
              )}
            </button>
            
            <div className="admin-profile ml-6">
              <div className="relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-1 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center">
                    <span className="font-medium">A</span>
                  </div>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                    {t('adminPanel.header.profile.admin')}
                  </span>
                  <svg className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
              
              {/* Fixed Dropdown Menu */}
              {profileDropdownOpen && (
                <div 
                  className="fixed right-6 mt-2 w-48 rounded shadow-lg z-50"
                  style={{ 
                    top: "3.5rem",
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)'
                  }}
                >
                  <a 
                    href="#" 
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{ color: 'var(--text-primary)' }}
                    onClick={(e) => {
                      e.preventDefault();
                      onViewChange('user');
                    }}
                  >
                    {t('adminPanel.header.profile.dropdown.clientView')}
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('adminPanel.header.profile.dropdown.profileSettings')}
                  </a>
                  <a 
                    href="#" 
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {t('adminPanel.header.profile.dropdown.logout')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6" style={{ backgroundColor: 'var(--background)' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;