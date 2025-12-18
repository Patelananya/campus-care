import api from './authService';

// Create a new complaint (Student)
export const createComplaint = async (complaintData) => {
  try {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

// Get student's complaints (Student)
export const getStudentComplaints = async () => {
  try {
    const response = await api.get('/complaints/my-complaints');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

// Get manager's complaints (Manager)
export const getManagerComplaints = async () => {
  try {
    const response = await api.get('/complaints/assigned');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

// Get all complaints (Admin)
export const getAllComplaints = async () => {
  try {
    const response = await api.get('/complaints');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

// Update complaint status (Manager/Admin)
export const updateComplaintStatus = async (id, status) => {
  try {
    const response = await api.put(`/complaints/${id}/status`, { status });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

// Get complaint statistics (Admin)
export const getComplaintStats = async () => {
  try {
    const response = await api.get('/complaints/stats');
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw error.response.data;
    } else {
      throw new Error('Network error or server is not responding');
    }
  }
};

export default {
  createComplaint,
  getStudentComplaints,
  getManagerComplaints,
  getAllComplaints,
  updateComplaintStatus,
  getComplaintStats
};