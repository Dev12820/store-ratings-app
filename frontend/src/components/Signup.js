import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await signup(formData);
      setSuccess('Registration successful! Please log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required minLength="3" maxLength="60" />
        </div>
        <div>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
        </div>
        <div>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required pattern="^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$" title="8-16 characters, at least one uppercase letter and one special character."/>
        </div>
        <div>
            <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Address (Optional)" maxLength="400" />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p style={{color: 'green'}}>{success}</p>}
        <button type="submit">Sign Up</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default Signup;