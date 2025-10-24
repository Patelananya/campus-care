const db = require('./config/db');

// Test query to get all managers
const query = 'SELECT * FROM users WHERE role = "manager"';

db.query(query, (err, results) => {
  if (err) {
    console.error('Error querying database:', err);
    process.exit(1);
  }
  
  console.log('Managers found:', results);
  process.exit(0);
});