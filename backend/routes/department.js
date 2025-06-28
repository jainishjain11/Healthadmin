const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all departments
router.get('/', async (req, res) => {
  try {
    const [departments] = await pool.query('SELECT * FROM Department');
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching departments' });
  }
});

// POST: Add a new department
router.post('/', async (req, res) => {
  const { Dept_Name } = req.body;
  if (!Dept_Name) {
    return res.status(400).json({ message: 'Department name is required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO Department (Dept_Name) VALUES (?)',
      [Dept_Name]
    );
    res.status(201).json({ 
      message: 'Department added successfully', 
      departmentId: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding department' });
  }
});

module.exports = router;
