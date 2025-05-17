// src/components/TimeSlotSelection.jsx
import React, { useState, useEffect } from 'react';
import { BookingService } from '../services/mockApiClient';

const TimeSlotSelection = ({ onSelectTimeSlot, selectedDate }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch time slots from API when selectedDate changes
  useEffect(() => {
    const fetchTimeSlots = async () => {
      if (!selectedDate) {
        setSlots([]);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Format date for API call
        const formattedDate = selectedDate.toISOString().split('T')[0];
        
        // Get time slots from API
        const timeSlots = await BookingService.getTimeSlots(formattedDate);
        setSlots(timeSlots);
      } catch (err) {
        console.error('Error fetching time slots:', err);
        setError('Failed to load available time slots. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTimeSlots();
  }, [selectedDate]);
  
  // Group time slots by period
  const groupSlots = () => {
    const morningSlots = [];
    const afternoonSlots = [];
    const eveningSlots = [];
    
    slots.forEach(slot => {
      const hour = parseInt(slot.time.split(':')[0]);
      if (hour >= 8 && hour < 12) {
        morningSlots.push(slot);
      } else if (hour >= 12 && hour < 17) {
        afternoonSlots.push(slot);
      } else if (hour >= 17 && hour <= 20) {
        eveningSlots.push(slot);
      }
    });
    
    return { morningSlots, afternoonSlots, eveningSlots };
  };
  
  const { morningSlots, afternoonSlots, eveningSlots } = groupSlots();
  
  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    onSelectTimeSlot(slot.time);
  };
  
  const renderTimeSlots = (slotGroup, title) => (
    <div className="mb-8">
      <h3 className="text-lg font-medium text-gray-700 mb-3">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {slotGroup.map((slot, index) => (
          <div 
            key={slot.id || index}
            onClick={() => handleSlotSelect(slot)}
            className={`
              p-3 rounded-lg border cursor-pointer transition-all duration-200
              text-center relative overflow-hidden
              ${selectedSlot?.id === slot.id 
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' 
                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'}
            `}
          >
            <div className="text-lg font-medium">{slot.time}</div>
            {slot.availableSpots !== undefined && (
              <div className="text-xs text-gray-500 mt-1">
                {slot.availableSpots} {slot.availableSpots === 1 ? 'spot' : 'spots'} left
              </div>
            )}
            
            {/* Selection indicator animation */}
            {selectedSlot?.id === slot.id && (
              <div className="absolute inset-0 opacity-10 bg-blue-400 animate-pulse"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Time</h2>
        
        {selectedDate && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-gray-700">
              Selected date: <span className="font-semibold">{selectedDate.toLocaleDateString()}</span>
            </p>
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading available time slots...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Time</h2>
        
        {selectedDate && (
          <div className="mb-6 p-3 bg-blue-50 rounded-lg text-center">
            <p className="text-gray-700">
              Selected date: <span className="font-semibold">{selectedDate.toLocaleDateString()}</span>
            </p>
          </div>
        )}
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Select a Time</h2>
      
      {selectedDate && (
        <div className="mb-6 p-3 bg-blue-50 rounded-lg text-center">
          <p className="text-gray-700">
            Selected date: <span className="font-semibold">{selectedDate.toLocaleDateString()}</span>
          </p>
        </div>
      )}
      
      {morningSlots.length > 0 && renderTimeSlots(morningSlots, "Morning")}
      {afternoonSlots.length > 0 && renderTimeSlots(afternoonSlots, "Afternoon")}
      {eveningSlots.length > 0 && renderTimeSlots(eveningSlots, "Evening")}
      
      {!morningSlots.length && !afternoonSlots.length && !eveningSlots.length && !isLoading && (
        <div className="text-center py-8">
          <p className="text-gray-500">No time slots available for this date.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors duration-200"
          >
            Go Back to Calendar
          </button>
        </div>
      )}
    </div>
  );
};

export default TimeSlotSelection;