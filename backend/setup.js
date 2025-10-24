const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Create a connection to the database without specifying a database
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || ''
});

// Read the schema file
const schemaPath = path.join(__dirname, 'config', 'schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split the schema into individual statements
const statements = schema.split(';').filter(stmt => stmt.trim() !== '');

// Execute each statement
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  
  console.log('Connected to MySQL server');
  
  // Execute each statement sequentially
  let index = 0;
  
  function executeNextStatement() {
    if (index >= statements.length) {
      console.log('Database and tables created successfully!');
      console.log('Default admin user created:');
      console.log('Email: admin@campuscare.com');
      console.log('Password: admin123');
      connection.end();
      return;
    }
    
    const statement = statements[index].trim() + ';';
    if (statement.length > 1) {
      connection.query(statement, (err, results) => {
        if (err) {
          console.error('Error executing statement:', err);
          connection.end();
          return;
        }
        console.log(`Executed statement ${index + 1}:`, statement.substring(0, 50) + '...');
        index++;
        executeNextStatement();
      });
    } else {
      index++;
      executeNextStatement();
    }
  }
  
  executeNextStatement();
});