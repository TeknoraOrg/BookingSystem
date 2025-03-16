import React, { useState, useEffect } from 'react';
import BookingList from './BookingList';
import { Line } from 'recharts';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [period, setPeriod] = useState('week');
  
  // Mock statistics
  const stats = {
    todaysAppointments: 3,
    pendingConfirmations: 2,
    totalBookings: 24,
    revenue: 3600,
    changeToday: '+1 from yesterday',
    changePending: '+2 from yesterday',
    changeTotal: '+15% vs last month',
    changeRevenue: '+8% vs last month',
    cancellations: 1,
    completionRate: 92
  };
  
  // Mock chart data
  const weeklyData = [
    { name: 'Mon', bookings: 4, revenue: 400 },
    { name: 'Tue', bookings: 3, revenue: 300 },
    { name: 'Wed', bookings: 5, revenue: 500 },
    { name: 'Thu', bookings: 2, revenue: 200 },
    { name: 'Fri', bookings: 6, revenue: 600 },
    { name: 'Sat', bookings: 3, revenue: 300 },
    { name: 'Sun', bookings: 1, revenue: 100 }
  ];
  
  const monthlyData = [
    { name: 'Week 1', bookings: 15, revenue: 1500 },
    { name: 'Week 2', bookings: 20, revenue: 2000 },
    { name: 'Week 3', bookings: 25, revenue: 2500 },
    { name: 'Week 4', bookings: 24, revenue: 2400 }
  ];
  
  // Mock recent activity
  const recentActivity = [
    { id: 1, type: 'new_booking', user: 'John Doe', time: '10 minutes ago', details: 'Booked for tomorrow at 14:00' },
    { id: 2, type: 'status_change', user: 'Admin', time: '25 minutes ago', details: 'Confirmed booking #1042' },
    { id: 3, type: 'cancellation', user: 'Jane Smith', time: '1 hour ago', details: 'Cancelled appointment for today' },
    { id: 4, type: 'new_booking', user: 'Robert Johnson', time: '3 hours ago', details: 'Booked for March 20 at 11:30' },
    { id: 5, type: 'status_change', user: 'Admin', time: '4 hours ago', details: 'Rescheduled booking #1039' }
  ];

  const chartData = period === 'week' ? weeklyData : monthlyData;
  
  // Mock function to render chart (placeholder - would use Recharts in real implementation)
  const renderChart = () => {
    return (
      <div className="chart-container">
        <div className="chart-header">
          <h4>Booking Trends</h4>
          <div className="chart-controls">
            <button
              className={period === 'week' ? 'active' : ''}
              onClick={() => setPeriod('week')}
            >
              Week
            </button>
            <button
              className={period === 'month' ? 'active' : ''}
              onClick={() => setPeriod('month')}
            >
              Month
            </button>
          </div>
        </div>
        
        <div className="chart-placeholder">
          {/* This is where a real chart would be rendered */}
          <div className="chart-bars">
            {chartData.map((item, index) => (
              <div key={index} className="chart-bar-group">
                <div 
                  className="chart-bar bookings" 
                  style={{ height: `${item.bookings * 10}px` }}
                  title={`${item.bookings} bookings`}
                ></div>
                <div 
                  className="chart-bar revenue" 
                  style={{ height: `${item.revenue / 20}px` }}
                  title={`$${item.revenue} revenue`}
                ></div>
                <div className="chart-label">{item.name}</div>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <div className="legend-color bookings"></div>
              <div>Bookings</div>
            </div>
            <div className="legend-item">
              <div className="legend-color revenue"></div>
              <div>Revenue</div>
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
        return <span className="activity-icon new">📅</span>;
      case 'status_change':
        return <span className="activity-icon status">✓</span>;
      case 'cancellation':
        return <span className="activity-icon cancel">❌</span>;
      default:
        return <span className="activity-icon">•</span>;
    }
  };
  
  // Render dashboard content
  const renderDashboard = () => {
    return (
      <>
        <div className="stats-container">
          <div className="stat-card">
            <h3>Today's Appointments</h3>
            <p className="stat-value">{stats.todaysAppointments}</p>
            <p className="stat-change">{stats.changeToday}</p>
          </div>
          <div className="stat-card">
            <h3>Pending Confirmations</h3>
            <p className="stat-value">{stats.pendingConfirmations}</p>
            <p className="stat-change">{stats.changePending}</p>
          </div>
          <div className="stat-card">
            <h3>Total Bookings (Month)</h3>
            <p className="stat-value">{stats.totalBookings}</p>
            <p className="stat-change positive">{stats.changeTotal}</p>
          </div>
          <div className="stat-card">
            <h3>Revenue (Month)</h3>
            <p className="stat-value">${stats.revenue}</p>
            <p className="stat-change positive">{stats.changeRevenue}</p>
          </div>
        </div>
        
<div className="dashboard-grid">
  <div className="chart-container">
    {renderChart()}
  </div>
  
  <div className="dashboard-bottom-grid">
    <div className="activity-container">
      <h4>Recent Activity</h4>
      <div className="activity-list">
        {recentActivity.map(activity => (
          <div key={activity.id} className="activity-item">
            {renderActivityIcon(activity.type)}
            <div className="activity-content">
              <div className="activity-header">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-time">{activity.time}</span>
              </div>
              <p className="activity-details">{activity.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    <div className="quick-stats">
      <div className="quick-stat-item">
        <div className="quick-stat-value">{stats.completionRate}%</div>
        <div className="quick-stat-label">Completion Rate</div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${stats.completionRate}%` }}></div>
        </div>
      </div>
      <div className="quick-stat-item">
        <div className="quick-stat-value">{stats.cancellations}</div>
        <div className="quick-stat-label">Cancellations Today</div>
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
        return <BookingList />;
      case 'calendar':
        return <div className="placeholder">Calendar View (To be implemented)</div>;
      case 'settings':
        return <div className="placeholder">Settings Panel (To be implemented)</div>;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-sidebar" style={{ paddingTop: '70px' }}>
  <div className="admin-logo">
    <span className="logo-icon">📊</span>
    <h2>BookAdmin</h2>
  </div>
        <nav className="admin-nav">
          <button 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            <span className="nav-icon">📅</span>
            <span className="nav-text">Bookings</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <span className="nav-icon">📆</span>
            <span className="nav-text">Calendar</span>
          </button>
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </button>
        </nav>
      </div>
      
      <div className="admin-content">
        <header className="admin-header">
          <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
          <div className="admin-actions">
            <div className="admin-search">
              <input type="text" placeholder="Search..." />
              <button className="search-button">🔍</button>
            </div>
            <div className="admin-profile">
              <span className="notification-badge">3</span>
              <div className="profile-avatar">A</div>
              <span className="profile-name">Admin</span>
            </div>
          </div>
        </header>
        
        <main className="admin-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;