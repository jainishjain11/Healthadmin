import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptName, setDeptName] = useState('');
  const [message, setMessage] = useState('');

  const fetchDepartments = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/departments')
      .then(response => {
        setDepartments(response.data);
        setLoading(false);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!deptName.trim()) {
      setMessage('Please enter a department name.');
      return;
    }
    axios.post('http://localhost:5000/api/departments', { Dept_Name: deptName })
      .then(() => {
        setMessage('Department added successfully!');
        setDeptName('');
        fetchDepartments();
      })
      .catch(() => setMessage('Error adding department.'));
  };

  return (
    <div>
      <h2>Departments</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={deptName}
          onChange={e => setDeptName(e.target.value)}
          placeholder="Enter department name"
        />
        <button type="submit">Add Department</button>
      </form>
      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
      {loading ? (
        <p>Loading departments...</p>
      ) : departments.length === 0 ? (
        <p>No departments found.</p>
      ) : (
        <div className="card-list">
          {departments.map(dept => (
            <div className="card" key={dept.Dept_ID}>
              <strong>{dept.Dept_Name}</strong>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DepartmentList;
