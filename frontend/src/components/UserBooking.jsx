// src/components/UserBooking.jsx
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import TimeSlotSelection from './TimeSlotSelection';
import PersonalDetailsForm from './PersonalDetailsForm';
import ConfirmationScreen from './ConfirmationScreen';
import { BookingService } from '../services/mockApiClient';

const UserBooking = () => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: null,
    timeSlot: null,
    personalDetails: {
      name: '',
      email: '',
      phone: '',
      service: '',
      notes: ''
    }
  });
  const [createdBookingId, setCreatedBookingId] = useState(null);
  
  // Steps configuration
  const steps = ["Select Date", "Select Time", "Your Details", "Confirmation"];
  
  // Handle date selection
  const handleDateSelect = (date) => {
    // date now comes formatted as YYYY-MM-DD from Calendar component
    const dateObj = new Date(date);
    setBookingData({...bookingData, date: dateObj, timeSlot: null});
    setStep(2);
  };
  
  // Handle time selection
  const handleTimeSelect = (timeSlot) => {
    setBookingData({...bookingData, timeSlot});
    setStep(3);
  };

  // Handle form submission
  const handleFormSubmit = async (booking) => {
    try {
      // The personal details and booking ID are now returned from the API
      // through the PersonalDetailsForm component
      
      // Save the booking ID for confirmation screen
      setCreatedBookingId(booking.id);
      
      // Update booking data with details from API response
      setBookingData({
        ...bookingData,
        personalDetails: {
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          service: booking.service,
          notes: booking.notes || ''
        }
      });
      
      // Move to confirmation step
      setStep(4);
    } catch (err) {
      console.error("Error handling form submission:", err);
      // Error handling happens in the PersonalDetailsForm component
    }
  };

  // Handle booking another appointment
  const handleBookAnother = () => {
    setStep(1);
    setBookingData({
      date: null,
      timeSlot: null,
      personalDetails: {
        name: '',
        email: '',
        phone: '',
        service: '',
        notes: ''
      }
    });
    setCreatedBookingId(null);
  };

  // Handle modifying the current booking
  const handleModifyBooking = (bookingId) => {
    // In a real app, we might fetch the booking details again here
    // or navigate to a dedicated edit page
    setStep(3); // Go back to personal details
  };

  // Fix the back button functionality 
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Main content based on current step
  const renderMainContent = () => {
    switch(step) {
      case 1:
        return (
          <Calendar onSelectDate={handleDateSelect} />
        );
      case 2:
        return (
          <div>
            <TimeSlotSelection 
              selectedDate={bookingData.date}
              onSelectTimeSlot={handleTimeSelect} 
            />
            <div className="p-4 flex justify-start">
              <button 
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
              >
                Back
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <PersonalDetailsForm 
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            selectedDate={bookingData.date}
            selectedTime={bookingData.timeSlot}
            activeStep={step - 1}
            steps={steps}
            showSteps={false}
          />
        );
      case 4:
        return (
          <ConfirmationScreen 
            bookingId={createdBookingId}
            onMakeAnotherBooking={handleBookAnother}
            onModifyBooking={handleModifyBooking}
          />
        );
      default:
        return (
          <div className="text-center p-8 text-gray-500">
            Something went wrong. Please refresh the page.
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Book Your Appointment</h1>
      
      {/* Progress Steps */}
      <div className="mb-10 relative">
        <div className="flex items-center justify-between mb-4">
          {steps.map((stepName, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full
                text-sm font-medium mb-2
                ${step > index 
                  ? 'bg-blue-600 text-white' 
                  : step === index + 1 
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'}
              `}>
                {index + 1}
              </div>
              <div className="text-xs text-center">{stepName}</div>
            </div>
          ))}
          
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10"></div>
          <div 
            className="absolute top-5 left-0 h-0.5 bg-blue-600 transition-all duration-500 -z-10"
            style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {renderMainContent()}
      </div>
    </div>
  );
};

export default UserBooking;