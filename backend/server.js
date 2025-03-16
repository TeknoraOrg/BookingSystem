const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432
});

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to PostgreSQL");
    release();
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Booking API is running...");
});

// Booking Routes
app.get("/api/bookings", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings ORDER BY date ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/bookings/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM bookings WHERE id = $1", [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.post("/api/bookings", async (req, res) => {
  const { name, email, phone, date, notes } = req.body;
  
  try {
    const result = await pool.query(
      "INSERT INTO bookings (name, email, phone, date, notes, status) VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING *",
      [name, email, phone, date, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.patch("/api/bookings/:id", async (req, res) => {
  const { name, email, phone, date, notes, status } = req.body;
  const id = req.params.id;
  
  try {
    // First check if the booking exists
    const checkResult = await pool.query("SELECT * FROM bookings WHERE id = $1", [id]);
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    // Prepare update fields based on what was provided
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (email !== undefined) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    
    if (phone !== undefined) {
      updates.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }
    
    if (date !== undefined) {
      updates.push(`date = $${paramCount}`);
      values.push(date);
      paramCount++;
    }
    
    if (notes !== undefined) {
      updates.push(`notes = $${paramCount}`);
      values.push(notes);
      paramCount++;
    }
    
    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }
    
    // Add ID parameter for WHERE clause
    values.push(id);
    
    const sql = `UPDATE bookings SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING *`;
    
    const updateResult = await pool.query(sql, values);
    res.json(updateResult.rows[0]);
  } catch (err) {
    console.error("Error updating booking:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  const id = req.params.id;
  
  try {
    const result = await pool.query("DELETE FROM bookings WHERE id = $1 RETURNING *", [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Error deleting booking:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Availability Routes
app.get("/api/availability", async (req, res) => {
  try {
    // Get weekly schedule with day slots
    const weeklyScheduleResult = await pool.query(
      "SELECT ws.* FROM weekly_schedule ws ORDER BY ws.day_order"
    );
    
    // Get special dates with their slots
    const specialDatesResult = await pool.query(
      "SELECT sd.* FROM special_dates sd ORDER BY sd.date"
    );
    
    // Get all time slots
    const timeSlotsResult = await pool.query(
      "SELECT * FROM time_slots"
    );
    
    // Process data to add slot details to each day/special date
    const weeklySchedule = weeklyScheduleResult.rows.map(day => {
      const daySlots = timeSlotsResult.rows.filter(slot => slot.weekly_schedule_id === day.id);
      return {
        ...day,
        slots: daySlots
      };
    });
    
    const specialDates = specialDatesResult.rows.map(date => {
      const dateSlots = timeSlotsResult.rows.filter(slot => slot.special_date_id === date.id);
      return {
        ...date,
        slots: dateSlots
      };
    });
    
    res.json({
      weeklySchedule,
      specialDates
    });
  } catch (err) {
    console.error("Error fetching availability:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.put("/api/availability", async (req, res) => {
  const { weeklySchedule, specialDates } = req.body;
  const client = await pool.connect();
  
  try {
    // Start a transaction
    await client.query('BEGIN');
    
    // Update weekly schedule
    for (const day of weeklySchedule) {
      // Update the day's open/closed status
      await client.query(
        "UPDATE weekly_schedule SET is_open = $1 WHERE day = $2",
        [day.isOpen, day.day]
      );
      
      // Update time slots for this day
      const dayResult = await client.query(
        "SELECT id FROM weekly_schedule WHERE day = $1",
        [day.day]
      );
      
      const dayId = dayResult.rows[0].id;
      
      // Delete existing slots
      await client.query(
        "DELETE FROM time_slots WHERE weekly_schedule_id = $1",
        [dayId]
      );
      
      // Insert new slots if the day is open
      if (day.isOpen && day.slots && day.slots.length > 0) {
        for (const slot of day.slots) {
          await client.query(
            "INSERT INTO time_slots (weekly_schedule_id, time, is_available) VALUES ($1, $2, $3)",
            [dayId, slot.time, slot.isAvailable]
          );
        }
      }
    }
    
    // Handle special dates
    
    // Get existing special dates
    const existingDatesResult = await client.query("SELECT id, date FROM special_dates");
    const existingDates = existingDatesResult.rows;
    
    // Identify dates to delete (exist in DB but not in request)
    const requestDateStrings = specialDates.map(d => new Date(d.date).toISOString().split('T')[0]);
    
    for (const existingDate of existingDates) {
      const dateStr = new Date(existingDate.date).toISOString().split('T')[0];
      if (!requestDateStrings.includes(dateStr)) {
        // Delete if not in the request
        await client.query("DELETE FROM special_dates WHERE id = $1", [existingDate.id]);
      }
    }
    
    // Update/insert special dates from request
    for (const specialDate of specialDates) {
      const dateStr = new Date(specialDate.date).toISOString().split('T')[0];
      
      // Check if this date already exists
      const existingDate = existingDates.find(d => 
        new Date(d.date).toISOString().split('T')[0] === dateStr
      );
      
      if (existingDate) {
        // Update existing date
        await client.query(
          "UPDATE special_dates SET is_open = $1, reason = $2 WHERE id = $3",
          [specialDate.isOpen, specialDate.reason, existingDate.id]
        );
        
        // Delete existing slots
        await client.query("DELETE FROM time_slots WHERE special_date_id = $1", [existingDate.id]);
        
        // Add new slots
        if (specialDate.isOpen && specialDate.slots && specialDate.slots.length > 0) {
          for (const slot of specialDate.slots) {
            await client.query(
              "INSERT INTO time_slots (special_date_id, time, is_available) VALUES ($1, $2, $3)",
              [existingDate.id, slot.time, slot.isAvailable]
            );
          }
        }
      } else {
        // Insert new date
        const newDateResult = await client.query(
          "INSERT INTO special_dates (date, is_open, reason) VALUES ($1, $2, $3) RETURNING id",
          [specialDate.date, specialDate.isOpen, specialDate.reason]
        );
        
        const newDateId = newDateResult.rows[0].id;
        
        // Add slots
        if (specialDate.isOpen && specialDate.slots && specialDate.slots.length > 0) {
          for (const slot of specialDate.slots) {
            await client.query(
              "INSERT INTO time_slots (special_date_id, time, is_available) VALUES ($1, $2, $3)",
              [newDateId, slot.time, slot.isAvailable]
            );
          }
        }
      }
    }
    
    // Commit the transaction
    await client.query('COMMIT');
    
    res.json({ message: "Availability updated successfully" });
  } catch (err) {
    // Rollback in case of error
    await client.query('ROLLBACK');
    console.error("Error updating availability:", err);
    res.status(500).json({ error: "Database error" });
  } finally {
    // Release the client
    client.release();
  }
});

// Get available slots for a specific date
app.get("/api/availability/slots/:date", async (req, res) => {
  try {
    const requestDate = new Date(req.params.date);
    const dateStr = requestDate.toISOString().split('T')[0];
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][requestDate.getDay()];
    
    // Check for special date first
    const specialDateResult = await pool.query(
      "SELECT id, is_open FROM special_dates WHERE date::date = $1::date",
      [dateStr]
    );
    
    // If special date exists
    if (specialDateResult.rows.length > 0) {
      const specialDate = specialDateResult.rows[0];
      
      if (!specialDate.is_open) {
        return res.json({ isOpen: false, slots: [] });
      }
      
      // Get slots for special date
      const slotResult = await pool.query(
        "SELECT time, is_available FROM time_slots WHERE special_date_id = $1",
        [specialDate.id]
      );
      
      return res.json({
        isOpen: true,
        slots: slotResult.rows
      });
    } else {
      // Fall back to weekly schedule
      const dayResult = await pool.query(
        "SELECT id, is_open FROM weekly_schedule WHERE day = $1",
        [dayOfWeek]
      );
      
      if (dayResult.rows.length === 0 || !dayResult.rows[0].is_open) {
        return res.json({ isOpen: false, slots: [] });
      }
      
      // Get slots for this day of week
      const slotResult = await pool.query(
        "SELECT time, is_available FROM time_slots WHERE weekly_schedule_id = $1",
        [dayResult.rows[0].id]
      );
      
      return res.json({
        isOpen: true,
        slots: slotResult.rows
      });
    }
  } catch (err) {
    console.error("Error fetching available slots:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));