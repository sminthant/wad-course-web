import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Chip,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import AppHeader from "../components/AppHeader";
import { UserContext } from "../context/UserContext";
import { api } from "../lib/api";

const statusLabel = {
  open: "Open",
  close: "Close",
  cancel: "Cancel",
};

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  function loadCourse() {
    return api(`/api/course/${courseId}`)
      .then((data) => {
        setCourse(data.course);
        setStudents(data.students || []);
        setEnrolled(Boolean(data.enrolled));
        setError("");
      })
      .catch((err) => setError(err.message));
  }

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  async function handleDelete() {
    if (!window.confirm("Delete this course?")) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api(`/api/course/${courseId}`, { method: "DELETE" });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleEnroll() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api(`/api/course/${courseId}/enroll`, { method: "POST" });
      setMessage("You are enrolled in this course.");
      await loadCourse();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const isTeacher = user.role === "teacher";
  const canEnroll =
    !isTeacher && course?.status === "open" && course.seatsRemaining > 0 && !enrolled;

  return (
    <>
      <AppHeader />
      <Container sx={{ py: 4 }}>
        <Button onClick={() => navigate("/")} sx={{ mb: 2 }}>
          Back to courses
        </Button>
        {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}
        {message ? <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert> : null}
        {course ? (
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography variant="h4">{course.name}</Typography>
              <Chip label={statusLabel[course.status] || course.status} />
            </Stack>
            <Typography color="text.secondary">Teacher: {course.teacherName}</Typography>
            <Typography>Duration: {course.duration} days</Typography>
            <Typography>Topics: {course.topics.join(", ")}</Typography>
            <Typography>Price: {course.price}</Typography>
            <Typography>
              Students: {course.enrolledCount} / {course.maxStudent} ({course.seatsRemaining} seats left)
            </Typography>

            {isTeacher ? (
              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={() => navigate(`/courses/${course.id}/edit`)}>
                  Update
                </Button>
                <Button
                  color="error"
                  variant="outlined"
                  disabled={busy || course.enrolledCount > 0}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </Stack>
            ) : (
              <Button variant="contained" disabled={!canEnroll || busy} onClick={handleEnroll}>
                {enrolled ? "Already enrolled" : "Enroll"}
              </Button>
            )}

            {isTeacher && course.enrolledCount > 0 ? (
              <Typography color="text.secondary">
                This course cannot be deleted while students are enrolled.
              </Typography>
            ) : null}
            {!isTeacher && course.status === "close" ? (
              <Typography color="text.secondary">
                This course is closed and is not open for enrollment.
              </Typography>
            ) : null}
            {!isTeacher && course.status === "open" && course.seatsRemaining === 0 && !enrolled ? (
              <Typography color="text.secondary">This course is full.</Typography>
            ) : null}

            {isTeacher ? (
              <>
                <Typography variant="h6">Enrolled students</Typography>
                <DataGrid
                  rows={students}
                  columns={[
                    { field: "username", headerName: "Username", flex: 1, minWidth: 140 },
                    { field: "email", headerName: "Email", flex: 1.4, minWidth: 200 },
                  ]}
                  autoHeight
                  disableRowSelectionOnClick
                  pageSizeOptions={[5]}
                  localeText={{ noRowsLabel: "No students enrolled." }}
                />
              </>
            ) : null}
          </Stack>
        ) : null}
      </Container>
    </>
  );
}
