import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { BookingService } from '../services/mockApiClient';

// Form validation schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  service: yup.string().required('Please select a service'),
  notes: yup.string()
});

const PersonalDetailsForm = ({ onSubmit, onBack, selectedDate, selectedTime, activeStep, steps, showSteps = false }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [services, setServices] = useState([]);
  
  // Fetch available services from weekly schedule
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // We'll use the weekly schedule to get service types
        const weeklySchedule = await BookingService.getWeeklySchedule();
        
        // Extract unique service types from existing bookings
        const bookings = await BookingService.getBookings();
        const bookingServices = bookings.map(booking => booking.service);
        
        // Combine services from schedule and existing bookings
        const uniqueServices = [
          ...new Set([
            'Consultation', 
            'Follow-up', 
            'Assessment', 
            'Treatment',
            ...bookingServices
          ])
        ];
        
        setServices(uniqueServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        // Fallback to default services if fetch fails
        setServices([
          'Consultation', 
          'Follow-up', 
          'Assessment', 
          'Treatment'
        ]);
      }
    };
    
    fetchServices();
  }, []);
  
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  
  // Handle form submission using the API
  const handleFormSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setApiError(null);
      
      // Prepare data for API
      const bookingData = {
        ...data,
        date: selectedDate.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        time: selectedTime,
        status: 'pending' // Default status for new bookings
      };
      
      // Call the API to create a new booking
      const response = await BookingService.createBooking(bookingData);
      
      // Call the onSubmit callback with the response from the API
      if (onSubmit) {
        onSubmit(response);
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setApiError('An error occurred while creating your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Only show steps if explicitly requested */}
      {showSteps && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 relative">
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full 
                  mx-auto 
                  ${index <= activeStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                <div className="text-xs text-center mt-2">{step}</div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-5 left-1/2 w-full h-0.5
                    ${index < activeStep ? 'bg-blue-600' : 'bg-gray-200'}
                  `}></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Details</h2>
      
      {/* Booking summary */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-gray-700">
          Appointment: <span className="font-semibold">{selectedDate?.toLocaleDateString()}</span> at <span className="font-semibold">{selectedTime}</span>
        </p>
      </div>
      
      {/* API Error Message */}
      {apiError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{apiError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('name')}
            id="name"
            type="text"
            className={`
              w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 transition duration-200
              ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}
            `}
            placeholder="John Doe"
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              {...register('email')}
              id="email"
              type="email"
              className={`
                w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 transition duration-200
                ${errors.email ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}
              `}
              placeholder="your@email.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              {...register('phone')}
              id="phone"
              type="tel"
              className={`
                w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 transition duration-200
                ${errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}
              `}
              placeholder="+1 (123) 456-7890"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Service <span className="text-red-500">*</span>
          </label>
          <select
            {...register('service')}
            id="service"
            className={`
              w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-200 transition duration-200
              ${errors.service ? 'border-red-500' : 'border-gray-300 focus:border-blue-500'}
            `}
            disabled={isSubmitting}
          >
            <option value="">Select a service</option>
            {services.map((service, index) => (
              <option key={index} value={service}>{service}</option>
            ))}
          </select>
          {errors.service && (
            <p className="mt-1 text-sm text-red-600">{errors.service.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500 transition duration-200"
            placeholder="Any specific requirements or information we should know about"
            disabled={isSubmitting}
          ></textarea>
        </div>
        
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
            disabled={isSubmitting}
          >
            Back
          </button>
          
          <button
            type="submit"
            disabled={!isValid || isSubmitting}
            className={`
              px-6 py-2 rounded-lg text-white transition duration-300
              ${isValid && !isSubmitting
                ? 'bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-1 hover:shadow-lg' 
                : 'bg-gray-400 cursor-not-allowed'}
            `}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Booking...
              </div>
            ) : (
              'Confirm Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PersonalDetailsForm;