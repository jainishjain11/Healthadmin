const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all doctors
router.get('/', async (req, res) => {
  try {
    const [doctors] = await pool.query(
      `SELECT Doctor.*, Department.Dept_Name 
       FROM Doctor 
       LEFT JOIN Department ON Doctor.Dept_ID = Department.Dept_ID`
    );
    res.json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// POST: Add a new doctor
router.post('/', async (req, res) => {
  const { Name, Specialization, Experience, Phone_No, Dept_ID } = req.body;
  if (!Name || !Dept_ID) {
    return res.status(400).json({ message: 'Doctor name and department are required' });
  }
  try {
    const [result] = await pool.query(
      `INSERT INTO Doctor (Name, Specialization, Experience, Phone_No, Dept_ID)
       VALUES (?, ?, ?, ?, ?)`,
      [Name, Specialization, Experience, Phone_No, Dept_ID]
    );
    res.status(201).json({ 
      message: 'Doctor added successfully', 
      doctorId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding doctor' });
  }
});

module.exports = router;
