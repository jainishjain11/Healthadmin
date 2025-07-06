const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all patients
router.get('/', async (req, res) => {
  try {
    const [patients] = await pool.query('SELECT * FROM Patient');
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching patients' });
  }
});

// POST: Add a new patient
router.post('/', async (req, res) => {
  const { Pat_Name, Gender, Age, Phone_No, Email } = req.body;
  if (!Pat_Name || !Phone_No || !Email) {
    return res.status(400).json({ message: 'Name, phone, and email are required' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO Patient (Pat_Name, Gender, Age, Phone_No, Email)
       VALUES (?, ?, ?, ?, ?)`,
      [Pat_Name, Gender, Age, Phone_No, Email]
    );
    res.status(201).json({ 
      message: 'Patient added successfully', 
      patientId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding patient' });
  }
});

module.exports = router;