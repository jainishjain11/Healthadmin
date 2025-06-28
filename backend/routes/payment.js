const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all payments with appointment, patient, and doctor info
router.get('/', async (req, res) => {
  try {
    const [payments] = await pool.query(`
      SELECT 
        Payment.Pymt_ID, Payment.Amount, Payment.Pymt_Method, Payment.Status, Payment.Pymt_ID,
        Appointment.App_ID, Appointment.Appointment_DateTime,
        Patient.Pat_Name AS patient_name,
        Doctor.Name AS doctor_name
      FROM Payment
      JOIN Appointment ON Payment.App_ID = Appointment.App_ID
      JOIN Patient ON Appointment.Patient_ID = Patient.Patient_ID
      JOIN Doctor ON Appointment.Dr_ID = Doctor.Dr_ID
      ORDER BY Payment.Pymt_ID DESC
    `);
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

// POST: Add a new payment
router.post('/', async (req, res) => {
  const { App_ID, Amount, Pymt_Method, Status } = req.body;
  if (!App_ID || !Amount || !Pymt_Method) {
    return res.status(400).json({ message: 'Appointment, amount, and method are required' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO Payment (App_ID, Amount, Pymt_Method, Status)
       VALUES (?, ?, ?, ?)`,
      [App_ID, Amount, Pymt_Method, Status || 'pending']
    );
    res.status(201).json({ 
      message: 'Payment added successfully', 
      paymentId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding payment' });
  }
});

module.exports = router;
