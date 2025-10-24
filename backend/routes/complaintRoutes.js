const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getStudentComplaints,
  getManagerComplaints,
  updateComplaintStatus,
  getComplaintStats
} = require('../controllers/complaintController');
const { authenticate, authorizeAdmin, authorizeManager, authorizeStudent } = require('../middleware/auth');

// Student routes
router.post('/', authenticate, authorizeStudent, createComplaint);
router.get('/my-complaints', authenticate, authorizeStudent, getStudentComplaints);

// Manager routes
router.get('/assigned', authenticate, authorizeManager, getManagerComplaints);
router.put('/:id/status', authenticate, authorizeManager, updateComplaintStatus);

// Admin routes
router.get('/', authenticate, authorizeAdmin, getAllComplaints);
router.get('/stats', authenticate, authorizeAdmin, getComplaintStats);
router.put('/:id/status/admin', authenticate, authorizeAdmin, updateComplaintStatus);

module.exports = router;