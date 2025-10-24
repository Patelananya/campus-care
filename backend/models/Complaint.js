class Complaint {
  constructor(id, student_id, manager_id, department, title, description, status, created_at, updated_at) {
    this.id = id;
    this.student_id = student_id;
    this.manager_id = manager_id;
    this.department = department;
    this.title = title;
    this.description = description;
    this.status = status; // pending, in_progress, resolved, rejected
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  // Create a new complaint
  static create(newComplaint, connection, callback) {
    const query = `INSERT INTO complaints 
      (student_id, manager_id, department, title, description, status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    const values = [
      newComplaint.student_id, 
      newComplaint.manager_id, 
      newComplaint.department, 
      newComplaint.title, 
      newComplaint.description, 
      newComplaint.status || 'pending'
    ];
    
    connection.query(query, values, (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id: result.insertId, ...newComplaint, created_at: new Date(), updated_at: new Date() });
    });
  }

  // Get all complaints
  static getAll(connection, callback) {
    const query = `SELECT c.*, u.name as student_name, m.name as manager_name 
      FROM complaints c
      LEFT JOIN users u ON c.student_id = u.id
      LEFT JOIN users m ON c.manager_id = m.id
      ORDER BY c.created_at DESC`;
    
    connection.query(query, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Get complaints by student ID
  static getByStudentId(student_id, connection, callback) {
    const query = `SELECT c.*, m.name as manager_name 
      FROM complaints c
      LEFT JOIN users m ON c.manager_id = m.id
      WHERE c.student_id = ?
      ORDER BY c.created_at DESC`;
    
    connection.query(query, [student_id], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Get complaints by manager ID
  static getByManagerId(manager_id, connection, callback) {
    const query = `SELECT c.*, u.name as student_name 
      FROM complaints c
      LEFT JOIN users u ON c.student_id = u.id
      WHERE c.manager_id = ?
      ORDER BY c.created_at DESC`;
    
    connection.query(query, [manager_id], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Get complaint by ID
  static getById(id, connection, callback) {
    const query = `SELECT c.*, u.name as student_name, m.name as manager_name 
      FROM complaints c
      LEFT JOIN users u ON c.student_id = u.id
      LEFT JOIN users m ON c.manager_id = m.id
      WHERE c.id = ?`;
    
    connection.query(query, [id], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      if (results.length === 0) {
        callback(null, null);
        return;
      }
      callback(null, results[0]);
    });
  }

  // Update complaint status
  static updateStatus(id, status, connection, callback) {
    const query = 'UPDATE complaints SET status = ?, updated_at = NOW() WHERE id = ?';
    
    connection.query(query, [status, id], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }

  // Assign complaint to manager
  static assignToManager(id, manager_id, connection, callback) {
    const query = 'UPDATE complaints SET manager_id = ?, updated_at = NOW() WHERE id = ?';
    
    connection.query(query, [manager_id, id], (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, result);
    });
  }
}

module.exports = Complaint;