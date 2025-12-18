import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { getAllComplaints, getComplaintStats, updateComplaintStatus } from '../services/complaintService';
import { createManager, getAllManagers } from '../services/authService';
import '../styles/theme.css';
import './Dashboard.css';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [managers, setManagers] = useState([]);
  const [stats, setStats] = useState([]);
  const [showManagerForm, setShowManagerForm] = useState(false);
  const [managerData, setManagerData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
    fetchManagers();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const complaintsResponse = await getAllComplaints();
      const statsResponse = await getComplaintStats();
      
      setComplaints(complaintsResponse.complaints);
      setStats(statsResponse.stats);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchManagers = async () => {
    try {
      const managersResponse = await getAllManagers();
      setManagers(managersResponse.managers);
      // Clear any previous manager fetch errors
      if (error && error.includes('Failed to fetch managers')) {
        setError('');
      }
    } catch (err) {
      console.error('Error fetching managers:', err);
      // Only set error if it's not already set to avoid overriding other errors
      if (!error || !error.includes('Failed to fetch managers')) {
        setError(prevError => prevError ? prevError : (err.message || 'Failed to fetch managers'));
      }
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

  const getStatsForDepartment = (department) => {
    return stats.find(stat => stat.department === department) || {
      department,
      total: 0,
      pending: 0,
      in_progress: 0,
      resolved: 0,
      rejected: 0
    };
  };

  const handleManagerFormChange = (e) => {
    setManagerData({
      ...managerData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      // Basic validation
      if (!managerData.name || !managerData.email || !managerData.password || !managerData.department) {
        throw new Error('All fields are required');
      }

      await createManager(managerData);
      setSuccess('Manager created successfully!');
      // Reset form
      setManagerData({
        name: '',
        email: '',
        password: '',
        department: ''
      });
      setShowManagerForm(false);
      // Refresh managers list
      fetchManagers();
    } catch (err) {
      setError(err.message || 'Failed to create manager');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="dashboard-container"><div className="container py-5 text-center">Loading...</div></div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
            <button 
              type="button" 
              className="close" 
              onClick={() => setError('')} 
              style={{ float: 'right', background: 'none', border: 'none', fontSize: '1.5rem' }}
            >
              &times;
            </button>
          </div>
        )}
        
        <div className="dashboard-actions">
          <button 
            onClick={() => setShowManagerForm(!showManagerForm)}
            className="btn btn-primary"
          >
            {showManagerForm ? 'Cancel' : 'Add New Manager'}
          </button>
        </div>

        {showManagerForm && (
          <div className="manager-form-section card">
            <h2>Create New Manager</h2>
            {error && !error.includes('Failed to fetch managers') && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}
            <form onSubmit={handleCreateManager} className="manager-form">
              <div className="form-group">
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-control"
                  value={managerData.name}
                  onChange={handleManagerFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  value={managerData.email}
                  onChange={handleManagerFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  value={managerData.password}
                  onChange={handleManagerFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="department">Department:</label>
                <select
                  id="department"
                  name="department"
                  className="form-control"
                  value={managerData.department}
                  onChange={handleManagerFormChange}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Electric">Electric</option>
                  <option value="Services">Services</option>
                  <option value="Hostel Room">Hostel Room</option>
                  <option value="Hostel Food">Hostel Food</option>
                  <option value="Wifi Issue">Wifi Issue</option>
                  <option value="Water Issue">Water Issue</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" disabled={saving} className="btn btn-primary">
                  {saving ? 'Creating...' : 'Create Manager'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Managers Section */}
        <div className="managers-section">
          <h2>Managers ({managers.length})</h2>
          {managers.length === 0 ? (
            <div className="card no-managers">
              <p>No managers found.</p>
            </div>
          ) : (
            <div className="managers-list">
              <table className="managers-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager) => (
                    <tr key={manager.id}>
                      <td>{manager.name}</td>
                      <td>{manager.email}</td>
                      <td>{manager.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="stats-section">
          <h2>Complaint Statistics</h2>
          <div className="stats-cards">
            {['Cleaning', 'Electric', 'Services', 'Hostel Room', 'Hostel Food', 'Wifi Issue', 'Water Issue'].map(dept => {
              const deptStats = getStatsForDepartment(dept);
              return (
                <div key={dept} className="stat-card card">
                  <h3>{dept}</h3>
                  <div className="stat-values">
                    <div className="stat-item">
                      <span className="stat-label">Total:</span>
                      <span className="stat-value">{deptStats.total}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Pending:</span>
                      <span className="stat-value">{deptStats.pending}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">In Progress:</span>
                      <span className="stat-value">{deptStats.in_progress}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Resolved:</span>
                      <span className="stat-value">{deptStats.resolved}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Rejected:</span>
                      <span className="stat-value">{deptStats.rejected}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="complaints-section">
          <h2>All Complaints ({complaints.length})</h2>
          {complaints.length === 0 ? (
            <div className="card no-complaints">
              <p>No complaints found.</p>
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
                    <p><strong>Manager:</strong> {complaint.manager_name || 'Not assigned'}</p>
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

export default AdminDashboard;