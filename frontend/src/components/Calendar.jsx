import React, { useState, useEffect } from 'react';

const Calendar = ({ onSelectDate, availableDates = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get days in current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Check if a date is available
  const isDateAvailable = (year, month, day) => {
    const dateToCheck = new Date(year, month, day).toDateString();
    return availableDates.some(date => date.toDateString() === dateToCheck);
  };
  
  // Check if a date is in the past
  const isDateInPast = (year, month, day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(year, month, day);
    return dateToCheck < today;
  };
  
  // Check if a date is today
  const isToday = (year, month, day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };
  
  // Handle date click
  const handleDateClick = (day) => {
    const newDate = new Date(currentYear, currentMonth, day);
    if (isDateInPast(currentYear, currentMonth, day) || !isDateAvailable(currentYear, currentMonth, day)) {
      return;
    }
    setSelectedDate(newDate);
    if (onSelectDate) {
      onSelectDate(newDate);
    }
  };
  
  // If no available dates provided, add some mock dates
  useEffect(() => {
    if (availableDates.length === 0) {
      const today = new Date();
      const mockDates = [];
      // Add dates for the current month
      for (let i = 1; i <= daysInMonth; i++) {
        // Skip weekends and some random dates
        if (new Date(currentYear, currentMonth, i).getDay() !== 0 && 
            new Date(currentYear, currentMonth, i).getDay() !== 6 &&
            i % 3 !== 0) {
          mockDates.push(new Date(currentYear, currentMonth, i));
        }
      }
      
      // Add some dates for next month
      const nextMonth = (currentMonth + 1) % 12;
      const nextMonthYear = nextMonth === 0 ? currentYear + 1 : currentYear;
      const daysInNextMonth = new Date(nextMonthYear, nextMonth + 1, 0).getDate();
      
      for (let i = 1; i <= 10; i++) {
        // Skip weekends
        if (new Date(nextMonthYear, nextMonth, i).getDay() !== 0 && 
            new Date(nextMonthYear, nextMonth, i).getDay() !== 6) {
          mockDates.push(new Date(nextMonthYear, nextMonth, i));
        }
      }
    }
  }, [currentYear, currentMonth, daysInMonth, availableDates.length]);
  
  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="calendar-nav-button" onClick={goToPreviousMonth}>&lt;</button>
        <div className="calendar-month">{monthNames[currentMonth]} {currentYear}</div>
        <button className="calendar-nav-button" onClick={goToNextMonth}>&gt;</button>
      </div>
      
      <table className="calendar-table">
        <thead>
          <tr>
            {dayNames.map(day => (
              <th key={day} className="calendar-day-header">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array(Math.ceil((firstDayOfMonth + daysInMonth) / 7)).fill(null).map((_, weekIndex) => (
            <tr key={`week-${weekIndex}`}>
              {Array(7).fill(null).map((_, dayIndex) => {
                const day = weekIndex * 7 + dayIndex + 1 - firstDayOfMonth;
                const isCurrentMonth = day > 0 && day <= daysInMonth;
                
                if (!isCurrentMonth) {
                  return <td key={`empty-${dayIndex}`} className="calendar-day empty"></td>;
                }
                
                const isAvailable = isDateAvailable(currentYear, currentMonth, day);
                const isPast = isDateInPast(currentYear, currentMonth, day);
                const isSelected = selectedDate && 
                                  day === selectedDate.getDate() && 
                                  currentMonth === selectedDate.getMonth() && 
                                  currentYear === selectedDate.getFullYear();
                const isTodayDate = isToday(currentYear, currentMonth, day);
                
                return (
                  <td 
                    key={`day-${day}`} 
                    className={`calendar-day 
                      ${isSelected ? 'selected' : ''} 
                      ${!isAvailable || isPast ? 'disabled' : ''} 
                      ${isTodayDate ? 'today' : ''} 
                      ${isCurrentMonth ? 'current-month' : ''}`}
                    onClick={() => isCurrentMonth && handleDateClick(day)}
                  >
                    {day}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;