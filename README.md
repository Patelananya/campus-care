# Campus Care - College Complaint Management System

A comprehensive complaint management system for colleges with separate dashboards for students, managers, and administrators.

## Features

### Student Dashboard
- Register and login to the system
- View existing complaints
- Submit new complaints
- Track complaint status

### Manager Dashboard
- View assigned complaints
- Update complaint status (Pending, In Progress, Resolved, Rejected)
- Manage complaints for specific departments

### Admin Dashboard
- View all complaints across all departments
- Create manager accounts
- Monitor complaint statistics
- Update any complaint status

## Technologies Used

- **Frontend**: React.js, React Router
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs

## Project Structure

```
campus_care/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── ...
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── contexts/
    │   └── ...
    └── ...
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with your database configuration:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=campus_care
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. Run the setup script to create the database and tables:
   ```
   node setup.js
   ```

5. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Default Accounts

After running the setup script, the following default account will be created:

- **Admin**: 
  - Email: admin@campuscare.com
  - Password: admin123

## Department Types

The system supports the following department types for complaints:
- Cleaning
- Electric
- Equipment Failure
- Broken Light
- No Drinking Water
- Pipe Connection Failure

## API Endpoints

### Authentication
- `POST /api/auth/register/student` - Student registration
- `POST /api/auth/login` - User login
- `POST /api/auth/manager` - Create manager (Admin only)

### Complaints
- `POST /api/complaints` - Create complaint (Student only)
- `GET /api/complaints/my-complaints` - Get student complaints (Student only)
- `GET /api/complaints/assigned` - Get manager complaints (Manager only)
- `GET /api/complaints` - Get all complaints (Admin only)
- `GET /api/complaints/stats` - Get complaint statistics (Admin only)
- `PUT /api/complaints/:id/status` - Update complaint status (Manager/Admin)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
    
