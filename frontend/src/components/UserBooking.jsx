import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';

const UserBooking = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: null,
    timeSlot: null,
    personalDetails: {
      name: '',
      email: '',
      phone: '',
      service: 'Consultation',
      notes: ''
    }
  });

  // Mock time slots
  const getTimeSlots = (date) => {
    // For demo purposes, let's vary available time slots based on the day of the week
    const dayOfWeek = date ? date.getDay() : 0;
    const baseSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"];
    
    // Remove some slots based on the day to simulate varying availability
    if (dayOfWeek === 1) { // Monday
      return baseSlots.filter((_, index) => index % 2 === 0);
    } else if (dayOfWeek === 5) { // Friday
      return baseSlots.filter(slot => !["11:00", "14:00"].includes(slot));
    } else if (dayOfWeek === 3) { // Wednesday
      return [...baseSlots, "17:00"]; // Add an extra slot on Wednesday
    }
    
    return baseSlots;
  };

  // Mock services
  const services = [
    "Consultation", "Follow-up", "Assessment", "Treatment"
  ];

  // Get time slots based on selected date
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  
  useEffect(() => {
    if (bookingData.date) {
      setAvailableTimeSlots(getTimeSlots(bookingData.date));
    }
  }, [bookingData.date]);

  // Handle date selection from calendar
  const handleDateSelect = (date) => {
    setBookingData({...bookingData, date, timeSlot: null});
    setStep(2);
  };

  // Handle time slot selection
  const handleTimeSelect = (timeSlot) => {
    setBookingData({...bookingData, timeSlot});
    setStep(3);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData({
      ...bookingData, 
      personalDetails: {
        ...bookingData.personalDetails,
        [name]: value
      }
    });
  };

  // Handle form submission
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically submit the booking data to your backend
    // For demo purposes, we'll just move to the confirmation step
    setStep(4);
  };

  // Generate available dates (for mock data)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    // Add dates for next 30 days, excluding weekends
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip some days to simulate unavailable dates
      if (date.getDay() !== 0 && // Skip Sundays
          !(date.getDay() === 6 && i % 2 === 0) && // Skip some Saturdays
          !(i % 7 === 3)) { // Skip every 7th day + 3
        dates.push(date);
      }
    }
    
    return dates;
  };

  // Render steps indicator
  const renderStepsIndicator = () => {
    return (
      <div className="booking-steps">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>Select Date</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>Select Time</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>Your Details</div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>Confirmation</div>
      </div>
    );
  };

  // Render content based on current step
  const renderStepContent = () => {
    switch(step) {
      case 1:
        return (
          <div className="date-selection step-content">
            <h3>Select a Date for Your Appointment</h3>
            <p className="step-description">
              Please select a date from the calendar below. Only available dates are selectable.
            </p>
            <Calendar 
              onSelectDate={handleDateSelect} 
              availableDates={generateAvailableDates()} 
            />
          </div>
        );
      case 2:
        return (
          <div className="time-selection step-content">
            <h3>Select a Time Slot</h3>
            <p className="selected-date">
              Selected date: <strong>{bookingData.date?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </p>
            
            {availableTimeSlots.length > 0 ? (
              <>
                <p className="step-description">
                  Please select a time slot from the options below:
                </p>
                <div className="time-slots-grid">
                  {availableTimeSlots.map((slot, index) => (
                    <button 
                      key={index} 
                      onClick={() => handleTimeSelect(slot)}
                      className={`time-slot-button ${bookingData.timeSlot === slot ? 'selected' : ''}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="no-slots-message">
                <p>No time slots available for this date. Please select another date.</p>
                <button 
                  onClick={() => setStep(1)}
                  className="back-button"
                >
                  Go Back to Calendar
                </button>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="personal-details step-content">
            <h3>Enter Your Details</h3>
            <p className="booking-summary">
              Appointment: <strong>{bookingData.date?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {bookingData.timeSlot}</strong>
            </p>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name <span className="required">*</span></label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={bookingData.personalDetails.name}
                    onChange={handleInputChange}
                    required 
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div className="form-row two-columns">
                <div className="form-group">
                  <label htmlFor="email">Email Address <span className="required">*</span></label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={bookingData.personalDetails.email}
                    onChange={handleInputChange}
                    required 
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={bookingData.personalDetails.phone}
                    onChange={handleInputChange}
                    required 
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="service">Service <span className="required">*</span></label>
                <select 
                  id="service" 
                  name="service"
                  value={bookingData.personalDetails.service}
                  onChange={handleInputChange}
                  required
                >
                  {services.map((service, index) => (
                    <option key={index} value={service}>{service}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea 
                  id="notes" 
                  name="notes"
                  value={bookingData.personalDetails.notes}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Any specific requirements or information we should know about"
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setStep(2)} className="back-button">
                  Back
                </button>
                <button type="submit" className="submit-button">
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        );
      case 4:
        return (
          <div className="confirmation step-content">
            <div className="confirmation-header">
              <div className="confirmation-icon">✓</div>
              <h3>Booking Confirmed!</h3>
            </div>
            <p className="confirmation-message">
              Thank you for your booking, {bookingData.personalDetails.name}. We've sent a confirmation email to {bookingData.personalDetails.email}.
            </p>
            <div className="booking-details">
              <h4>Booking Details</h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <div className="detail-label">Date</div>
                  <div className="detail-value">{bookingData.date?.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Time</div>
                  <div className="detail-value">{bookingData.timeSlot}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Service</div>
                  <div className="detail-value">{bookingData.personalDetails.service}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Name</div>
                  <div className="detail-value">{bookingData.personalDetails.name}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{bookingData.personalDetails.email}</div>
                </div>
                <div className="detail-item">
                  <div className="detail-label">Phone</div>
                  <div className="detail-value">{bookingData.personalDetails.phone}</div>
                </div>
                {bookingData.personalDetails.notes && (
                  <div className="detail-item full-width">
                    <div className="detail-label">Notes</div>
                    <div className="detail-value">{bookingData.personalDetails.notes}</div>
                  </div>
                )}
              </div>
            </div>
            <div className="confirmation-actions">
              <button 
                onClick={() => {
                  setStep(1);
                  setBookingData({
                    date: null,
                    timeSlot: null,
                    personalDetails: {
                      name: '',
                      email: '',
                      phone: '',
                      service: 'Consultation',
                      notes: ''
                    }
                  });
                }}
                className="new-booking-button"
              >
                Make Another Booking
              </button>
            </div>
          </div>
        );
      default:
        return <div>Something went wrong</div>;
    }
  };

  return (
    <div className="user-booking-container-wrapper" style={{ width: '100%', maxWidth: '100%' }}>
      <div className="user-booking-container">
        <h2>Book Your Appointment</h2>
        {renderStepsIndicator()}
        <div className="booking-step-content-wrapper" style={{ width: '100%' }}>
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default UserBooking;