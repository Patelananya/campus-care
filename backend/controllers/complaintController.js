const Complaint = require('../models/Complaint');
const User = require('../models/User');
const db = require('../config/db');

// Create a new complaint (Student)
const createComplaint = (req, res) => {
  try {
    // Only students can create complaints
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const { department, title, description } = req.body;
    const student_id = req.user.id;

    // Validate required fields
    if (!department || !title || !description) {
      return res.status(400).json({ message: 'Department, title, and description are required' });
    }

    // Get manager for the department
    User.getManagersByDepartment(department, db, (err, managers) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      // If no manager found for department
      if (managers.length === 0) {
        return res.status(404).json({ message: 'No manager found for this department' });
      }

      // Assign to first available manager (can be improved with load balancing)
      const manager_id = managers[0].id;

      // Create new complaint
      const newComplaint = {
        student_id,
        manager_id,
        department,
        title,
        description,
        status: 'pending'
      };

      Complaint.create(newComplaint, db, (err, complaint) => {
        if (err) {
          return res.status(500).json({ message: 'Error creating complaint', error: err });
        }

        res.status(201).json({
          message: 'Complaint created successfully',
          complaint
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all complaints (Admin)
const getAllComplaints = (req, res) => {
  try {
    // Only admin can view all complaints
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    Complaint.getAll(db, (err, complaints) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      res.status(200).json({
        message: 'Complaints fetched successfully',
        complaints
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get complaints by student (Student)
const getStudentComplaints = (req, res) => {
  try {
    // Only students can view their complaints
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied. Students only.' });
    }

    const student_id = req.user.id;

    Complaint.getByStudentId(student_id, db, (err, complaints) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      res.status(200).json({
        message: 'Complaints fetched successfully',
        complaints
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get complaints by manager (Manager)
const getManagerComplaints = (req, res) => {
  try {
    // Only managers can view their complaints
    if (req.user.role !== 'manager') {
      return res.status(403).json({ message: 'Access denied. Managers only.' });
    }

    const manager_id = req.user.id;

    Complaint.getByManagerId(manager_id, db, (err, complaints) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      res.status(200).json({
        message: 'Complaints fetched successfully',
        complaints
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update complaint status (Manager/Admin)
const updateComplaintStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userRole = req.user.role;
    const userId = req.user.id;

    // Validate status
    const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Check if complaint exists and user has permission
    Complaint.getById(id, db, (err, complaint) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      // Check permissions
      if (userRole === 'manager' && complaint.manager_id !== userId) {
        return res.status(403).json({ message: 'Access denied. Not assigned to this complaint.' });
      }

      if (userRole !== 'admin' && userRole !== 'manager') {
        return res.status(403).json({ message: 'Access denied.' });
      }

      // Update status
      Complaint.updateStatus(id, status, db, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Database error', error: err });
        }

        res.status(200).json({
          message: 'Complaint status updated successfully',
          complaint: { ...complaint, status }
        });
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get complaint statistics (Admin)
const getComplaintStats = (req, res) => {
  try {
    // Only admin can view stats
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const query = `
      SELECT 
        department,
        COUNT(*) as total,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
      FROM complaints
      GROUP BY department
    `;

    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Database error', error: err });
      }

      res.status(200).json({
        message: 'Complaint statistics fetched successfully',
        stats: results
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  getStudentComplaints,
  getManagerComplaints,
  updateComplaintStatus,
  getComplaintStats
};