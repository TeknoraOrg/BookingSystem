// src/components/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { format, addDays, isSameDay, parseISO } from 'date-fns';
import { BookingService } from '../services/mockApiClient';

const Calendar = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Fetch available dates from API
  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get the start and end dates for the current month view
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 0);
        
        // Format dates for API
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        // Call API to get available dates within the range
        const dates = await BookingService.getAvailableDates(formattedStartDate, formattedEndDate);
        
        setAvailableDates(dates);
      } catch (err) {
        console.error('Error fetching available dates:', err);
        setError('Failed to load available dates. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailableDates();
  }, [currentMonth]); // Refetch when current month changes
  
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    
    if (onSelectDate) {
      // Format the date as ISO string (YYYY-MM-DD) before passing it to the parent
      const formattedDate = date.toISOString().split('T')[0];
      onSelectDate(formattedDate);
    }
  };
  
  const isDateAvailable = (date) => {
    return availableDates.some(availableDate => 
      isSameDay(
        typeof availableDate === 'string' ? parseISO(availableDate) : new Date(availableDate),
        date
      )
    );
  };
  
  // Get month info
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 for Sunday, 1 for Monday, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Generate calendar days
  const generateCalendar = () => {
    const dayElements = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      dayElements.push(
        <div key={`empty-${i}`} className="h-12 w-12"></div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isAvailable = isDateAvailable(date);
      const isToday = isSameDay(date, new Date());
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const isPast = date < new Date();
      
      dayElements.push(
        <button 
          key={`day-${day}`}
          onClick={() => isAvailable && !isPast && handleDateSelect(date)}
          disabled={!isAvailable || isPast || isLoading}
          className={`
            h-12 w-12 rounded-full flex items-center justify-center
            ${isSelected ? 'bg-blue-600 text-white' : ''}
            ${isToday && !isSelected ? 'border-2 border-blue-600 font-bold' : ''}
            ${isAvailable && !isPast && !isSelected ? 'hover:bg-blue-100 border border-blue-300' : ''}
            ${!isAvailable || isPast ? 'text-gray-300 cursor-not-allowed' : ''}
            ${isLoading ? 'opacity-50' : ''}
            focus:outline-none transition-colors
          `}
        >
          {day}
        </button>
      );
    }
    
    return dayElements;
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <h2 className="text-xl font-semibold text-gray-800">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Weekdays header */}
      <div className="grid grid-cols-7 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-lg">
          <div className="w-10 h-10 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="p-4 text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              const fetchAvailableDates = async () => {
                try {
                  setIsLoading(true);
                  const dates = await BookingService.getAvailableDates();
                  setAvailableDates(dates);
                  setIsLoading(false);
                } catch (err) {
                  console.error('Error retrying fetch:', err);
                  setError('Failed to load dates. Please try again later.');
                  setIsLoading(false);
                }
              };
              fetchAvailableDates();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Calendar grid */}
      <div className={`grid grid-cols-7 gap-1 justify-items-center ${isLoading ? 'opacity-50' : ''}`}>
        {generateCalendar()}
      </div>
      
      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 border border-blue-300 mr-2"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-blue-600 mr-2"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;