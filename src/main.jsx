//src/main.jsx

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";

const theme = createTheme({
  palette: {
    primary: { main: "#0f3d4c" },
    background: { default: "#f6f3ee" },
  },
  shape: { borderRadius: 10 },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <App />
      </UserProvider>
    </ThemeProvider>
  </StrictMode>,
);
