import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AppointmentList() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState({
    Patient_ID: '',
    Dr_ID: '',
    Appointment_DateTime: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAppointments = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/appointments')
      .then(res => {
        setAppointments(res.data);
        setLoading(false);
      });
  };

  const fetchPatients = () => {
    axios.get('http://localhost:5000/api/patients')
      .then(res => setPatients(res.data));
  };

  const fetchDoctors = () => {
    axios.get('http://localhost:5000/api/doctors')
      .then(res => setDoctors(res.data));
  };

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.Patient_ID || !form.Dr_ID || !form.Appointment_DateTime) {
      setMessage('All fields are required.');
      return;
    }
    axios.post('http://localhost:5000/api/appointments', form)
      .then(() => {
        setMessage('Appointment booked successfully!');
        setForm({
          Patient_ID: '',
          Dr_ID: '',
          Appointment_DateTime: ''
        });
        fetchAppointments();
      })
      .catch(() => setMessage('Error booking appointment.'));
  };

  return (
    <div>
      <h2>Appointments</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="Patient_ID"
          value={form.Patient_ID}
          onChange={handleChange}
        >
          <option value="">Select Patient</option>
          {patients.map(patient => (
            <option key={patient.Patient_ID} value={patient.Patient_ID}>
              {patient.Pat_Name}
            </option>
          ))}
        </select>
        <select
          name="Dr_ID"
          value={form.Dr_ID}
          onChange={handleChange}
        >
          <option value="">Select Doctor</option>
          {doctors.map(doctor => (
            <option key={doctor.Dr_ID} value={doctor.Dr_ID}>
              {doctor.Name} ({doctor.Specialization || 'General'})
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          name="Appointment_DateTime"
          value={form.Appointment_DateTime}
          onChange={handleChange}
        />
        <button type="submit">Book Appointment</button>
      </form>
      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
      {loading ? (
        <p>Loading appointments...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="card-list">
          {appointments.map(app => (
            <div className="card" key={app.App_ID}>
              <strong>{app.patient_name}</strong> with <strong>{app.doctor_name}</strong>
              <span>Date: {new Date(app.Appointment_DateTime).toLocaleString()}</span>
              <span>Status: {app.Status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AppointmentList;