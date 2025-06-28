require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const pool = require('./config/db');

// Test database connection route
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    res.json({ message: 'Database connected!', solution: rows[0].solution });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
});

// Department routes
const departmentRoutes = require('./routes/department');
app.use('/api/departments', departmentRoutes);

//Doctor routes
const doctorRoutes = require('./routes/doctor');
app.use('/api/doctors', doctorRoutes);

//Patient routes
const patientRoutes = require('./routes/patient');
app.use('/api/patients', patientRoutes);

const appointmentRoutes = require('./routes/appointment');
app.use('/api/appointments', appointmentRoutes);

const paymentRoutes = require('./routes/payment');
app.use('/api/payments', paymentRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
