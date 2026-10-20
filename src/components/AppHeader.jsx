import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppBar, Button, Chip, Toolbar, Typography } from "@mui/material";
import { UserContext } from "../context/UserContext";

export default function AppHeader() {
  const { user, logout } = useContext(UserContext);

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography
          component={Link}
          to="/"
          variant="h6"
          sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
        >
          Online Course Service
        </Typography>
        <Typography sx={{ mr: 1.5 }}>{user.username}</Typography>
        <Chip
          label={user.role}
          size="small"
          sx={{ mr: 2, bgcolor: "rgba(255,255,255,0.18)", color: "inherit" }}
        />
        <Button color="inherit" onClick={logout}>
          Log out
        </Button>
      </Toolbar>
    </AppBar>
  );
}
