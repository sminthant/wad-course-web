import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Tabs,
  TextField,
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

export default function CoursesPage() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const isTeacher = user.role === "teacher";
  const [scope, setScope] = useState("catalog");
  const [query, setQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const handle = setTimeout(() => {
      const params = new URLSearchParams();
      if (!isTeacher && scope === "enrolled") {
        params.set("scope", "enrolled");
      } else if (query.trim()) {
        params.set("q", query.trim());
      }

      const search = params.toString();
      api(`/api/course${search ? `?${search}` : ""}`)
        .then((data) => {
          setCourses(data.courses);
          setError("");
        })
        .catch((err) => setError(err.message));
    }, 250);

    return () => clearTimeout(handle);
  }, [isTeacher, query, scope]);

  const columns = isTeacher
    ? [
        { field: "name", headerName: "Course", flex: 1.3, minWidth: 180 },
        { field: "duration", headerName: "Days", width: 90 },
        { field: "price", headerName: "Price", width: 110 },
        { field: "maxStudent", headerName: "Max", width: 90 },
        { field: "enrolledCount", headerName: "Enrolled", width: 110 },
        {
          field: "status",
          headerName: "Status",
          width: 110,
          valueFormatter: (value) => statusLabel[value] || value,
        },
      ]
    : [
        { field: "name", headerName: "Course", flex: 1.2, minWidth: 180 },
        { field: "teacherName", headerName: "Teacher", flex: 0.8, minWidth: 130 },
        { field: "duration", headerName: "Days", width: 90 },
        { field: "price", headerName: "Price", width: 110 },
        { field: "seatsRemaining", headerName: "Seats left", width: 110 },
        {
          field: "status",
          headerName: "Status",
          width: 110,
          valueFormatter: (value) => statusLabel[value] || value,
        },
      ];

  return (
    <>
      <AppHeader />
      <Container sx={{ py: 4 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 2 }}
        >
          <Typography variant="h4">
            {isTeacher ? "My courses" : "Courses"}
          </Typography>
          {isTeacher ? (
            <Button variant="contained" onClick={() => navigate("/courses/new")}>
              New course
            </Button>
          ) : null}
        </Stack>

        {isTeacher ? (
          <TextField
            label="Filter by course name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
        ) : (
          <Stack spacing={2} sx={{ mb: 2 }}>
            <Tabs value={scope} onChange={(_event, value) => setScope(value)}>
              <Tab value="catalog" label="All courses" />
              <Tab value="enrolled" label="My enrollments" />
            </Tabs>
            {scope === "catalog" ? (
              <TextField
                label="Filter by course name or teacher name"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                fullWidth
              />
            ) : null}
          </Stack>
        )}

        {error ? <Alert severity="error">{error}</Alert> : null}
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={courses}
            columns={columns}
            autoHeight
            disableRowSelectionOnClick
            onRowClick={(params) => navigate(`/courses/${params.id}`)}
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 5 } } }}
            localeText={{ noRowsLabel: "No courses to show." }}
          />
        </Box>
      </Container>
    </>
  );
}
