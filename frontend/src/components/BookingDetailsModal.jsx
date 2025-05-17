// src/components/BookingDetailsModal.jsx
import React, { useState, useEffect } from 'react';
import { BookingService } from '../services/mockApiClient';

const BookingDetailsModal = ({ bookingId, onClose, onStatusChange, idMapping }) => {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  // Fetch booking details when modal opens
  React.useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!bookingId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const bookingData = await BookingService.getBooking(bookingId);
        setBooking(bookingData);
      } catch (err) {
        console.error('Error fetching booking details:', err);
        setError('Failed to load booking details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  // Handle status change using API
  const handleStatusChange = async (id, newStatus) => {
    try {
      setIsUpdating(true);
      setUpdateError(null);
      
      // Call API to update booking status
      const updatedBooking = await BookingService.updateBooking(id, { status: newStatus });
      
      // Update local state
      setBooking(updatedBooking);
      
      // Notify parent component if needed
      if (onStatusChange) {
        onStatusChange(id, newStatus);
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      setUpdateError(`Failed to update to ${newStatus}. Please try again.`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden">
          <div className="bg-red-600 text-white px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Error</h3>
            <button 
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="px-6 py-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Return null if no booking data
  if (!booking) return null;
  
  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-semibold">Booking Details</h3>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4">
          {updateError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {updateError}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <div className="text-sm text-gray-500">Booking ID</div>
                <div className="font-medium text-lg">#{idMapping?.[booking.id] || '—'}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Client Name</div>
                <div className="font-medium text-lg">{booking.name}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-medium text-lg text-blue-600">{booking.email}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Phone</div>
                <div className="font-medium text-lg">{booking.phone}</div>
              </div>
            </div>
            
            <div className="col-span-2 md:col-span-1">
              <div className="mb-4">
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {booking.date}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Time</div>
                <div className="font-medium text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {booking.time}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Service</div>
                <div className="font-medium text-lg">{booking.service}</div>
              </div>
              
              <div className="mb-4">
                <div className="text-sm text-gray-500">Status</div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {booking.notes && (
            <div className="mt-2 col-span-2 border-t pt-4">
              <div className="text-sm text-gray-500 mb-1">Notes</div>
              <div className="p-3 bg-gray-50 rounded-md text-gray-700">{booking.notes}</div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="border-t px-6 py-4 bg-gray-50 flex flex-wrap gap-2">
          <button 
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            onClick={() => handleStatusChange(booking.id, 'confirmed')}
            disabled={isUpdating || booking.status === 'confirmed'}
          >
            {isUpdating && booking.status !== 'confirmed' ? 'Updating...' : 'Confirm'}
          </button>
          
          <button 
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
            onClick={() => handleStatusChange(booking.id, 'pending')}
            disabled={isUpdating || booking.status === 'pending'}
          >
            {isUpdating && booking.status !== 'pending' ? 'Updating...' : 'Set Pending'}
          </button>
          
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
            onClick={() => handleStatusChange(booking.id, 'cancelled')}
            disabled={isUpdating || booking.status === 'cancelled'}
          >
            {isUpdating && booking.status !== 'cancelled' ? 'Updating...' : 'Cancel'}
          </button>
          
          <div className="flex-grow"></div>
          
          <button 
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
            onClick={onClose}
            disabled={isUpdating}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal;