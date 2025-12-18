import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getManagerComplaints, updateComplaintStatus } from '../services/complaintService';
import '../styles/theme.css';
import './Dashboard.css';

const ManagerDashboard = () => {
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
      const response = await getManagerComplaints();
      setComplaints(response.complaints);
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await updateComplaintStatus(complaintId, newStatus);
      // Update local state
      setComplaints(complaints.map(complaint => 
        complaint.id === complaintId 
          ? { ...complaint, status: newStatus } 
          : complaint
      ));
    } catch (err) {
      setError(err.message || 'Failed to update complaint status');
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
        <h1>Manager Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name} ({user?.department})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="complaints-section">
          <h2>Assigned Complaints ({complaints.length})</h2>
          {complaints.length === 0 ? (
            <div className="card no-complaints">
              <p>You have no assigned complaints.</p>
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
                    <p><strong>Student:</strong> {complaint.student_name}</p>
                    <p><strong>Department:</strong> {complaint.department}</p>
                    <p><strong>Description:</strong> {complaint.description}</p>
                  </div>
                  <div className="complaint-footer">
                    <span>Created: {new Date(complaint.created_at).toLocaleDateString()}</span>
                    <div className="status-actions">
                      <select 
                        value={complaint.status}
                        onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                        className="form-control"
                        style={{ width: 'auto' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
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

export default ManagerDashboard;