const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all appointments with patient and doctor info
router.get('/', async (req, res) => {
  try {
    const [appointments] = await pool.query(`
      SELECT 
        Appointment.App_ID, 
        Appointment.Appointment_DateTime, 
        Appointment.Status,
        Patient.Pat_Name AS patient_name,
        Patient.Phone_No AS patient_phone,
        Doctor.Name AS doctor_name,
        Doctor.Specialization,
        Department.Dept_Name
      FROM Appointment
      JOIN Patient ON Appointment.Patient_ID = Patient.Patient_ID
      JOIN Doctor ON Appointment.Dr_ID = Doctor.Dr_ID
      JOIN Department ON Doctor.Dept_ID = Department.Dept_ID
      ORDER BY Appointment.Appointment_DateTime DESC
    `);
    res.json(appointments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// POST: Book a new appointment
router.post('/', async (req, res) => {
  const { Patient_ID, Dr_ID, Appointment_DateTime } = req.body;
  if (!Patient_ID || !Dr_ID || !Appointment_DateTime) {
    return res.status(400).json({ message: 'Patient, Doctor, and DateTime are required' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO Appointment (Patient_ID, Dr_ID, Appointment_DateTime, Status)
       VALUES (?, ?, ?, 'pending')`,
      [Patient_ID, Dr_ID, Appointment_DateTime]
    );
    res.status(201).json({ 
      message: 'Appointment booked successfully', 
      appointmentId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

module.exports = router;
