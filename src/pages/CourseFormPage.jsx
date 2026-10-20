import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Button,
  Container,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AppHeader from "../components/AppHeader";
import { api } from "../lib/api";

const emptyForm = {
  name: "",
  duration: "",
  topics: "",
  price: "",
  maxStudent: "",
  status: "open",
};

export default function CourseFormPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const editing = Boolean(courseId);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!editing) {
      return;
    }

    api(`/api/course/${courseId}`)
      .then((data) => {
        const course = data.course;
        setForm({
          name: course.name,
          duration: String(course.duration),
          topics: course.topics.join(", "),
          price: String(course.price),
          maxStudent: String(course.maxStudent),
          status: course.status,
        });
      })
      .catch((err) => setError(err.message));
  }, [courseId, editing]);

  function updateField(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    const payload = {
      name: form.name,
      duration: Number(form.duration),
      topics: form.topics.split(",").map((topic) => topic.trim()).filter(Boolean),
      price: Number(form.price),
      maxStudent: Number(form.maxStudent),
      status: form.status,
    };

    try {
      const data = await api(editing ? `/api/course/${courseId}` : "/api/course", {
        method: editing ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      navigate(`/courses/${data.course.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <AppHeader />
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {editing ? "Update course" : "New course"}
        </Typography>
        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField label="Course name" value={form.name} onChange={updateField("name")} required />
          <TextField
            label="Duration (days)"
            type="number"
            value={form.duration}
            onChange={updateField("duration")}
            required
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />
          <TextField
            label="Topics"
            helperText="Separate topics with commas."
            value={form.topics}
            onChange={updateField("topics")}
            required
          />
          <TextField
            label="Price"
            type="number"
            value={form.price}
            onChange={updateField("price")}
            required
            slotProps={{ htmlInput: { min: 0, step: "0.01" } }}
          />
          <TextField
            label="Max student"
            type="number"
            value={form.maxStudent}
            onChange={updateField("maxStudent")}
            required
            slotProps={{ htmlInput: { min: 1, step: 1 } }}
          />
          <TextField select label="Status" value={form.status} onChange={updateField("status")}>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="close">Close</MenuItem>
            <MenuItem value="cancel">Cancel</MenuItem>
          </TextField>
          <Stack direction="row" spacing={1}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Saving..." : "Save"}
            </Button>
            <Button onClick={() => navigate(editing ? `/courses/${courseId}` : "/")}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
