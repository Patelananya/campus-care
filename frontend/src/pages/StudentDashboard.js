import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getStudentComplaints } from '../services/complaintService';
import '../styles/theme.css';
import './Dashboard.css';

const StudentDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchComplaints();
  }, [user, navigate]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await getStudentComplaints();
      setComplaints(response.complaints);
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'resolved':
        return 'status-resolved';
      case 'in_progress':
        return 'status-in-progress';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  if (loading) return <div className="dashboard-container"><div className="container py-5 text-center">Loading...</div></div>;
  if (error) return <div className="dashboard-container"><div className="container py-5 text-center alert alert-danger">{error}</div></div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Student Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-actions">
          <button 
            onClick={() => navigate('/student/new-complaint')}
            className="btn btn-primary"
          >
            New Complaint
          </button>
        </div>

        <div className="complaints-section">
          <h2>My Complaints ({complaints.length})</h2>
          {complaints.length === 0 ? (
            <div className="card no-complaints">
              <p>You have no complaints yet.</p>
              <button 
                onClick={() => navigate('/student/new-complaint')}
                className="btn btn-primary mt-3"
              >
                Create Your First Complaint
              </button>
            </div>
          ) : (
            <div className="complaints-list">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="complaint-card card">
                  <div className="complaint-header">
                    <h3>{complaint.title}</h3>
                    <span className={`status-badge ${getStatusClass(complaint.status)}`}>
                      {complaint.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="complaint-details">
                    <p><strong>Department:</strong> {complaint.department}</p>
                    <p><strong>Description:</strong> {complaint.description}</p>
                    <p><strong>Assigned to:</strong> {complaint.manager_name || 'Not assigned yet'}</p>
                  </div>
                  <div className="complaint-footer">
                    <span>Created: {new Date(complaint.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;