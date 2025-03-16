// UserBooking.jsx
import { useState } from "react";

function UserBooking() {
  // Mock data for available dates and slots
  const mockAvailableDates = [
    { date: "2025-03-10", dayName: "Monday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
    { date: "2025-03-11", dayName: "Tuesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"] },
    { date: "2025-03-12", dayName: "Wednesday", slots: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
    { date: "2025-03-13", dayName: "Thursday", slots: ["9:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"] },
    { date: "2025-03-14", dayName: "Friday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"] },
    { date: "2025-03-17", dayName: "Monday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
    { date: "2025-03-18", dayName: "Tuesday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"] },
    { date: "2025-03-19", dayName: "Wednesday", slots: ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"] },
    { date: "2025-03-20", dayName: "Thursday", slots: ["9:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"] },
    { date: "2025-03-21", dayName: "Friday", slots: ["9:00 AM", "10:00 AM", "11:00 AM", "3:00 PM", "4:00 PM"] }
  ];

  // State for booking process
  const [step, setStep] = useState(1); // 1: Select Date, 2: Select Time, 3: Details, 4: Confirmation
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: ""
  });
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 2)); // March 2025
  
  // Generate calendar days for the current month
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
      // Create the date object for this day
      const currentDate = new Date(year, month, i);
      const dateString = currentDate.toISOString().split('T')[0];
      
      // Check if this date is available in our mock data
      const availableDate = mockAvailableDates.find(d => d.date === dateString);
      const isAvailable = !!availableDate;
      
      // Check if date is in the past
      const isToday = currentDate.toDateString() === new Date().toDateString();
      const isPast = currentDate < new Date().setHours(0, 0, 0, 0);
      
      days.push({
        day: i,
        date: currentDate,
        dateString,
        isCurrentMonth: true,
        isToday,
        isPast,
        isAvailable
      });
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  
  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const handleDateSelect = (day) => {
    if (!day.isAvailable || day.isPast) return;
    
    setSelectedDate(day.dateString);
    const dateInfo = mockAvailableDates.find(d => d.date === day.dateString);
    setSelectedDateInfo(dateInfo);
    setStep(2);
  };
  
  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(3);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    setStep(4);
    
    // In a real app, this would be an API call
    console.log("Booking saved:", {
      date: selectedDate,
      time: selectedTime,
      ...formData
    });
  };
  
  const handleNewBooking = () => {
    // Reset form
    setStep(1);
    setSelectedDate(null);
    setSelectedDateInfo(null);
    setSelectedTime(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      notes: ""
    });
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="max-w-2xl mx-auto p-5 bg-white rounded-lg shadow-md">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className={`w-1/4 text-center relative ${step >= i ? "text-blue-600" : "text-gray-400"}`}
          >
            <div className={`h-10 w-10 mx-auto rounded-full flex items-center justify-center border-2 ${step >= i ? "border-blue-600 bg-blue-100" : "border-gray-300"}`}>
              {i}
            </div>
            <div className="mt-2 text-sm">
              {i === 1 ? "Select Date" : 
               i === 2 ? "Select Time" : 
               i === 3 ? "Your Details" : "Confirmation"}
            </div>
            {i < 4 && (
              <div className={`absolute top-5 left-1/2 w-full h-0.5 ${step > i ? "bg-blue-600" : "bg-gray-300"}`}></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Step 1: Select Date */}
      {step === 1 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Select a Date</h2>
          
          <div className="calendar mb-6">
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
              {calendarDays.map((day, index) => (
                <div 
                  key={index}
                  className={`
                    h-10 relative flex items-center justify-center text-sm
                    ${!day.day ? '' : 
                      day.isPast ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 
                      !day.isAvailable ? 'text-gray-400 bg-gray-100 cursor-not-allowed' :
                      day.isToday ? 'bg-blue-100 text-blue-800 cursor-pointer' : 
                      'hover:bg-blue-50 cursor-pointer bg-white'}
                    ${day.isCurrentMonth ? '' : 'text-gray-400'}
                    ${day.dateString === selectedDate ? 'bg-blue-500 text-white hover:bg-blue-500' : ''}
                    rounded-full
                  `}
                  onClick={() => day.day && !day.isPast && day.isAvailable && handleDateSelect(day)}
                >
                  {day.day}
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            Select an available date to continue.
          </p>
        </div>
      )}
      
      {/* Step 2: Select Time */}
      {step === 2 && selectedDateInfo && (
        <div>
          <h2 className="text-xl font-bold mb-4">Select a Time</h2>
          <p className="mb-4 text-gray-700">Available times for {formatDate(selectedDate)}:</p>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            {selectedDateInfo.slots.map((time) => (
              <button 
                key={time} 
                className={`p-3 border rounded-lg text-center hover:bg-blue-50 transition ${time === selectedTime ? 'bg-blue-500 text-white hover:bg-blue-500' : 'bg-white'}`}
                onClick={() => handleTimeSelect(time)}
              >
                {time}
              </button>
            ))}
          </div>
          
          <button 
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
            onClick={() => setStep(1)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Date Selection
          </button>
        </div>
      )}
      
      {/* Step 3: Enter Details */}
      {step === 3 && (
        <div>
          <h2 className="text-xl font-bold mb-4">Your Information</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Full Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                Notes (Optional)
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
              />
            </div>
            <div className="flex items-center justify-between">
              <button 
                type="button"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
                onClick={() => setStep(2)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mt-2">Your appointment has been scheduled.</p>
          
          <div className="my-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-700 mb-2">Appointment Details</h3>
            <p className="mb-1"><span className="font-semibold">Date:</span> {formatDate(selectedDate)}</p>
            <p className="mb-1"><span className="font-semibold">Time:</span> {selectedTime}</p>
            <p className="mb-1"><span className="font-semibold">Name:</span> {formData.name}</p>
            <p className="mb-1"><span className="font-semibold">Email:</span> {formData.email}</p>
            <p><span className="font-semibold">Phone:</span> {formData.phone}</p>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">A confirmation email has been sent to your email address.</p>
          
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleNewBooking}
          >
            Book Another Appointment
          </button>
        </div>
      )}
    </div>
  );
}

export default UserBooking;