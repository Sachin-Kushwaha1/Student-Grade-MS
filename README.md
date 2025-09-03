# Student Grade Management System

A full-stack web application for managing student grades by uploading Excel/CSV files. Built with a React frontend and a Node.js/Express backend using MongoDB.

- Frontend (Live): https://student-grade-ms.vercel.app
- Backend (Live): https://student-grade-ms.onrender.com

## Table of Contents

- Features
- Tech Stack
- Project Structure
- File Format
- Quick Start (Local)
  - Prerequisites
  - Backend Setup
  - Frontend Setup
- API Endpoints
- Database Schema
- Deployment
  - Backend (Render)
  - Frontend (Vercel)
  - Environment Variables
- Troubleshooting
- Sample Data
- Notes on Security and Files
- License

## Features

- 🗂️ Upload Excel (.xlsx) and CSV files with student data
- 🧾 Each upload is tracked as a separate dataset with its own ID (upload history)
- 🔗 Students are linked to their originating upload for scoped views/actions
- 📊 View student records in a responsive table
- ✏️ Edit student information and grades
- 🗑️ Delete student records
- 📈 Automatic percentage calculation
- 📱 Mobile-responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Multer for file uploads
- xlsx and csv-parser for file processing
- CORS

### Frontend
- React
- Axios for API calls
- CSS3 for styling

## Project Structure

```
.
├─ backend/                # Node/Express API
├─ frontend/               # React app
├─ sample_data.xlsx        # Example Excel data
├─ sample_data - students_data_1.csv  # Example CSV data
├─ README.md
└─ LICENSE
```

## File Format

The application expects files with the following structure:

| Student_ID | Student_Name | Total_Marks | Marks_Obtained |
| ---------- | ------------ | ----------- | -------------- |
| S001       | John Doe     | 100         | 85             |
| S002       | Jane Smith   | 100         | 92             |

Notes:
- Column headers must match exactly.
- Percentage is computed automatically by the backend.

## Quick Start (Local)

### Prerequisites
- Node.js 18+ (LTS recommended)
- MongoDB (local or MongoDB Atlas)

### Backend Setup (Local)

1) Navigate to the backend directory:
```
cd backend
```

2) Install dependencies:
```
npm install
```

3) Create a .env file (or copy from .env.example):
```
PORT=5000
MONGODB_URI=your-mongodb-uri
CORS_ORIGIN=http://localhost:3000
```

4) Start the server:
```
npm start
```
The backend will run on http://localhost:5000

### Frontend Setup (Local)

1) Navigate to the frontend directory:
```
cd frontend
```

2) Install dependencies:
```
npm install
```

3) Create a .env file (or copy from .env.example):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4) Start the development server:
```
npm start
```
The frontend will run on http://localhost:3000

## API Endpoints

Students:
- GET /api/students — Get all students (optionally ?upload_id=<id> to filter)
- GET /api/students/:id — Get student by ID
- POST /api/upload — Upload Excel/CSV file
- PUT /api/students/:id — Update student
- DELETE /api/students/:id — Delete student

Uploads management:
- GET /api/uploads — List uploads with filename, date, and student count
- GET /api/uploads/:id/students — Get students for a specific upload
- DELETE /api/uploads/:id — Delete an upload and all associated students

## Database Schema

```javascript
// uploads collection
{
  _id: ObjectId,        // upload_id
  filename: String,
  uploaded_at: Date,
  total_students: Number
}

// students collection
{
  _id: ObjectId,
  student_id: String,
  student_name: String,
  total_marks: Number,
  marks_obtained: Number,
  percentage: Number,
  upload_id: ObjectId, // ref: uploads._id
  created_at: Date
}
```

## Deployment

### Backend (Render)
1) Create a new Web Service on https://render.com/
2) Root Directory: backend
3) Build Command: npm install
4) Start Command: npm start
5) Environment variables:
   - MONGODB_URI: Your MongoDB Atlas connection string
   - PORT: 10000 (Render provides automatically; if set, align your app)
   - CORS_ORIGIN: Your Vercel frontend origin
6) Deploy and copy your backend URL (e.g., https://student-grade-ms.onrender.com)

### Frontend (Vercel)
1) Create a new project on https://vercel.com/
2) Root Directory: frontend
3) Install Command: npm install
4) Build Command: npm run build
5) Output Directory: build
6) Environment variables:
   - REACT_APP_API_URL: Your deployed backend URL including /api (e.g., https://student-grade-ms.onrender.com/api)
7) Deploy and copy your frontend URL (e.g., https://student-grade-ms.vercel.app)

### Environment Variables

- Backend (set in Render dashboard for production, .env for local):
  - MONGODB_URI
  - PORT
  - CORS_ORIGIN

- Frontend (set in Vercel dashboard for production, .env for local):
  - REACT_APP_API_URL

## Troubleshooting

- “Network Error” in frontend:
  - Ensure REACT_APP_API_URL points to a reachable backend URL (including /api).
- CORS errors:
  - Ensure backend allows requests from your frontend origin (CORS_ORIGIN).
- After changing environment variables in Vercel/Render:
  - Redeploy for changes to take effect.

## Sample Data

- sample_data - students_data_1.csv — CSV format with 500+ student records
- sample_data.xlsx — Excel format with the same data

## Notes on Security and Files

- Only allow trusted users to upload files; validate MIME types and content.
- Consider limiting maximum file size and handling large uploads with streaming.
- Avoid committing .env files; use the provided .env.example files.

## License

This project is licensed under the MIT License — see the LICENSE file for details.