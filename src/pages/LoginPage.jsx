import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { UserContext } from "../context/UserContext";

export default function LoginPage() {
  const { user, loading, login } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
        background:
          "radial-gradient(circle at top, #e7f2f4 0%, #f6f3ee 45%, #efe6d8 100%)",
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 420, p: 4 }}>
        <Typography variant="overline" color="text.secondary">
          Online Course Service
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, mb: 3 }}>
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <TextField
              label="Username or email"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
              fullWidth
            />
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
