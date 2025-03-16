// Calendar.jsx
import { useState } from "react";

function Calendar({ onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate array of days in month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayIndex = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Array for days
    const days = [];
    
    // Add empty slots for days before the first of the month
    for (let i = 0; i < startingDayIndex; i++) {
      days.push({ day: null, isCurrentMonth: false });
    }
    
    // Add days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      // Check if date is in the past
      const currentDate = new Date(year, month, i);
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const isPast = currentDate < new Date().setHours(0, 0, 0, 0);
      
      days.push({
        day: i,
        date: new Date(year, month, i),
        isCurrentMonth: true,
        isToday,
        isPast
      });
    }
    
    return days;
  };
  
  const days = generateCalendarDays();
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  return (
    <div className="calendar">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-lg font-semibold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <button 
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-medium text-sm py-1 text-gray-600">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div 
            key={index}
            className={`h-10 relative flex items-center justify-center text-sm
              ${!day.day ? '' : 
                day.isPast ? 'text-gray-400 bg-gray-100' : 
                day.isToday ? 'bg-blue-100 text-blue-800' : 'hover:bg-blue-50 cursor-pointer'}
              ${day.isCurrentMonth ? '' : 'text-gray-400'}`}
            onClick={() => {
              if (day.day && !day.isPast) {
                onDateSelect(day.date);
              }
            }}
          >
            {day.day}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Calendar;