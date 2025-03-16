import React, { useState, useEffect } from 'react';

const BookingList = () => {
  // Mock data for bookings
  const initialBookings = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@example.com',
      phone: '+1234567890',
      date: '2025-03-17', 
      time: '10:00', 
      service: 'Consultation',
      status: 'confirmed',
      notes: 'First-time client'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      phone: '+1987654321',
      date: '2025-03-18', 
      time: '14:00', 
      service: 'Follow-up',
      status: 'pending',
      notes: 'Requesting same specialist as before'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@example.com',
      phone: '+1122334455',
      date: '2025-03-19', 
      time: '09:00', 
      service: 'Assessment',
      status: 'cancelled',
      notes: 'Client asked to reschedule'
    },
    { 
      id: 4, 
      name: 'Alice Williams', 
      email: 'alice@example.com',
      phone: '+1555666777',
      date: '2025-03-17', 
      time: '13:00', 
      service: 'Consultation',
      status: 'confirmed',
      notes: ''
    },
    { 
      id: 5, 
      name: 'Charlie Brown', 
      email: 'charlie@example.com',
      phone: '+1777888999',
      date: '2025-03-20', 
      time: '11:00', 
      service: 'Follow-up',
      status: 'confirmed',
      notes: 'Requires parking space'
    },
    { 
      id: 6, 
      name: 'Diana Prince', 
      email: 'diana@example.com',
      phone: '+1999000111',
      date: '2025-03-18', 
      time: '16:00', 
      service: 'Assessment',
      status: 'pending',
      notes: 'New client referral'
    },
  ];

  const [bookings, setBookings] = useState(initialBookings);
  const [filteredBookings, setFilteredBookings] = useState(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Effect to filter bookings based on search and status filter
  useEffect(() => {
    let result = bookings;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(booking => 
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.phone.includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    setFilteredBookings(result);
  }, [searchTerm, statusFilter, bookings]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle booking selection for details view
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  // Handle booking status change
  const handleStatusChange = (id, newStatus) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    ));
  };

  // Handle booking deletion
  const handleDeleteBooking = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(bookings.filter(booking => booking.id !== id));
    }
  };

  // Close details modal
  const closeDetailsModal = () => {
    setShowDetailsModal(false);
  };

  // Format date string to more readable format
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Booking Details Modal
  const BookingDetailsModal = ({ booking, onClose }) => {
    if (!booking) return null;
    
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Booking Details</h3>
            <button className="close-button" onClick={onClose}>&times;</button>
          </div>
          <div className="modal-body">
            <div className="detail-row">
              <span className="detail-label">Booking ID:</span>
              <span className="detail-value">{booking.id}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Client Name:</span>
              <span className="detail-value">{booking.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{booking.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{booking.phone}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(booking.date)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{booking.time}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Service:</span>
              <span className="detail-value">{booking.service}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`status-badge ${booking.status}`}>
                {booking.status}
              </span>
            </div>
            {booking.notes && (
              <div className="detail-row">
                <span className="detail-label">Notes:</span>
                <span className="detail-value">{booking.notes}</span>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <div className="status-actions">
              <button 
                className="status-button confirmed"
                onClick={() => {
                  handleStatusChange(booking.id, 'confirmed');
                  onClose();
                }}
              >
                Confirm
              </button>
              <button 
                className="status-button pending"
                onClick={() => {
                  handleStatusChange(booking.id, 'pending');
                  onClose();
                }}
              >
                Set Pending
              </button>
              <button 
                className="status-button cancelled"
                onClick={() => {
                  handleStatusChange(booking.id, 'cancelled');
                  onClose();
                }}
              >
                Cancel
              </button>
            </div>
            <button className="close-modal-button" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bookings-list">
      <h3>Booking Management</h3>
      
      <div className="list-controls">
        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search by name, email or phone" 
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button>🔍</button>
        </div>
        
        <select 
          className="filter-dropdown"
          value={statusFilter}
          onChange={handleStatusFilterChange}
        >
          <option value="all">All Statuses</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Time</th>
            <th>Service</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.name}</td>
                <td>{formatDate(booking.date)}</td>
                <td>{booking.time}</td>
                <td>{booking.service}</td>
                <td>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="action-button view"
                    onClick={() => handleViewBooking(booking)}
                    title="View Details"
                  >
                    👁️
                  </button>
                  <button 
                    className="action-button edit"
                    title="Edit Booking"
                  >
                    ✏️
                  </button>
                  <button 
                    className="action-button delete"
                    onClick={() => handleDeleteBooking(booking.id)}
                    title="Delete Booking"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>No bookings found</td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination */}
      <div className="pagination">
        <button>Previous</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>Next</button>
      </div>
      
      {/* Booking Details Modal */}
      {showDetailsModal && (
        <BookingDetailsModal 
          booking={selectedBooking} 
          onClose={closeDetailsModal} 
        />
      )}
      
      {/* CSS for modal (Since we're adding it inline) */}
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #e.modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
        }
        
        .modal-body {
          padding: 20px;
        }
        
        .detail-row {
          display: flex;
          margin-bottom: 12px;
        }
        
        .detail-label {
          font-weight: 500;
          width: 120px;
          color: #6b7280;
        }
        
        .modal-footer {
          padding: 15px 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: space-between;
        }
        
        .status-actions {
          display: flex;
          gap: 10px;
        }
        
        .status-button {
          padding: 8px 12px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .status-button.confirmed {
          background-color: #d1fae5;
          color: #10b981;
        }
        
        .status-button.pending {
          background-color: #fff3cd;
          color: #f59e0b;
        }
        
        .status-button.cancelled {
          background-color: #fee2e2;
          color: #ef4444;
        }
        
        .close-modal-button {
          background-color: #f3f4f6;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default BookingList;