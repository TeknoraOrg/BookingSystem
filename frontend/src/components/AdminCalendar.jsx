// src/components/AdminCalendar.jsx
import React, { useState, useEffect } from 'react';
import { BookingService } from '../services/mockApiClient';

const AdminCalendar = () => {
  // State management
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availabilitySettings, setAvailabilitySettings] = useState({
    mondayToFriday: {
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30, // minutes
      bufferTime: 0, // minutes between appointments
    },
    weekend: {
      enabled: false,
      startTime: '10:00',
      endTime: '15:00',
      slotDuration: 30,
      bufferTime: 0,
    }
  });
  const [customDates, setCustomDates] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [calendarView, setCalendarView] = useState('month'); // 'month', 'week', 'day'
  const [isLoading, setIsLoading] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBlockDateModal, setShowBlockDateModal] = useState(false);
  const [showCustomDateModal, setShowCustomDateModal] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState(null);
  const [availabilityChanged, setAvailabilityChanged] = useState(false);
  
  // Format date as YYYY-MM-DD
  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Load calendar data on component mount
  useEffect(() => {
    const loadCalendarData = async () => {
      setIsLoading(true);
      try {
        // Load availability settings
        const settings = await BookingService.getAvailabilitySettings();
        if (settings) {
          setAvailabilitySettings(settings);
        }
        
        // Load blocked dates
        const blockedDatesData = await BookingService.getBlockedDates();
        setBlockedDates(blockedDatesData || []);
        
        // Load custom date settings
        const customDatesData = await BookingService.getCustomDates();
        setCustomDates(customDatesData || []);
        
        // Load bookings
        const bookingsData = await BookingService.getBookings();
        setBookings(bookingsData || []);
      } catch (error) {
        console.error('Error loading calendar data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCalendarData();
  }, []);

  // Save availability settings
  const saveAvailabilitySettings = async () => {
    setIsLoading(true);
    try {
      await BookingService.updateAvailabilitySettings(availabilitySettings);
      setAvailabilityChanged(false);
      alert('Availability settings saved successfully');
    } catch (error) {
      console.error('Error saving availability settings:', error);
      alert('Failed to save availability settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Add or update a blocked date
  const handleBlockDate = async (date, isBlocked, reason = '') => {
    try {
      if (isBlocked) {
        const blockedDate = {
          date: formatDateForAPI(date),
          reason: reason
        };
        
        await BookingService.addBlockedDate(blockedDate);
        setBlockedDates([...blockedDates, blockedDate]);
      } else {
        await BookingService.removeBlockedDate(formatDateForAPI(date));
        setBlockedDates(blockedDates.filter(bd => bd.date !== formatDateForAPI(date)));
      }
    } catch (error) {
      console.error('Error updating blocked date:', error);
      alert('Failed to update blocked date');
    }
  };

  // Add or update a custom date setting
  const handleCustomDate = async (date, customSettings) => {
    try {
      const customDate = {
        date: formatDateForAPI(date),
        ...customSettings
      };
      
      // Check if this date already has custom settings
      const existingIndex = customDates.findIndex(cd => cd.date === formatDateForAPI(date));
      
      if (existingIndex >= 0) {
        // Update existing custom date
        await BookingService.updateCustomDate(customDate);
        
        const updatedCustomDates = [...customDates];
        updatedCustomDates[existingIndex] = customDate;
        setCustomDates(updatedCustomDates);
      } else {
        // Add new custom date
        await BookingService.addCustomDate(customDate);
        setCustomDates([...customDates, customDate]);
      }
    } catch (error) {
      console.error('Error updating custom date:', error);
      alert('Failed to update custom date settings');
    }
  };

  // Get the days in the month for the selected date
  const getDaysInMonth = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Add empty days to align with the correct day of the week
    const emptyDays = Array(firstDayOfMonth).fill(null);
    
    return [...emptyDays, ...days];
  };

  // Get the days in the week for the selected date
  const getDaysInWeek = () => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    const diff = date.getDate() - day;
    
    const weekStart = new Date(date.setDate(diff));
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  // Get the time slots for a specific day
  const getTimeSlotsForDay = (date) => {
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const dateString = formatDateForAPI(date);
    
    // Check if this is a blocked date
    if (blockedDates.some(bd => bd.date === dateString)) {
      return [];
    }
    
    // Check if this date has custom settings
    const customDate = customDates.find(cd => cd.date === dateString);
    if (customDate) {
      if (!customDate.enabled) {
        return [];
      }
      
      return generateTimeSlots(
        customDate.startTime,
        customDate.endTime,
        customDate.slotDuration,
        customDate.bufferTime
      );
    }
    
    // Use default settings based on weekday/weekend
    const settings = isWeekend ? availabilitySettings.weekend : availabilitySettings.mondayToFriday;
    
    if (!settings.enabled) {
      return [];
    }
    
    return generateTimeSlots(
      settings.startTime,
      settings.endTime,
      settings.slotDuration,
      settings.bufferTime
    );
  };

  // Generate time slots based on start time, end time, duration and buffer
  const generateTimeSlots = (startTime, endTime, duration, buffer) => {
    const slots = [];
    
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    const startDate = new Date();
    startDate.setHours(startHour, startMinute, 0, 0);
    
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);
    
    let currentTime = new Date(startDate);
    
    while (currentTime < endDate) {
      slots.push(formatTime(currentTime));
      
      // Add duration and buffer time
      currentTime.setMinutes(currentTime.getMinutes() + duration + buffer);
    }
    
    return slots;
  };

  // Format time as HH:MM
  const formatTime = (date) => {
    return date.toTimeString().slice(0, 5);
  };

  // Check if a slot is booked
  const isSlotBooked = (date, timeSlot) => {
    const dateString = formatDateForAPI(date);
    return bookings.some(booking => 
      booking.date === dateString && 
      booking.time === timeSlot && 
      booking.status !== 'cancelled'
    );
  };

  // Format date as Month DD, YYYY
  const formatDate = (date) => {
    if (!date) return '';
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  // Handle date click in the calendar
  const handleDateClick = (date) => {
    if (!date) return;
    
    setSelectedDate(date);
    
    if (calendarView === 'month') {
      setCalendarView('day');
    }
  };

  // Open the block date modal
  const openBlockDateModal = (date) => {
    setSelectedDateForModal(date);
    setShowBlockDateModal(true);
  };

  // Open the custom date modal
  const openCustomDateModal = (date) => {
    setSelectedDateForModal(date);
    setShowCustomDateModal(true);
  };

  // Handle changes to availability settings
  const handleAvailabilityChange = (section, field, value) => {
    setAvailabilitySettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setAvailabilityChanged(true);
  };

  // Settings Modal Component
  const SettingsModal = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Availability Settings</h3>
            <button 
              onClick={() => setShowSettingsModal(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Monday to Friday</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="weekday-enabled" 
                    className="w-4 h-4 text-blue-600"
                    checked={availabilitySettings.mondayToFriday.enabled}
                    onChange={(e) => handleAvailabilityChange('mondayToFriday', 'enabled', e.target.checked)}
                  />
                  <label htmlFor="weekday-enabled" className="ml-2 text-gray-700">Enable weekday appointments</label>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={availabilitySettings.mondayToFriday.startTime}
                      onChange={(e) => handleAvailabilityChange('mondayToFriday', 'startTime', e.target.value)}
                      disabled={!availabilitySettings.mondayToFriday.enabled}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={availabilitySettings.mondayToFriday.endTime}
                      onChange={(e) => handleAvailabilityChange('mondayToFriday', 'endTime', e.target.value)}
                      disabled={!availabilitySettings.mondayToFriday.enabled}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Duration (minutes)</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={availabilitySettings.mondayToFriday.slotDuration}
                    onChange={(e) => handleAvailabilityChange('mondayToFriday', 'slotDuration', parseInt(e.target.value))}
                    disabled={!availabilitySettings.mondayToFriday.enabled}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Time (minutes)</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={availabilitySettings.mondayToFriday.bufferTime}
                    onChange={(e) => handleAvailabilityChange('mondayToFriday', 'bufferTime', parseInt(e.target.value))}
                    disabled={!availabilitySettings.mondayToFriday.enabled}
                  >
                    <option value={0}>No buffer</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Weekends (Saturday & Sunday)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="weekend-enabled" 
                    className="w-4 h-4 text-blue-600"
                    checked={availabilitySettings.weekend.enabled}
                    onChange={(e) => handleAvailabilityChange('weekend', 'enabled', e.target.checked)}
                  />
                  <label htmlFor="weekend-enabled" className="ml-2 text-gray-700">Enable weekend appointments</label>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={availabilitySettings.weekend.startTime}
                      onChange={(e) => handleAvailabilityChange('weekend', 'startTime', e.target.value)}
                      disabled={!availabilitySettings.weekend.enabled}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={availabilitySettings.weekend.endTime}
                      onChange={(e) => handleAvailabilityChange('weekend', 'endTime', e.target.value)}
                      disabled={!availabilitySettings.weekend.enabled}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Duration (minutes)</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={availabilitySettings.weekend.slotDuration}
                    onChange={(e) => handleAvailabilityChange('weekend', 'slotDuration', parseInt(e.target.value))}
                    disabled={!availabilitySettings.weekend.enabled}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>2 hours</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Time (minutes)</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={availabilitySettings.weekend.bufferTime}
                    onChange={(e) => handleAvailabilityChange('weekend', 'bufferTime', parseInt(e.target.value))}
                    disabled={!availabilitySettings.weekend.enabled}
                  >
                    <option value={0}>No buffer</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
              onClick={() => setShowSettingsModal(false)}
            >
              Cancel
            </button>
            <button 
              className={`px-4 py-2 rounded-md text-white ${availabilityChanged ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
              onClick={saveAvailabilitySettings}
              disabled={!availabilityChanged || isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Block Date Modal Component
  const BlockDateModal = () => {
    const [blockReason, setBlockReason] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    
    useEffect(() => {
      if (!selectedDateForModal) return;
      
      const dateString = formatDateForAPI(selectedDateForModal);
      const blockedDate = blockedDates.find(bd => bd.date === dateString);
      
      setIsBlocked(!!blockedDate);
      setBlockReason(blockedDate ? blockedDate.reason : '');
    }, [selectedDateForModal]);
    
    const handleSave = () => {
      if (!selectedDateForModal) return;
      
      handleBlockDate(selectedDateForModal, isBlocked, blockReason);
      setShowBlockDateModal(false);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Manage Date Availability</h3>
            <button 
              onClick={() => setShowBlockDateModal(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-800">
                {selectedDateForModal ? formatDate(selectedDateForModal) : ''}
              </h4>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="is-blocked" 
                  className="w-4 h-4 text-blue-600"
                  checked={isBlocked}
                  onChange={(e) => setIsBlocked(e.target.checked)}
                />
                <label htmlFor="is-blocked" className="ml-2 text-gray-700">Block this date (no appointments)</label>
              </div>
            </div>
            
            {isBlocked && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason (optional)</label>
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  value={blockReason}
                  onChange={(e) => setBlockReason(e.target.value)}
                  placeholder="e.g., Holiday, Vacation, Personal Day"
                />
              </div>
            )}
          </div>
          
          <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
              onClick={() => setShowBlockDateModal(false)}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Custom Date Modal Component
  const CustomDateModal = () => {
    const [customDateSettings, setCustomDateSettings] = useState({
      enabled: true,
      startTime: '09:00',
      endTime: '17:00',
      slotDuration: 30,
      bufferTime: 0
    });
    
    useEffect(() => {
      if (!selectedDateForModal) return;
      
      const dateString = formatDateForAPI(selectedDateForModal);
      const customDate = customDates.find(cd => cd.date === dateString);
      
      if (customDate) {
        setCustomDateSettings({
          enabled: customDate.enabled,
          startTime: customDate.startTime,
          endTime: customDate.endTime,
          slotDuration: customDate.slotDuration,
          bufferTime: customDate.bufferTime
        });
      } else {
        // Use default settings based on whether it's a weekday or weekend
        const dayOfWeek = selectedDateForModal.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const defaultSettings = isWeekend ? availabilitySettings.weekend : availabilitySettings.mondayToFriday;
        
        setCustomDateSettings({
          enabled: defaultSettings.enabled,
          startTime: defaultSettings.startTime,
          endTime: defaultSettings.endTime,
          slotDuration: defaultSettings.slotDuration,
          bufferTime: defaultSettings.bufferTime
        });
      }
    }, [selectedDateForModal]);
    
    const handleCustomDateChange = (field, value) => {
      setCustomDateSettings(prev => ({
        ...prev,
        [field]: value
      }));
    };
    
    const handleSave = () => {
      if (!selectedDateForModal) return;
      
      handleCustomDate(selectedDateForModal, customDateSettings);
      setShowCustomDateModal(false);
    };
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
          <div className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center">
            <h3 className="text-xl font-semibold">Custom Date Settings</h3>
            <button 
              onClick={() => setShowCustomDateModal(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <div className="mb-4">
              <h4 className="text-lg font-medium text-gray-800">
                {selectedDateForModal ? formatDate(selectedDateForModal) : ''}
              </h4>
              <p className="text-sm text-gray-500">Customize availability for this specific date</p>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id="custom-enabled" 
                  className="w-4 h-4 text-blue-600"
                  checked={customDateSettings.enabled}
                  onChange={(e) => handleCustomDateChange('enabled', e.target.checked)}
                />
                <label htmlFor="custom-enabled" className="ml-2 text-gray-700">Enable appointments on this date</label>
              </div>
            </div>
            
            {customDateSettings.enabled && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={customDateSettings.startTime}
                      onChange={(e) => handleCustomDateChange('startTime', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input 
                      type="time" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={customDateSettings.endTime}
                      onChange={(e) => handleCustomDateChange('endTime', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Duration</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={customDateSettings.slotDuration}
                      onChange={(e) => handleCustomDateChange('slotDuration', parseInt(e.target.value))}
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                      <option value={90}>90 minutes</option>
                      <option value={120}>2 hours</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Buffer Time</label>
                    <select 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={customDateSettings.bufferTime}
                      onChange={(e) => handleCustomDateChange('bufferTime', parseInt(e.target.value))}
                    >
                      <option value={0}>No buffer</option>
                      <option value={5}>5 minutes</option>
                      <option value={10}>10 minutes</option>
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                    </select>
                  </div>
                </div>
              </>
            )}
</div>
          
          <div className="border-t px-6 py-4 bg-gray-50 flex justify-end">
            <button 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
              onClick={() => setShowCustomDateModal(false)}
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render calendar by view type
  const renderCalendar = () => {
    switch (calendarView) {
      case 'month':
        return renderMonthView();
      case 'week':
        return renderWeekView();
      case 'day':
        return renderDayView();
      default:
        return renderMonthView();
    }
  };

  // Render month view of calendar
  const renderMonthView = () => {
    const days = getDaysInMonth();
    const monthName = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">{monthName}</h3>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 py-2 text-center text-gray-500 text-sm font-medium">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="bg-white p-2 h-24"></div>;
            }
            
            const dateString = formatDateForAPI(day);
            const isToday = new Date().toDateString() === day.toDateString();
            const isBlocked = blockedDates.some(bd => bd.date === dateString);
            const hasCustomSettings = customDates.some(cd => cd.date === dateString);
            const dayBookings = bookings.filter(b => b.date === dateString && b.status !== 'cancelled');
            
            const calendarCellClass = `
              bg-white p-2 h-24 relative cursor-pointer transition-colors duration-150
              ${isToday ? 'bg-blue-50' : ''}
              ${isBlocked ? 'bg-red-50' : ''}
              hover:bg-gray-50
            `;
            
            return (
              <div 
                key={day.toISOString()} 
                className={calendarCellClass}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between">
                  <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : ''}`}>
                    {day.getDate()}
                  </span>
                  <div className="flex space-x-1">
                    {isBlocked && (
                      <span className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full">
                        Blocked
                      </span>
                    )}
                    {hasCustomSettings && (
                      <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
                        Custom
                      </span>
                    )}
                  </div>
                </div>
                
                {dayBookings.length > 0 && (
                  <div className="mt-1">
                    {dayBookings.slice(0, 3).map((booking, i) => (
                      <div 
                        key={i}
                        className="text-xs p-1 mb-1 rounded bg-blue-100 text-blue-800 truncate"
                      >
                        {booking.time} - {booking.name}
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{dayBookings.length - 3} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render week view of calendar
  const renderWeekView = () => {
    const days = getDaysInWeek();
    const weekStart = formatDate(days[0]);
    const weekEnd = formatDate(days[6]);
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">
            {weekStart} - {weekEnd}
          </h3>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map(day => {
            const dateString = formatDateForAPI(day);
            const isToday = new Date().toDateString() === day.toDateString();
            const isBlocked = blockedDates.some(bd => bd.date === dateString);
            const dayName = day.toLocaleString('default', { weekday: 'short' });
            const dayNumber = day.getDate();
            
            return (
              <div key={day.toISOString()} className="bg-white">
                <div 
                  className={`py-2 text-center border-b ${isToday ? 'bg-blue-50' : ''} ${isBlocked ? 'bg-red-50' : ''}`}
                  onClick={() => handleDateClick(day)}
                >
                  <div className="text-sm font-medium">{dayName}</div>
                  <div className={`text-lg ${isToday ? 'text-blue-600 font-bold' : ''}`}>{dayNumber}</div>
                </div>
                
                <div className="p-1">
                  {getTimeSlotsForDay(day).map(timeSlot => {
                    const isBooked = isSlotBooked(day, timeSlot);
                    const booking = isBooked ? 
                      bookings.find(b => b.date === dateString && b.time === timeSlot && b.status !== 'cancelled') : 
                      null;
                    
                    return (
                      <div 
                        key={timeSlot} 
                        className={`
                          text-xs p-1 my-1 rounded ${isBooked ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}
                        `}
                      >
                        {timeSlot}
                        {booking && (
                          <div className="truncate">{booking.name}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render day view of calendar
  const renderDayView = () => {
    const dateString = formatDateForAPI(selectedDate);
    const isBlocked = blockedDates.some(bd => bd.date === dateString);
    const blockedDate = blockedDates.find(bd => bd.date === dateString);
    const customDate = customDates.find(cd => cd.date === dateString);
    const timeSlots = getTimeSlotsForDay(selectedDate);
    
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">
              {formatDate(selectedDate)}
            </h3>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                onClick={() => openBlockDateModal(selectedDate)}
              >
                {isBlocked ? 'Unblock Date' : 'Block Date'}
              </button>
              <button
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors"
                onClick={() => openCustomDateModal(selectedDate)}
              >
                Customize
              </button>
            </div>
          </div>
          
          {isBlocked && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 rounded-md text-sm">
              <span className="font-medium">Blocked:</span> {blockedDate?.reason || 'No appointments available on this date'}
            </div>
          )}
          
          {customDate && (
            <div className="mt-2 p-2 bg-purple-50 text-purple-700 rounded-md text-sm">
              <span className="font-medium">Custom schedule:</span> {customDate.enabled ? 
                `${customDate.startTime} - ${customDate.endTime} (${customDate.slotDuration} min appointments)` : 
                'No appointments on this date'}
            </div>
          )}
        </div>
        
        <div className="p-4">
          {timeSlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeSlots.map(timeSlot => {
                const isBooked = isSlotBooked(selectedDate, timeSlot);
                const booking = isBooked ? 
                  bookings.find(b => b.date === dateString && b.time === timeSlot && b.status !== 'cancelled') : 
                  null;
                
                return (
                  <div 
                    key={timeSlot}
                    className={`
                      p-3 rounded-lg border ${isBooked ? 
                        'bg-blue-50 border-blue-200' : 
                        'bg-gray-50 border-gray-200'
                      }
                    `}
                  >
                    <div className="text-lg font-medium">{timeSlot}</div>
                    {booking ? (
                      <div className="mt-2">
                        <div className="font-medium">{booking.name}</div>
                        <div className="text-sm text-gray-600">{booking.email}</div>
                        <div className="text-sm text-gray-600">{booking.phone}</div>
                        <div className="mt-1 text-sm">
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs
                            ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }
                          `}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 text-gray-500 text-sm">Available</div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {isBlocked ? 
                'This date is blocked for appointments' : 
                'No available time slots on this date'
              }
            </div>
          )}
        </div>
      </div>
    );
  };

  // Navigate to previous month/week/day
  const navigatePrevious = () => {
    const newDate = new Date(selectedDate);
    
    switch (calendarView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
    }
    
    setSelectedDate(newDate);
  };

  // Navigate to next month/week/day
  const navigateNext = () => {
    const newDate = new Date(selectedDate);
    
    switch (calendarView) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
    }
    
    setSelectedDate(newDate);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Calendar Management</h2>
        
        <div className="flex flex-wrap gap-2">
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => setShowSettingsModal(true)}
          >
            Availability Settings
          </button>
          
          <div className="bg-gray-100 rounded-md overflow-hidden flex">
            <button 
              className={`px-4 py-2 ${calendarView === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setCalendarView('month')}
            >
              Month
            </button>
            <button 
              className={`px-4 py-2 ${calendarView === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setCalendarView('week')}
            >
              Week
            </button>
            <button 
              className={`px-4 py-2 ${calendarView === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
              onClick={() => setCalendarView('day')}
            >
              Day
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          onClick={navigatePrevious}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {calendarView === 'month' ? 'Previous Month' : calendarView === 'week' ? 'Previous Week' : 'Previous Day'}
        </button>
        
        <button
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          onClick={() => setSelectedDate(new Date())}
        >
          Today
        </button>
        
        <button 
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
          onClick={navigateNext}
        >
          {calendarView === 'month' ? 'Next Month' : calendarView === 'week' ? 'Next Week' : 'Next Day'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      {renderCalendar()}
      
      {/* Modals */}
      {showSettingsModal && <SettingsModal />}
      {showBlockDateModal && <BlockDateModal />}
      {showCustomDateModal && <CustomDateModal />}
    </div>
  );
};

export default AdminCalendar;