import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import "./App.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function StudentsTable({ uploadId, reloadTrigger }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [editForm, setEditForm] = useState({
    student_name: "",
    total_marks: "",
    marks_obtained: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Sorting function
  const sortedStudents = React.useMemo(() => {
    if (!sortConfig.key) return students;
    const sorted = [...students].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      if (sortConfig.key === "percentage") {
        aValue = a.marks_obtained / a.total_marks;
        bValue = b.marks_obtained / b.total_marks;
      }
      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [students, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // Fetch students (optionally scoped by uploadId)
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const url = uploadId
        ? `${API_BASE_URL}/uploads/${uploadId}/students`
        : `${API_BASE_URL}/students`;
      const response = await axios.get(url);
      setStudents(response.data);
    } catch (error) {
      setMessage("Error fetching students: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadId, reloadTrigger]);

  // Handle edit student
  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditForm({
      student_name: student.student_name,
      total_marks: student.total_marks,
      marks_obtained: student.marks_obtained,
    });
  };

  // Handle update student
  const handleUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(
        `${API_BASE_URL}/students/${editingStudent._id}`,
        editForm
      );
      setMessage("Student updated successfully!");
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      setMessage(
        "Error updating student: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle delete student
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        setLoading(true);
        await axios.delete(`${API_BASE_URL}/students/${id}`);
        setMessage("Student deleted successfully!");
        fetchStudents();
      } catch (error) {
        setMessage(
          "Error deleting student: " +
            (error.response?.data?.error || error.message)
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Message Display */}
      {message && (
        <div
          className={`message ${
            message.includes("Error") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}

      {/* Loading Indicator */}
      {loading && <div className="loading">Loading...</div>}

      {/* Students Table */}
      <section className="students-section">
        <h2>Student Records ({students.length} students)</h2>

        {students.length === 0 ? (
          <p className="no-data">
            No student records found. Upload a file to get started.
          </p>
        ) : (
          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th
                    className="sortable"
                    onClick={() => handleSort("student_id")}
                  >
                    Student ID
                    {sortConfig.key === "student_id" && (
                      <span className="sort-arrow">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("student_name")}
                  >
                    Student Name
                    {sortConfig.key === "student_name" && (
                      <span className="sort-arrow">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("total_marks")}
                  >
                    Total Marks
                    {sortConfig.key === "total_marks" && (
                      <span className="sort-arrow">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("marks_obtained")}
                  >
                    Marks Obtained
                    {sortConfig.key === "marks_obtained" && (
                      <span className="sort-arrow">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th
                    className="sortable"
                    onClick={() => handleSort("percentage")}
                  >
                    Percentage
                    {sortConfig.key === "percentage" && (
                      <span className="sort-arrow">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.student_id}</td>
                    <td>
                      {editingStudent && editingStudent._id === student._id ? (
                        <input
                          type="text"
                          value={editForm.student_name}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              student_name: e.target.value,
                            })
                          }
                          className="edit-input"
                        />
                      ) : (
                        student.student_name
                      )}
                    </td>
                    <td>
                      {editingStudent && editingStudent._id === student._id ? (
                        <input
                          type="number"
                          value={editForm.total_marks}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              total_marks: e.target.value,
                            })
                          }
                          className="edit-input"
                        />
                      ) : (
                        student.total_marks
                      )}
                    </td>
                    <td>
                      {editingStudent && editingStudent._id === student._id ? (
                        <input
                          type="number"
                          value={editForm.marks_obtained}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              marks_obtained: e.target.value,
                            })
                          }
                          className="edit-input"
                        />
                      ) : (
                        student.marks_obtained
                      )}
                    </td>
                    <td>
                      {editingStudent && editingStudent._id === student._id ? (
                        <span>
                          {(
                            (editForm.marks_obtained / editForm.total_marks) *
                            100
                          ).toFixed(1)}
                          %
                        </span>
                      ) : (
                        `${student.percentage.toFixed(1)}%`
                      )}
                    </td>
                    <td>
                      {editingStudent && editingStudent._id === student._id ? (
                        <div className="action-buttons">
                          <button
                            onClick={handleUpdate}
                            className="btn btn-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStudent(null)}
                            className="btn btn-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button
                            onClick={() => handleEdit(student)}
                            className="btn btn-edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(student._id)}
                            className="btn btn-delete"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}

function Home() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reloadTick, setReloadTick] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(
        `Uploaded ${response.data.count} students to upload "${response.data.upload.filename}"`
      );
      setReloadTick((t) => t + 1);
    } catch (error) {
      setMessage(
        "Error uploading file: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  return (
    <main className="App-main">
      <section className="upload-section">
        <h2>Upload Student Data</h2>
        <div className="upload-container">
          <input
            type="file"
            accept=".xlsx,.csv"
            onChange={handleFileUpload}
            disabled={loading}
            className="file-input"
          />
          <p className="upload-info">
            Upload Excel (.xlsx) or CSV files with columns: Student_ID,
            Student_Name, Total_Marks, Marks_Obtained
          </p>
          <Link
            to="/uploads"
            className="btn btn-edit"
            style={{ textDecoration: "none", marginTop: 10 }}
          >
            View Upload History
          </Link>
        </div>
      </section>

      {message && (
        <div
          className={`message ${
            message.includes("Error") ? "error" : "success"
          }`}
        >
          {message}
        </div>
      )}

      <StudentsTable reloadTrigger={reloadTick} />
    </main>
  );
}

function Uploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/uploads`);
      setUploads(res.data);
    } catch (e) {
      setMessage(
        "Error loading uploads: " + (e.response?.data?.error || e.message)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  const handleDeleteUpload = async (id) => {
    if (!window.confirm("Delete this entire upload and all its students?"))
      return;
    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/uploads/${id}`);
      setMessage("Upload deleted");
      fetchUploads();
    } catch (e) {
      setMessage(
        "Error deleting upload: " + (e.response?.data?.error || e.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="App-main">
      <section className="students-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Upload History</h2>
          <Link
            to="/"
            className="btn btn-save"
            style={{ textDecoration: "none" }}
          >
            Back to Home
          </Link>
        </div>

        {message && (
          <div
            className={`message ${
              message.includes("Error") ? "error" : "success"
            }`}
          >
            {message}
          </div>
        )}
        {loading && <div className="loading">Loading...</div>}

        {uploads.length === 0 ? (
          <p className="no-data">
            No uploads yet. Upload a file on the Home page.
          </p>
        ) : (
          <div className="table-container">
            <table className="students-table">
              <thead>
                <tr>
                  <th>Filename</th>
                  <th>Uploaded At</th>
                  <th>Students</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((u) => (
                  <tr key={u._id}>
                    <td>{u.filename}</td>
                    <td>{new Date(u.uploaded_at).toLocaleString()}</td>
                    <td>{u.total_students}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-edit"
                          onClick={() => navigate(`/uploads/${u._id}`)}
                        >
                          View
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDeleteUpload(u._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function UploadStudentsView() {
  const { id } = useParams();
  return (
    <main className="App-main">
      <section className="students-section">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>Students for Upload</h2>
          <Link
            to="/uploads"
            className="btn btn-save"
            style={{ textDecoration: "none" }}
          >
            Back to Uploads
          </Link>
        </div>
        <StudentsTable uploadId={id} />
      </section>
    </main>
  );
}

export default function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Student Grade Management System</h1>
        <div className="nav">
          <Link to="/">Home</Link>
          <span style={{ color: "#999" }}>|</span>
          <Link to="/uploads">Upload History</Link>
        </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/uploads" element={<Uploads />} />
        <Route path="/uploads/:id" element={<UploadStudentsView />} />
      </Routes>
    </div>
  );
}
