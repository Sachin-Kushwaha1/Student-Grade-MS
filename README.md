# Student Grade Management System

A full-stack web application for managing student grades by uploading Excel/CSV files. Built with React frontend and Node.js/Express backend with MongoDB.

## Live Demo

Frontend: [https://student-grade-ms.vercel.app](https://student-grade-ms.vercel.app)
Backend: [https://student-grade-ms.onrender.com](https://student-grade-ms.onrender.com)

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

### Backend Setup (Local)

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

### Frontend Setup (Local)

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

### Backend (Render)

1. Create a new **Web Service** on [Render](https://render.com/).
2. Set **Root Directory** to `backend`.
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start`
5. Add environment variable:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
6. Deploy and copy your backend URL (e.g., `https://student-grade-ms.onrender.com`)

### Frontend (Vercel)

1. Create a new project on [Vercel](https://vercel.com/).
2. Set **Root Directory** to `frontend`.
3. Set **Install Command**: `npm install`
4. Set **Build Command**: `npm run build`
5. Set **Output Directory**: `build`
6. Add environment variable:
   - `REACT_APP_API_URL`: Your deployed backend URL (e.g., `https://student-grade-ms.onrender.com/api`)
7. Deploy and copy your frontend URL (e.g., `https://student-grade-ms.vercel.app`)

### Environment Variables

- **Backend:** Set in Render dashboard, not in code.
- **Frontend:** Set in Vercel dashboard, not in code. Local `.env` is only for local development.

### Troubleshooting

- If you see "Network Error" in the frontend, make sure `REACT_APP_API_URL` is set to your live backend URL in Vercel.
- If you see CORS errors, ensure your backend allows requests from your Vercel domain.
- Always redeploy after changing environment variables.

## Sample Data

The repository includes sample data files:

- `sample_data - students_data_1.csv` - CSV format with 500+ student records
- `sample_data.xlsx` - Excel format with the same data

## Usage

1. Start both backend and frontend servers locally, or visit your deployed links:
   - [Frontend](https://student-grade-ms.vercel.app)
   - [Backend](https://student-grade-ms.onrender.com)
2. Open the application in your browser.
3. Upload an Excel or CSV file with student data.
4. Sort, view, edit, or delete student records as needed.

## Built With AI Assistance

This project was built with extensive use of AI tools (GitHub Copilot, ChatGPT) for rapid development, code review, and deployment automation.

## License

This project is created for interview and educational purposes. Feel free to fork, modify, and use for learning or portfolio projects.
