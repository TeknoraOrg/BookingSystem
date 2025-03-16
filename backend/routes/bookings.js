// routes/bookings.js
const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ date: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific booking
router.get('/:id', getBooking, (req, res) => {
  res.json(res.booking);
});

// Create a booking
router.post('/', async (req, res) => {
  const booking = new Booking({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    date: req.body.date,
    notes: req.body.notes
  });

  try {
    const newBooking = await booking.save();
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a booking
router.patch('/:id', getBooking, async (req, res) => {
  if (req.body.name != null) {
    res.booking.name = req.body.name;
  }
  if (req.body.email != null) {
    res.booking.email = req.body.email;
  }
  if (req.body.phone != null) {
    res.booking.phone = req.body.phone;
  }
  if (req.body.date != null) {
    res.booking.date = req.body.date;
  }
  if (req.body.status != null) {
    res.booking.status = req.body.status;
  }
  if (req.body.notes != null) {
    res.booking.notes = req.body.notes;
  }

  try {
    const updatedBooking = await res.booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a booking
router.delete('/:id', getBooking, async (req, res) => {
  try {
    await res.booking.remove();
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get booking by ID
async function getBooking(req, res, next) {
  let booking;
  try {
    booking = await Booking.findById(req.params.id);
    if (booking == null) {
      return res.status(404).json({ message: 'Booking not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.booking = booking;
  next();
}

module.exports = router;