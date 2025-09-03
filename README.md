# Student Grade Management System

A full-stack web application for managing student grades by uploading Excel/CSV files. Built with React frontend and Node.js/Express backend with MongoDB.

## Live Demo

Frontend: [Netlify/Vercel Link](#)
Backend: [Railway/Render Link](#)

## Features

- 📁 Upload Excel (.xlsx) and CSV files with student data
- 📊 View student records in a responsive table
- 🔃 Sort by any column (click header to sort ascending/descending)
- ✏️ Edit student information and grades
- 🗑️ Delete student records
- 📈 Automatic percentage calculation
- 📱 Mobile-responsive design

## Features

- 📁 Upload Excel (.xlsx) and CSV files with student data
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
- XLSX and CSV-parser for file processing

### Frontend

- React
- Axios for API calls
- CSS3 for styling

## File Format

The application expects files with the following structure:

| Student_ID | Student_Name | Total_Marks | Marks_Obtained |
| ---------- | ------------ | ----------- | -------------- |
| S001       | John Doe     | 100         | 85             |
| S002       | Jane Smith   | 100         | 92             |

## Installation & Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your MongoDB connection string:
   ```env
   PORT=5000
   MONGODB_URI=your-mongodb-uri
   ```
4. Start the server:
   ```bash
   npm start
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and set your backend API URL:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm start
   ```
   The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/upload` - Upload Excel/CSV file
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

## Database Schema

```javascript
{
  _id: ObjectId,
  student_id: String,
  student_name: String,
  total_marks: Number,
  marks_obtained: Number,
  percentage: Number,
  created_at: Date
}
```

## Deployment

### Backend (Railway/Render)

1. Connect your GitHub repository.
2. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `PORT`: Will be set automatically by the platform
3. Deploy and copy your backend URL (e.g., `https://your-app.up.railway.app`)

### Frontend (Netlify/Vercel)

1. Connect your GitHub repository.
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your deployed backend URL
5. Deploy and copy your frontend URL (e.g., `https://your-app.netlify.app`)

## Sample Data

The repository includes sample data files:

- `sample_data - students_data_1.csv` - CSV format with 500+ student records
- `sample_data.xlsx` - Excel format with the same data

## Usage

1. Start both backend and frontend servers locally, or visit your deployed links.
2. Open the application in your browser.
3. Upload an Excel or CSV file with student data.
4. Sort, view, edit, or delete student records as needed.

## Built With AI Assistance

This project was built with extensive use of AI tools for rapid development and deployment.

## License

This project is created for interview purposes.
