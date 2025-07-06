import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DoctorList() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    Name: '',
    Specialization: '',
    Experience: '',
    Phone_No: '',
    Dept_ID: ''
  });
  const [message, setMessage] = useState('');

  // Fetch doctors and departments
  const fetchDoctors = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/doctors')
      .then(res => {
        setDoctors(res.data);
        setLoading(false);
      });
  };

  const fetchDepartments = () => {
    axios.get('http://localhost:5000/api/departments')
      .then(res => setDepartments(res.data));
  };

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.Name || !form.Dept_ID) {
      setMessage('Doctor name and department are required.');
      return;
    }
    axios.post('http://localhost:5000/api/doctors', form)
      .then(() => {
        setMessage('Doctor added successfully!');
        setForm({
          Name: '',
          Specialization: '',
          Experience: '',
          Phone_No: '',
          Dept_ID: ''
        });
        fetchDoctors();
      })
      .catch(() => setMessage('Error adding doctor.'));
  };

  return (
    <div>
      <h2>Doctors</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="Name"
          value={form.Name}
          onChange={handleChange}
          placeholder="Doctor Name (e.g., Dr. Arvind Kumar)"
        />
        <input
          type="text"
          name="Specialization"
          value={form.Specialization}
          onChange={handleChange}
          placeholder="Specialization (e.g., Dermatology)"
        />
        <input
          type="number"
          name="Experience"
          value={form.Experience}
          onChange={handleChange}
          placeholder="Experience (years)"
        />
        <input
          type="text"
          name="Phone_No"
          value={form.Phone_No}
          onChange={handleChange}
          placeholder="Phone Number"
        />
        <select
          name="Dept_ID"
          value={form.Dept_ID}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          {departments.map(dept => (
            <option key={dept.Dept_ID} value={dept.Dept_ID}>
              {dept.Dept_Name}
            </option>
          ))}
        </select>
        <button type="submit">Add Doctor</button>
      </form>
      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
      {loading ? (
        <p>Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p>No doctors found.</p>
      ) : (
        <div className="card-list">
          {doctors.map(doc => (
            <div className="card" key={doc.Dr_ID}>
              <strong>{doc.Name}</strong> ({doc.Specialization || 'General'})
              <span>Experience: {doc.Experience || 0} yrs</span>
              <span>Phone: {doc.Phone_No || 'N/A'}</span>
              <span>Department: {doc.Dept_Name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorList;