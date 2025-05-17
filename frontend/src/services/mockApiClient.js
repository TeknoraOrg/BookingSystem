// src/services/mockApiClient.js
import { v4 as uuidv4 } from 'uuid'; // You'll need to install this: npm install uuid

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Initial test data
const initialData = {
  bookings: [
    { 
      id: '1', 
      name: 'John Doe', 
      email: 'john@example.com',
      phone: '+1234567890',
      date: getTodayString(), // Set to today's date
      time: '10:00', 
      service: 'Consultation',
      status: 'confirmed',
      notes: 'First-time client'
    },
    { 
      id: '2', 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      phone: '+1987654321',
      date: getTodayString(), // Set to today's date
      time: '14:00', 
      service: 'Follow-up',
      status: 'pending',
      notes: 'Requesting same specialist as before'
    },
    { 
      id: '3', 
      name: 'Bob Johnson', 
      email: 'bob@example.com',
      phone: '+1122334455',
      date: getTodayString(), // Set to today's date 
      time: '09:00', 
      service: 'Assessment',
      status: 'cancelled',
      notes: 'Client asked to reschedule'
    },
    { 
      id: '4', 
      name: 'Alice Williams', 
      email: 'alice@example.com',
      phone: '+1555666777',
      date: getTomorrowString(), // Set to tomorrow's date
      time: '13:00', 
      service: 'Consultation',
      status: 'confirmed',
      notes: ''
    },
    { 
      id: '5', 
      name: 'Charlie Brown', 
      email: 'charlie@example.com',
      phone: '+1777888999',
      date: getDateString(2), // 2 days from now
      time: '11:00', 
      service: 'Follow-up',
      status: 'confirmed',
      notes: 'Requires parking space'
    },
    { 
      id: '6', 
      name: 'Diana Prince', 
      email: 'diana@example.com',
      phone: '+1999000111',
      date: getDateString(3), // 3 days from now
      time: '16:00', 
      service: 'Assessment',
      status: 'pending',
      notes: 'New client referral'
    },
  ]
};

// Default availability settings for admin calendar
const defaultAvailabilitySettings = {
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
};

// Default blocked dates for admin calendar
const defaultBlockedDates = [
  {
    date: getDateString(5), // 5 days from now
    reason: "Public Holiday"
  },
  {
    date: getDateString(14), // 14 days from now
    reason: "Staff Training Day"
  }
];

// Default custom date settings for admin calendar
const defaultCustomDates = [
  {
    date: getDateString(7), // 7 days from now
    enabled: true,
    startTime: '08:00',
    endTime: '16:00',
    slotDuration: 45,
    bufferTime: 15
  }
];

// Helper functions for date formatting
function getTodayString() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // Format as YYYY-MM-DD
}

function getTomorrowString() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

function getDateString(daysFromToday) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split('T')[0];
}

// Calculate dashboard stats based on actual booking data
function calculateDashboardStats(bookings) {
  const today = getTodayString();
  const yesterday = getDateString(-1);
  
  // Count bookings by various criteria
  const todaysAppointments = bookings.filter(b => b.date === today && b.status !== 'cancelled').length;
  const yesterdaysAppointments = bookings.filter(b => b.date === yesterday && b.status !== 'cancelled').length;
  const pendingConfirmations = bookings.filter(b => b.status === 'pending').length;
  const yesterdaysPendingConfirmations = bookings.filter(b => b.date === yesterday && b.status === 'pending').length;
  const totalBookings = bookings.length;
  
  // Calculate revenue (assuming each booking is worth $150)
  const revenue = bookings.filter(b => b.status === 'confirmed').length * 150;
  
  // Calculate completion rate
  const completedBookings = bookings.filter(b => 
    b.status === 'confirmed' && 
    new Date(b.date + 'T' + b.time) < new Date()
  ).length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;
  const totalRelevantBookings = completedBookings + cancelledBookings;
  const completionRate = totalRelevantBookings > 0 
    ? Math.round((completedBookings / totalRelevantBookings) * 100) 
    : 100;
  
  // Count today's cancellations
  const cancellationsToday = bookings.filter(b => 
    b.date === today && b.status === 'cancelled'
  ).length;
  
  // Generate change indicators
  const changeToday = `${todaysAppointments > yesterdaysAppointments ? '+' : ''}${todaysAppointments - yesterdaysAppointments} from yesterday`;
  const changePending = `${pendingConfirmations > yesterdaysPendingConfirmations ? '+' : ''}${pendingConfirmations - yesterdaysPendingConfirmations} from yesterday`;
  const changeTotal = '+15% vs last month'; // This would be calculated from real data
  const changeRevenue = '+8% vs last month'; // This would be calculated from real data
  
  return {
    todaysAppointments,
    pendingConfirmations,
    totalBookings,
    revenue,
    changeToday,
    changePending,
    changeTotal,
    changeRevenue,
    cancellations: cancellationsToday,
    completionRate
  };
}

// Generate chart data based on actual booking data
function generateChartData(bookings) {
  // Weekly data
  const weekData = [
    { name: 'Mon', bookings: 0, revenue: 0 },
    { name: 'Tue', bookings: 0, revenue: 0 },
    { name: 'Wed', bookings: 0, revenue: 0 },
    { name: 'Thu', bookings: 0, revenue: 0 },
    { name: 'Fri', bookings: 0, revenue: 0 },
    { name: 'Sat', bookings: 0, revenue: 0 },
    { name: 'Sun', bookings: 0, revenue: 0 }
  ];
  
  // Monthly data
  const monthData = [
    { name: 'Week 1', bookings: 0, revenue: 0 },
    { name: 'Week 2', bookings: 0, revenue: 0 },
    { name: 'Week 3', bookings: 0, revenue: 0 },
    { name: 'Week 4', bookings: 0, revenue: 0 }
  ];
  
  // Populate with some sample data for now
  // In a real app, this would calculate from actual bookings
  weekData[0].bookings = 4; weekData[0].revenue = 400;
  weekData[1].bookings = 3; weekData[1].revenue = 300;
  weekData[2].bookings = 5; weekData[2].revenue = 500;
  weekData[3].bookings = 2; weekData[3].revenue = 200;
  weekData[4].bookings = 6; weekData[4].revenue = 600;
  weekData[5].bookings = 3; weekData[5].revenue = 300;
  weekData[6].bookings = 1; weekData[6].revenue = 100;
  
  monthData[0].bookings = 15; monthData[0].revenue = 1500;
  monthData[1].bookings = 20; monthData[1].revenue = 2000;
  monthData[2].bookings = 25; monthData[2].revenue = 2500;
  monthData[3].bookings = 24; monthData[3].revenue = 2400;
  
  return {
    week: weekData,
    month: monthData
  };
}

// Generate recent activity from bookings
function generateRecentActivity(bookings) {
  // Sort bookings by a hypothetical lastUpdated field (we'll use id for demo)
  const sortedBookings = [...bookings].sort((a, b) => b.id - a.id).slice(0, 5);
  
  return sortedBookings.map((booking, index) => {
    let type, details;
    const timeDescriptions = ['Just now', '10 minutes ago', '25 minutes ago', '1 hour ago', '4 hours ago'];
    
    if (booking.status === 'cancelled') {
      type = 'cancellation';
      details = `Cancelled appointment for ${booking.date}`;
    } else if (booking.status === 'pending') {
      type = 'new_booking';
      details = `Booked for ${booking.date} at ${booking.time}`;
    } else {
      type = 'status_change';
      details = `Confirmed booking #${booking.id}`;
    }
    
    return {
      id: uuidv4(),
      type,
      user: booking.name,
      time: timeDescriptions[index] || 'Recently',
      details
    };
  });
}

// Generate available dates for the next 30 days (excluding some days)
const generateAvailableDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i <= 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    
    // Skip some days to simulate unavailable dates
    if (date.getDay() !== 0 && // Skip Sundays
        !(date.getDay() === 6 && i % 2 === 0) && // Skip some Saturdays
        !(i % 7 === 3)) { // Skip every 7th day + 3
      dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
    }
  }
  
  return dates;
};

// Generate time slots for a given date
const generateTimeSlots = (date) => {
  // Convert date string to Date object if needed
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const dayOfWeek = dateObj.getDay();
  
  // Generate fewer slots on weekends
  const numberOfSlots = dayOfWeek === 0 || dayOfWeek === 6 ? 4 : 8;
  
  const slots = [];
  // Generate slots between 9AM and 5PM
  for (let i = 0; i < numberOfSlots; i++) {
    const hour = 9 + Math.floor(i / 2);
    const minute = (i % 2) === 0 ? '00' : '30';
    
    slots.push({
      id: `${date}-${hour}${minute}`,
      time: `${hour}:${minute}`,
      availableSpots: Math.floor(Math.random() * 3) + 1 // 1-3 spots
    });
  }
  
  return slots;
};

// Check if data was initialized before
const isDataInitialized = () => {
  return localStorage.getItem('bookme_initialized') === 'true';
};

// Mark data as initialized
const markDataAsInitialized = () => {
  localStorage.setItem('bookme_initialized', 'true');
};

// Initialize localStorage with test data
const initializeWithDemoData = () => {
  console.log('Initializing with demo data');
  
  // Store bookings
  localStorage.setItem('bookings', JSON.stringify(initialData.bookings));
  
  // Calculate and store dashboard data
  const dashboard = {
    stats: calculateDashboardStats(initialData.bookings),
    chartData: generateChartData(initialData.bookings),
    recentActivity: generateRecentActivity(initialData.bookings)
  };
  localStorage.setItem('dashboard', JSON.stringify(dashboard));
  
  // Generate and store available dates
  const dates = generateAvailableDates();
  localStorage.setItem('availableDates', JSON.stringify(dates));
  
  // Set weekly schedule
  const defaultWeeklySchedule = [
    { day: "Monday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Tuesday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Wednesday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Thursday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Friday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Saturday", isOpen: false, slots: [] },
    { day: "Sunday", isOpen: false, slots: [] }
  ];
  localStorage.setItem('weeklySchedule', JSON.stringify(defaultWeeklySchedule));
  
  // Set special dates
  const specialDates = [
    { date: "2023-03-17", isOpen: false, reason: "Holiday", slots: [] },
    { date: "2023-03-20", isOpen: true, reason: "Extended Hours", slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"] }
  ];
  localStorage.setItem('specialDates', JSON.stringify(specialDates));
  
  // Initialize calendar settings
  localStorage.setItem('availability_settings', JSON.stringify(defaultAvailabilitySettings));
  localStorage.setItem('blocked_dates', JSON.stringify(defaultBlockedDates));
  localStorage.setItem('custom_dates', JSON.stringify(defaultCustomDates));
  
  markDataAsInitialized();
};

// Initialize localStorage with empty data
const initializeWithCleanData = () => {
  console.log('Initializing with clean data');
  
  // Empty bookings
  const emptyBookings = [];
  localStorage.setItem('bookings', JSON.stringify(emptyBookings));
  
  // Empty dashboard with zero stats
  const emptyDashboard = {
    stats: calculateDashboardStats(emptyBookings),
    chartData: {
      week: [
        { name: 'Mon', bookings: 0, revenue: 0 },
        { name: 'Tue', bookings: 0, revenue: 0 },
        { name: 'Wed', bookings: 0, revenue: 0 },
        { name: 'Thu', bookings: 0, revenue: 0 },
        { name: 'Fri', bookings: 0, revenue: 0 },
        { name: 'Sat', bookings: 0, revenue: 0 },
        { name: 'Sun', bookings: 0, revenue: 0 }
      ],
      month: [
        { name: 'Week 1', bookings: 0, revenue: 0 },
        { name: 'Week 2', bookings: 0, revenue: 0 },
        { name: 'Week 3', bookings: 0, revenue: 0 },
        { name: 'Week 4', bookings: 0, revenue: 0 }
      ]
    },
    recentActivity: []
  };
  localStorage.setItem('dashboard', JSON.stringify(emptyDashboard));
  
  // Generate and store available dates
  const dates = generateAvailableDates();
  localStorage.setItem('availableDates', JSON.stringify(dates));
  
  // Default weekly schedule (all weekdays open)
  const defaultWeeklySchedule = [
    { day: "Monday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Tuesday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Wednesday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Thursday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Friday", isOpen: true, slots: ["9:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"] },
    { day: "Saturday", isOpen: false, slots: [] },
    { day: "Sunday", isOpen: false, slots: [] }
  ];
  localStorage.setItem('weeklySchedule', JSON.stringify(defaultWeeklySchedule));
  
  // Empty special dates
  localStorage.setItem('specialDates', JSON.stringify([]));
  
  // Initialize calendar settings with defaults
  localStorage.setItem('availability_settings', JSON.stringify(defaultAvailabilitySettings));
  localStorage.setItem('blocked_dates', JSON.stringify([]));
  localStorage.setItem('custom_dates', JSON.stringify([]));
  
  markDataAsInitialized();
};

// Clear all data
const clearAllData = () => {
  localStorage.removeItem('bookings');
  localStorage.removeItem('dashboard');
  localStorage.removeItem('availableDates');
  localStorage.removeItem('weeklySchedule');
  localStorage.removeItem('specialDates');
  localStorage.removeItem('availability_settings');
  localStorage.removeItem('blocked_dates');
  localStorage.removeItem('custom_dates');
  localStorage.removeItem('bookme_initialized');
};

// Utility function to update dashboard data
const updateDashboard = (bookings) => {
  const dashboard = {
    stats: calculateDashboardStats(bookings),
    chartData: generateChartData(bookings),
    recentActivity: generateRecentActivity(bookings)
  };
  localStorage.setItem('dashboard', JSON.stringify(dashboard));
  return dashboard;
};

// Booking related API calls
export const BookingService = {
  // Initialize the API
  initialize: async (mode = 'demo') => {
    console.log('API Call: initialize(' + mode + ')');
    clearAllData();
    
    if (mode === 'demo') {
      initializeWithDemoData();
    } else {
      initializeWithCleanData();
    }
    
    await delay(1000); // Simulate a longer initialization
    console.log('API Response: Initialized with ' + mode + ' data');
    return { success: true, mode };
  },
  
  // Check if the API is initialized
  isInitialized: async () => {
    console.log('API Call: isInitialized()');
    const initialized = isDataInitialized();
    console.log('API Response:', initialized);
    return initialized;
  },
  
  // Reset data to initial state
  resetData: async (mode = 'demo') => {
    console.log('API Call: resetData(' + mode + ')');
    return BookingService.initialize(mode);
  },
  
  // Get all bookings
  getBookings: async () => {
    console.log('API Call: getBookings()');
    await delay(300); // Simulate network delay
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    console.log('API Response:', bookings);
    return bookings;
  },
  
  // Get a single booking by ID
  getBooking: async (id) => {
    console.log(`API Call: getBooking(${id})`);
    await delay(200);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const booking = bookings.find(b => b.id === id);
    
    if (!booking) {
      console.error(`API Error: Booking with ID ${id} not found`);
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    console.log('API Response:', booking);
    return booking;
  },
  
  // Create a new booking
  createBooking: async (bookingData) => {
    console.log('API Call: createBooking()', bookingData);
    await delay(500);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    const newBooking = {
      ...bookingData,
      id: uuidv4(), // Generate unique ID
      status: 'pending' // Default status for new bookings
    };
    
    bookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Update dashboard with new booking data
    updateDashboard(bookings);
    
    console.log('API Response (New Booking):', newBooking);
    return newBooking;
  },
  
  // Update an existing booking
  updateBooking: async (id, bookingData) => {
    console.log(`API Call: updateBooking(${id})`, bookingData);
    await delay(400);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) {
      console.error(`API Error: Booking with ID ${id} not found`);
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    bookings[index] = {
      ...bookings[index],
      ...bookingData
    };
    
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Update dashboard with modified booking data
    updateDashboard(bookings);
    
    console.log('API Response (Updated Booking):', bookings[index]);
    return bookings[index];
  },
  
  // Delete a booking
  deleteBooking: async (id) => {
    console.log(`API Call: deleteBooking(${id})`);
    await delay(300);
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    const index = bookings.findIndex(b => b.id === id);
    if (index === -1) {
      console.error(`API Error: Booking with ID ${id} not found`);
      throw new Error(`Booking with ID ${id} not found`);
    }
    
    bookings.splice(index, 1);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    
    // Update dashboard with modified booking data
    updateDashboard(bookings);
    
    console.log('API Response:', true);
    return true;
  },
  
  // Get available time slots for a specific date
  getTimeSlots: async (date) => {
    console.log(`API Call: getTimeSlots(${date})`);
    await delay(200);
    const formattedDate = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const slots = generateTimeSlots(formattedDate);
    console.log('API Response:', slots);
    return slots;
  },
  
  // Get available dates (dates with at least one time slot)
  getAvailableDates: async (startDate, endDate) => {
    console.log(`API Call: getAvailableDates(${startDate}, ${endDate})`);
    await delay(300);
    const availableDates = JSON.parse(localStorage.getItem('availableDates') || '[]');
    
    // Filter dates within range if startDate and endDate are provided
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      const filteredDates = availableDates.filter(date => {
        const current = new Date(date);
        return current >= start && current <= end;
      });
      
      console.log('API Response:', filteredDates);
      return filteredDates;
    }
    
    console.log('API Response:', availableDates);
    return availableDates;
  },
  
  // Get weekly schedule
  getWeeklySchedule: async () => {
    console.log('API Call: getWeeklySchedule()');
    await delay(200);
    const schedule = JSON.parse(localStorage.getItem('weeklySchedule') || '[]');
    console.log('API Response:', schedule);
    return schedule;
  },
  
  // Update weekly schedule
  updateWeeklySchedule: async (newSchedule) => {
    console.log('API Call: updateWeeklySchedule()', newSchedule);
    await delay(400);
    localStorage.setItem('weeklySchedule', JSON.stringify(newSchedule));
    console.log('API Response:', newSchedule);
    return newSchedule;
  },
  
  // Get special dates
  getSpecialDates: async () => {
    console.log('API Call: getSpecialDates()');
    await delay(200);
    const specialDates = JSON.parse(localStorage.getItem('specialDates') || '[]');
    console.log('API Response:', specialDates);
    return specialDates;
  },
  
  // Add a special date
  addSpecialDate: async (specialDate) => {
    console.log('API Call: addSpecialDate()', specialDate);
    await delay(300);
    const specialDates = JSON.parse(localStorage.getItem('specialDates') || '[]');
    specialDates.push(specialDate);
    localStorage.setItem('specialDates', JSON.stringify(specialDates));
    console.log('API Response:', specialDate);
    return specialDate;
  },
  
  // Delete a special date
  deleteSpecialDate: async (date) => {
    console.log(`API Call: deleteSpecialDate(${date})`);
    await delay(200);
    const specialDates = JSON.parse(localStorage.getItem('specialDates') || '[]');
    const newSpecialDates = specialDates.filter(d => d.date !== date);
    localStorage.setItem('specialDates', JSON.stringify(newSpecialDates));
    console.log('API Response:', true);
    return true;
  },
  
  // CALENDAR MANAGEMENT API METHODS
  
  // Get availability settings
  getAvailabilitySettings: async () => {
    console.log('API Call: getAvailabilitySettings()');
    await delay(200);
    try {
      const settings = JSON.parse(localStorage.getItem('availability_settings'));
      console.log('API Response:', settings);
      return settings || defaultAvailabilitySettings;
    } catch (error) {
      console.error('Error getting availability settings:', error);
      return defaultAvailabilitySettings;
    }
  },
  
  // Update availability settings
  updateAvailabilitySettings: async (settings) => {
    console.log('API Call: updateAvailabilitySettings()', settings);
    await delay(300);
    try {
      localStorage.setItem('availability_settings', JSON.stringify(settings));
      console.log('API Response:', settings);
      return settings;
    } catch (error) {
      console.error('Error updating availability settings:', error);
      throw new Error('Failed to update availability settings');
    }
  },
  
  // Get blocked dates
  getBlockedDates: async () => {
    console.log('API Call: getBlockedDates()');
    await delay(200);
    try {
      const blockedDates = JSON.parse(localStorage.getItem('blocked_dates') || '[]');
      console.log('API Response:', blockedDates);
      return blockedDates;
    } catch (error) {
      console.error('Error getting blocked dates:', error);
      return [];
    }
  },
  
  // Add blocked date
  addBlockedDate: async (blockedDate) => {
    console.log('API Call: addBlockedDate()', blockedDate);
    await delay(300);
    try {
      const blockedDates = JSON.parse(localStorage.getItem('blocked_dates') || '[]');
      
      // Check if this date is already blocked
      const existingIndex = blockedDates.findIndex(bd => bd.date === blockedDate.date);
      
      if (existingIndex >= 0) {
        // Update existing blocked date
        blockedDates[existingIndex] = blockedDate;
      } else {
        // Add new blocked date
        blockedDates.push(blockedDate);
      }
      
      localStorage.setItem('blocked_dates', JSON.stringify(blockedDates));
      console.log('API Response:', blockedDate);
      return blockedDate;
    } catch (error) {
      console.error('Error adding blocked date:', error);
      throw new Error('Failed to add blocked date');
    }
  },
  
  // Remove blocked date
  removeBlockedDate: async (date) => {
    console.log(`API Call: removeBlockedDate(${date})`);
    await delay(200);
    try {
      const blockedDates = JSON.parse(localStorage.getItem('blocked_dates') || '[]');
      const updatedBlockedDates = blockedDates.filter(bd => bd.date !== date);
      localStorage.setItem('blocked_dates', JSON.stringify(updatedBlockedDates));
      console.log('API Response: Blocked date removed');
      return { success: true };
    } catch (error) {
      console.error('Error removing blocked date:', error);
      throw new Error('Failed to remove blocked date');
    }
  },
  
  // Get custom dates
  getCustomDates: async () => {
    console.log('API Call: getCustomDates()');
    await delay(200);
    try {
      const customDates = JSON.parse(localStorage.getItem('custom_dates') || '[]');
      console.log('API Response:', customDates);
      return customDates;
    } catch (error) {
      console.error('Error getting custom dates:', error);
      return [];
    }
  },
  
  // Add custom date
  addCustomDate: async (customDate) => {
    console.log('API Call: addCustomDate()', customDate);
    await delay(300);
    try {
      const customDates = JSON.parse(localStorage.getItem('custom_dates') || '[]');
      
      // Check if this date already exists
      const existingIndex = customDates.findIndex(cd => cd.date === customDate.date);
      
      if (existingIndex >= 0) {
        // Update existing custom date
        customDates[existingIndex] = customDate;
      } else {
        // Add new custom date
        customDates.push(customDate);
      }
      
      localStorage.setItem('custom_dates', JSON.stringify(customDates));
      console.log('API Response:', customDate);
      return customDate;
    } catch (error) {
      console.error('Error adding custom date:', error);
      throw new Error('Failed to add custom date');
    }
  },
  
  // Update custom date
  updateCustomDate: async (customDate) => {
    console.log('API Call: updateCustomDate()', customDate);
    await delay(300);
    try {
      const customDates = JSON.parse(localStorage.getItem('custom_dates') || '[]');
      const index = customDates.findIndex(cd => cd.date === customDate.date);
      
      if (index === -1) {
        throw new Error(`Custom date for ${customDate.date} not found`);
      }
      
      customDates[index] = customDate;
      localStorage.setItem('custom_dates', JSON.stringify(customDates));
      console.log('API Response:', customDate);
      return customDate;
    } catch (error) {
      console.error('Error updating custom date:', error);
      throw new Error('Failed to update custom date');
    }
  },
  
  // Remove custom date
  removeCustomDate: async (date) => {
    console.log(`API Call: removeCustomDate(${date})`);
    await delay(200);
    try {
      const customDates = JSON.parse(localStorage.getItem('custom_dates') || '[]');
      const updatedCustomDates = customDates.filter(cd => cd.date !== date);
      localStorage.setItem('custom_dates', JSON.stringify(updatedCustomDates));
      console.log('API Response: Custom date removed');
      return { success: true };
    } catch (error) {
      console.error('Error removing custom date:', error);
      throw new Error('Failed to remove custom date');
    }
  }
};

// Dashboard related API calls
export const DashboardService = {
  // Get statistics for the dashboard
  getStats: async () => {
    console.log('API Call: getStats()');
    await delay(300);
    
    // Get bookings to calculate fresh stats
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const freshStats = calculateDashboardStats(bookings);
    
    // Update stats in the dashboard
    const dashboard = JSON.parse(localStorage.getItem('dashboard') || '{}');
    dashboard.stats = freshStats;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    
    console.log('API Response:', freshStats);
    return freshStats;
  },
  
  // Get chart data (weekly or monthly)
  getChartData: async (period = 'week') => {
    console.log(`API Call: getChartData(${period})`);
    await delay(200);
    const dashboard = JSON.parse(localStorage.getItem('dashboard') || '{}');
    console.log('API Response:', dashboard.chartData?.[period] || []);
    return dashboard.chartData?.[period] || [];
  },
  
  // Get recent activity
  getRecentActivity: async () => {
    console.log('API Call: getRecentActivity()');
    await delay(200);
    
    // Get bookings to generate fresh activity
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const freshActivity = generateRecentActivity(bookings);
    
    // Update activity in the dashboard
    const dashboard = JSON.parse(localStorage.getItem('dashboard') || '{}');
    dashboard.recentActivity = freshActivity;
    localStorage.setItem('dashboard', JSON.stringify(dashboard));
    
    console.log('API Response:', freshActivity);
    return freshActivity;
  },
  
  // Refresh all dashboard data
  refreshDashboard: async () => {
    console.log('API Call: refreshDashboard()');
    await delay(300);
    
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const dashboard = updateDashboard(bookings);
    
    console.log('API Response:', dashboard);
    return dashboard;
  }
};

export default {
  BookingService,
  DashboardService
};