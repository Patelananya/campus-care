class User {
  constructor(id, name, email, password, role, department = null) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // admin, manager, student
    this.department = department; // for managers only
  }

  // Create a new user
  static create(newUser, connection, callback) {
    const query = 'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)';
    const values = [newUser.name, newUser.email, newUser.password, newUser.role, newUser.department];
    
    connection.query(query, values, (err, result) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, { id: result.insertId, ...newUser });
    });
  }

  // Find user by email
  static findByEmail(email, connection, callback) {
    const query = 'SELECT * FROM users WHERE email = ?';
    
    connection.query(query, [email], (err, results) => {
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

  // Find user by ID
  static findById(id, connection, callback) {
    const query = 'SELECT * FROM users WHERE id = ?';
    
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

  // Get all managers by department
  static getManagersByDepartment(department, connection, callback) {
    const query = 'SELECT * FROM users WHERE role = "manager" AND department = ?';
    
    connection.query(query, [department], (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }

  // Get all managers
  static getAllManagers(connection, callback) {
    const query = 'SELECT * FROM users WHERE role = "manager"';
    
    connection.query(query, (err, results) => {
      if (err) {
        callback(err, null);
        return;
      }
      callback(null, results);
    });
  }
}

module.exports = User;