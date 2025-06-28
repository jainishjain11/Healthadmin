import React, { useEffect } from 'react';
import logo from './logo.jpg';
import DepartmentList from './DepartmentList';
import DoctorList from './DoctorList';
import PatientList from './PatientList';
import AppointmentList from './AppointmentList';
import PaymentList from './PaymentList';
import './App.css';

function App() {
  useEffect(() => {
    document.title = "Healthadmin";
  }, []);

  return (
    <div className="app-container">
      <div className="header-row">
        <img
          src={logo}
          alt="HealthEase Logo"
          className="logo-image"
        />
        <h1>Healthadmin - Simplifying Your Medical Journey</h1>
      </div>
      <DepartmentList />
      <DoctorList />
      <PatientList />
      <AppointmentList />
      <PaymentList />
    </div>
  );
}

export default App;
