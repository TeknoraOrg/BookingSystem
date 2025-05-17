// ManageSlots.jsx
import { useState, useEffect } from "react";
import { BookingService } from "../services/mockApiClient";

function ManageSlots() {
  // Days of the week 
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // State for weekly schedule and special dates
  const [weeklySchedule, setWeeklySchedule] = useState([]);
  const [specialDates, setSpecialDates] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [isAddingSpecialDate, setIsAddingSpecialDate] = useState(false);
  const [newSpecialDate, setNewSpecialDate] = useState({
    date: "",
    isOpen: true,
    reason: "",
    slots: []
  });
  
  // State for API interactions
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const availableTimeSlots = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00"
  ];
  
  // Fetch availability data from API
  useEffect(() => {
    const fetchAvailabilityData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real app, we would have separate API endpoints for weekly schedule and special dates
        // For this mock, we'll simulate by using the getAvailableDates endpoint
        
        // Get available dates (special dates)
        const dates = await BookingService.getAvailableDates();
        
        // Transform available dates into our format
        // Here we're mocking this transformation as if we got real data from the API
        
        // Hardcoded weekly schedule for now - in a real app would come from API
        const defaultWeeklySchedule = [
          { day: "Monday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
          { day: "Tuesday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
          { day: "Wednesday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
          { day: "Thursday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
          { day: "Friday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
          { day: "Saturday", isOpen: false, slots: [] },
          { day: "Sunday", isOpen: false, slots: [] }
        ];
        
        // Mock special dates
        const mockSpecialDates = [
          { date: "2025-03-17", isOpen: false, reason: "Holiday", slots: [] },
          { date: "2025-03-20", isOpen: true, reason: "Extended Hours", slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"] }
        ];
        
        setWeeklySchedule(defaultWeeklySchedule);
        setSpecialDates(mockSpecialDates);
      } catch (err) {
        console.error('Error fetching availability data:', err);
        setError('Failed to load availability settings. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAvailabilityData();
  }, []);
  
  const toggleDayStatus = (day) => {
    setWeeklySchedule(weeklySchedule.map(d => 
      d.day === day ? { ...d, isOpen: !d.isOpen, slots: d.isOpen ? [] : ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] } : d
    ));
  };
  
  const toggleTimeSlot = (day, time) => {
    setWeeklySchedule(weeklySchedule.map(d => {
      if (d.day === day) {
        if (d.slots.includes(time)) {
          return { ...d, slots: d.slots.filter(t => t !== time) };
        } else {
          return { ...d, slots: [...d.slots, time].sort() };
        }
      }
      return d;
    }));
  };
  
  const deleteSpecialDate = async (date) => {
    try {
      setIsSubmitting(true);
      
      // In a real app, we would call an API endpoint to delete this special date
      // For this mock, we'll just update the state
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSpecialDates(specialDates.filter(d => d.date !== date));
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error deleting special date:', err);
      setError('Failed to delete special date. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNewSpecialDateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSpecialDate({
      ...newSpecialDate,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const addNewSpecialDate = async () => {
    if (!newSpecialDate.date) {
      alert("Please select a date");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // In a real app, we would call an API endpoint to add this special date
      // For this mock, we'll just update the state
      
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setSpecialDates([...specialDates, {
        ...newSpecialDate,
        slots: newSpecialDate.isOpen ? ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] : []
      }]);
      
      setNewSpecialDate({
        date: "",
        isOpen: true,
        reason: "",
        slots: []
      });
      
      setIsAddingSpecialDate(false);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error adding special date:', err);
      setError('Failed to add special date. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleSpecialDateTimeSlot = (date, time) => {
    setSpecialDates(specialDates.map(d => {
      if (d.date === date) {
        if (d.slots.includes(time)) {
          return { ...d, slots: d.slots.filter(t => t !== time) };
        } else {
          return { ...d, slots: [...d.slots, time].sort() };
        }
      }
      return d;
    }));
  };
  
  const saveSettings = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // In a real app, we would call API endpoints to save both weekly schedule and special dates
      // For now, we'll simulate with a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600">Loading availability settings...</p>
      </div>
    );
  }
  
  if (error && !weeklySchedule.length) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button 
            className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Availability</h1>
      
      {/* Success message */}
      {saveSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">Settings saved successfully!</span>
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Weekly Schedule</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeklySchedule.map((day) => (
            <div key={day.day} className="border rounded-lg overflow-hidden">
              <div 
                className={`p-4 flex justify-between items-center ${day.isOpen ? 'bg-blue-50' : 'bg-gray-50'}`}
                onClick={() => setSelectedDay(day.day)}
              >
                <h3 className="font-medium">{day.day}</h3>
                <div className="flex items-center">
                  <span className={`mr-2 text-sm ${day.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                    {day.isOpen ? 'Open' : 'Closed'}
                  </span>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only" 
                      checked={day.isOpen}
                      onChange={() => toggleDayStatus(day.day)}
                      disabled={isSubmitting}
                    />
                    <div className={`w-11 h-6 rounded-full ${day.isOpen ? 'bg-blue-600' : 'bg-gray-300'} transition ${isSubmitting ? 'opacity-50' : ''}`}>
                      <div className={`absolute top-[2px] left-[2px] bg-white w-5 h-5 rounded-full transition-transform ${day.isOpen ? 'translate-x-5' : 'translate-x-0'}`}></div>
                    </div>
                  </label>
                </div>
              </div>
              
              {day.isOpen && (
                <div className="p-4 bg-white">
                  <p className="text-sm text-gray-600 mb-2">Available time slots:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map(time => (
                      <div 
                        key={time} 
                        className={`text-xs p-2 text-center rounded cursor-pointer border ${isSubmitting ? 'opacity-50' : ''} ${day.slots.includes(time) ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
                        onClick={() => !isSubmitting && toggleTimeSlot(day.day, time)}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Special Dates</h2>
          <button 
            className={`px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => setIsAddingSpecialDate(true)}
            disabled={isSubmitting}
          >
            Add Special Date
          </button>
        </div>
        
        {isAddingSpecialDate && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium mb-3">Add Special Date</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  name="date"
                  value={newSpecialDate.date}
                  onChange={handleNewSpecialDateChange}
                  className="w-full p-2 border rounded"
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <input 
                  type="text" 
                  name="reason"
                  value={newSpecialDate.reason}
                  onChange={handleNewSpecialDateChange}
                  placeholder="e.g., Holiday, Special Event"
                  className="w-full p-2 border rounded"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  name="isOpen"
                  checked={newSpecialDate.isOpen}
                  onChange={handleNewSpecialDateChange}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span className="text-sm">Open on this date</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className={`px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => setIsAddingSpecialDate(false)}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className={`px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={addNewSpecialDate}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Adding...' : 'Add Date'}
              </button>
            </div>
          </div>
        )}
        
        {specialDates.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No special dates configured.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialDates.map((special) => (
              <div key={special.date} className="border rounded-lg overflow-hidden">
                <div className={`p-4 ${special.isOpen ? 'bg-blue-50' : 'bg-red-50'}`}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{new Date(special.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                      <p className="text-sm text-gray-600">{special.reason}</p>
                    </div>
                    <div className="flex items-center">
                      <span className={`mr-2 text-sm ${special.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                        {special.isOpen ? 'Open' : 'Closed'}
                      </span>
                      <button 
                        className={`text-red-600 hover:text-red-800 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => !isSubmitting && deleteSpecialDate(special.date)}
                        disabled={isSubmitting}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                {special.isOpen && (
                  <div className="p-4 bg-white">
                    <p className="text-sm text-gray-600 mb-2">Available time slots:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {availableTimeSlots.map(time => (
                        <div 
                          key={time} 
                          className={`text-xs p-2 text-center rounded cursor-pointer border ${isSubmitting ? 'opacity-50' : ''} ${special.slots.includes(time) ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
                          onClick={() => !isSubmitting && toggleSpecialDateTimeSlot(special.date, time)}
                        >
                          {time}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-end">
        <button 
          className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={saveSettings}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

export default ManageSlots;