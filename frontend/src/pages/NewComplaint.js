import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { createComplaint } from '../services/complaintService';
import '../styles/theme.css';
import './Dashboard.css';

const NewComplaint = () => {
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const departments = [
    'Cleaning',
    'Electric',
    'Services',
    'Hostel Room',
    'Hostel Food',
    'Wifi Issue',
    'Water Issue',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!department || !title || !description) {
      setError('All fields are required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await createComplaint({ department, title, description });
      setSuccess(true);
      // Reset form
      setDepartment('');
      setTitle('');
      setDescription('');
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/student/dashboard');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>New Complaint</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="complaint-form card">
          <h2>Submit a New Complaint</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">Complaint submitted successfully!</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="department">Department:</label>
              <select
                id="department"
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="title">Complaint Title:</label>
              <input
                type="text"
                id="title"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title of your complaint"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                className="form-control"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed description of your complaint"
                required
              />
            </div>
            
            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn btn-primary">
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </button>
              <button type="button" onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewComplaint;