import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    App_ID: '',
    Amount: '',
    Pymt_Method: '',
    Status: 'completed'
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPayments = () => {
    setLoading(true);
    axios.get('http://localhost:5000/api/payments')
      .then(res => {
        setPayments(res.data);
        setLoading(false);
      });
  };

  const fetchAppointments = () => {
    axios.get('http://localhost:5000/api/appointments')
      .then(res => setAppointments(res.data));
  };

  useEffect(() => {
    fetchPayments();
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.App_ID || !form.Amount || !form.Pymt_Method) {
      setMessage('All fields are required.');
      return;
    }
    axios.post('http://localhost:5000/api/payments', form)
      .then(() => {
        setMessage('Payment added successfully!');
        setForm({
          App_ID: '',
          Amount: '',
          Pymt_Method: '',
          Status: 'completed'
        });
        fetchPayments();
      })
      .catch(() => setMessage('Error adding payment.'));
  };

  return (
    <div>
      <h2>Payments</h2>
      <form onSubmit={handleSubmit}>
        <select
          name="App_ID"
          value={form.App_ID}
          onChange={handleChange}
        >
          <option value="">Select Appointment</option>
          {appointments.map(app => (
            <option key={app.App_ID} value={app.App_ID}>
              {app.patient_name} with {app.doctor_name} on {new Date(app.Appointment_DateTime).toLocaleString()}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="Amount"
          value={form.Amount}
          onChange={handleChange}
          placeholder="Amount (e.g., 1200)"
        />
        <select
          name="Pymt_Method"
          value={form.Pymt_Method}
          onChange={handleChange}
        >
          <option value="">Select Payment Method</option>
          <option value="UPI">UPI</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Cash">Cash</option>
          <option value="Net Banking">Net Banking</option>
        </select>
        <select
          name="Status"
          value={form.Status}
          onChange={handleChange}
        >
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <button type="submit">Add Payment</button>
      </form>
      {message && <p className={message.includes('success') ? 'success' : 'error'}>{message}</p>}
      {loading ? (
        <p>Loading payments...</p>
      ) : payments.length === 0 ? (
        <p>No payments found.</p>
      ) : (
        <div className="card-list">
          {payments.map(payment => (
            <div className="card" key={payment.Pymt_ID}>
              <strong>₹{payment.Amount}</strong> [{payment.Pymt_Method}]
              <span>Patient: {payment.patient_name}</span>
              <span>Doctor: {payment.doctor_name}</span>
              <span>Date: {new Date(payment.Appointment_DateTime).toLocaleString()}</span>
              <span>Status: {payment.Status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaymentList;
