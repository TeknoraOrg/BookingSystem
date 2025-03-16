// ManageSlots.jsx
import { useState } from "react";

function ManageSlots() {
  // Days of the week 
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  // Default schedule with 9am-5pm on weekdays, closed on weekends
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: "Monday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Tuesday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Wednesday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Thursday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Friday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Saturday", isOpen: false, slots: [] },
    { day: "Sunday", isOpen: false, slots: [] }
  ]);
  
  // Special dates (holidays, custom hours)
  const [specialDates, setSpecialDates] = useState([
    { date: "2025-03-17", isOpen: false, reason: "Holiday", slots: [] },
    { date: "2025-03-20", isOpen: true, reason: "Extended Hours", slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"] }
  ]);
  
  const [selectedDay, setSelectedDay] = useState(null);
  const [isAddingSpecialDate, setIsAddingSpecialDate] = useState(false);
  const [newSpecialDate, setNewSpecialDate] = useState({
    date: "",
    isOpen: true,
    reason: "",
    slots: []
  });
  
  const availableTimeSlots = [
    "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", 
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    "18:00"
  ];
  
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
  
  const deleteSpecialDate = (date) => {
    setSpecialDates(specialDates.filter(d => d.date !== date));
  };
  
  const handleNewSpecialDateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSpecialDate({
      ...newSpecialDate,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const addNewSpecialDate = () => {
    if (!newSpecialDate.date) {
      alert("Please select a date");
      return;
    }
    
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
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Availability</h1>
      
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
                // ManageSlots.jsx (continued)
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
                    />
                    <div className={`w-11 h-6 rounded-full ${day.isOpen ? 'bg-blue-600' : 'bg-gray-300'} transition`}>
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
                        className={`text-xs p-2 text-center rounded cursor-pointer border ${day.slots.includes(time) ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
                        onClick={() => toggleTimeSlot(day.day, time)}
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
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setIsAddingSpecialDate(true)}
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
                />
                <span className="text-sm">Open on this date</span>
              </label>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setIsAddingSpecialDate(false)}
              >
                Cancel
              </button>
              <button 
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={addNewSpecialDate}
              >
                Add Date
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
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteSpecialDate(special.date)}
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
                          className={`text-xs p-2 text-center rounded cursor-pointer border ${special.slots.includes(time) ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
                          onClick={() => toggleSpecialDateTimeSlot(special.date, time)}
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
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => alert("Settings saved successfully!")}
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}

export default ManageSlots;