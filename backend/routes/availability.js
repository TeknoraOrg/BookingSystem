// routes/availability.js
const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');

// Get availability settings
router.get('/', async (req, res) => {
  try {
    // Find or create default availability
    let availability = await Availability.findOne();
    
    if (!availability) {
      // Create default availability if none exists
      const defaultWeeklySchedule = [
        { 
          day: 'Monday', 
          isOpen: true, 
          slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(time => ({ time, isAvailable: true }))
        },
        { 
          day: 'Tuesday', 
          isOpen: true, 
          slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(time => ({ time, isAvailable: true }))
        },
        { 
          day: 'Wednesday', 
          isOpen: true, 
          slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(time => ({ time, isAvailable: true }))
        },
        { 
          day: 'Thursday', 
          isOpen: true, 
          slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(time => ({ time, isAvailable: true }))
        },
        { 
          day: 'Friday', 
          isOpen: true, 
          slots: ['9:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(time => ({ time, isAvailable: true }))
        },
        { day: 'Saturday', isOpen: false, slots: [] },
        { day: 'Sunday', isOpen: false, slots: [] }
      ];
      
      availability = new Availability({
        weeklySchedule: defaultWeeklySchedule,
        specialDates: []
      });
      
      await availability.save();
    }
    
    res.json(availability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update availability settings
router.put('/', async (req, res) => {
  try {
    let availability = await Availability.findOne();
    
    if (!availability) {
      availability = new Availability();
    }
    
    availability.weeklySchedule = req.body.weeklySchedule;
    availability.specialDates = req.body.specialDates;
    
    const updatedAvailability = await availability.save();
    res.json(updatedAvailability);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get available time slots for a specific date
router.get('/slots/:date', async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
    
    const availability = await Availability.findOne();
    
    if (!availability) {
      return res.status(404).json({ message: 'Availability settings not found' });
    }
    
    // Check if there's a special date setting for this date
    const dateString = date.toISOString().split('T')[0];
    const specialDate = availability.specialDates.find(
      sd => new Date(sd.date).toISOString().split('T')[0] === dateString
    );
    
    if (specialDate) {
      if (!specialDate.isOpen) {
        return res.json({ isOpen: false, slots: [] });
      }
      return res.json({ isOpen: true, slots: specialDate.slots });
    }
    
    // Fall back to weekly schedule
    const daySchedule = availability.weeklySchedule.find(ws => ws.day === dayOfWeek);
    
    if (!daySchedule || !daySchedule.isOpen) {
      return res.json({ isOpen: false, slots: [] });
    }
    
    res.json({ isOpen: true, slots: daySchedule.slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;