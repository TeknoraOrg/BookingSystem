// models/Availability.js
const mongoose = require('mongoose');

const TimeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const WeeklyScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  slots: [TimeSlotSchema]
});

const SpecialDateSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  reason: {
    type: String,
    trim: true
  },
  slots: [TimeSlotSchema]
});

const AvailabilitySchema = new mongoose.Schema({
  weeklySchedule: [WeeklyScheduleSchema],
  specialDates: [SpecialDateSchema]
});

module.exports = mongoose.model('Availability', AvailabilitySchema);