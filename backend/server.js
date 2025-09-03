const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("uploads"));

// MongoDB connection
require("dotenv").config();
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Student Schema
const studentSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  student_name: { type: String, required: true },
  total_marks: { type: Number, required: true },
  marks_obtained: { type: Number, required: true },
  percentage: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = [".xlsx", ".csv"];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExt)) {
      cb(null, true);
    } else {
      cb(new Error("Only Excel (.xlsx) and CSV files are allowed"));
    }
  },
});

// Routes

// Get all students
app.get("/api/students", async (req, res) => {
  try {
    const students = await Student.find().sort({ created_at: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get student by ID
app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update student
app.put("/api/students/:id", async (req, res) => {
  try {
    const { student_name, total_marks, marks_obtained } = req.body;
    const percentage = (marks_obtained / total_marks) * 100;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { student_name, total_marks, marks_obtained, percentage },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete student
app.delete("/api/students/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// File upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const fileExt = path.extname(req.file.originalname).toLowerCase();

    let students = [];

    if (fileExt === ".xlsx") {
      students = await parseExcelFile(filePath);
    } else if (fileExt === ".csv") {
      students = await parseCSVFile(filePath);
    }

    // Save students to database
    const savedStudents = await Student.insertMany(students);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({
      message: "File uploaded and processed successfully",
      students: savedStudents,
      count: savedStudents.length,
    });
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: error.message });
  }
});

// Helper function to parse Excel files
async function parseExcelFile(filePath) {
  const XLSX = require("xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data.map((row) => {
    const student_id = row.Student_ID || row["Student_ID"];
    const student_name = row.Student_Name || row["Student_Name"];
    const total_marks = parseInt(row.Total_Marks || row["Total_Marks"]) || 100;
    const marks_obtained =
      parseInt(row.Marks_Obtained || row["Marks_Obtained"]) || 0;
    const percentage = (marks_obtained / total_marks) * 100;

    return {
      student_id,
      student_name,
      total_marks,
      marks_obtained,
      percentage,
    };
  });
}

// Helper function to parse CSV files
async function parseCSVFile(filePath) {
  const csv = require("csv-parser");
  const fs = require("fs");

  return new Promise((resolve, reject) => {
    const students = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const student_id = row.Student_ID;
        const student_name = row.Student_Name;
        const total_marks = parseInt(row.Total_Marks) || 100;
        const marks_obtained = parseInt(row.Marks_Obtained) || 0;
        const percentage = (marks_obtained / total_marks) * 100;

        students.push({
          student_id,
          student_name,
          total_marks,
          marks_obtained,
          percentage,
        });
      })
      .on("end", () => {
        resolve(students);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large" });
    }
  }
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
