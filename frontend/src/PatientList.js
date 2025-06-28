import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PatientList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    Pat_Name: '',
    Gender: '',
    Age: '',
    Phone_No: '',
    Email: ''
  });
  const [message, setMessage] = useState('');

  const fetchPatients = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/patients')
      .then(res => {
        setPatients(res.data);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.Pat_Name || !form.Phone_No || !form.Email) {
      setMessage('Name, phone, and email are required.');
      return;
    }
    axios.post('http://localhost:5000/api/patients', form)
      .then(() => {
        setMessage('Patient added successfully!');
        setForm({
          Pat_Name: '',
          Gender: '',
          Age: '',
          Phone_No: '',
          Email: ''
        });
        fetchPatients();
      })
      .catch(() => setMessage('Error adding patient.'));
  };

  return (
    <div>
      <h2>Patients</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Pat_Name"
          value={form.Pat_Name}
          onChange={handleChange}
          placeholder="Patient Name (e.g., Priya Sharma)"
        />
        <select
          name="Gender"
          value={form.Gender}
          onChange={handleChange}
        >
          <option value="">Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          name="Age"
          value={form.Age}
          onChange={handleChange}
          placeholder="Age"
        />
        <input
          type="text"
          name="Phone_No"
          value={form.Phone_No}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <input
          type="email"
          name="Email"
          value={form.Email}
          onChange={handleChange}
          placeholder="Email"
        />
        <button type="submit">Add Patient</button>
      </form>
      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
      {loading ? (
        <p>Loading patients...</p>
      ) : patients.length === 0 ? (
        <p>No patients found.</p>
      ) : (
        <div className="card-list">
          {patients.map(patient => (
            <div className="card" key={patient.Patient_ID}>
              <strong>{patient.Pat_Name}</strong> ({patient.Gender || 'N/A'}, Age: {patient.Age || 'N/A'})
              <span>Phone: {patient.Phone_No}</span>
              <span>Email: {patient.Email}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PatientList;
