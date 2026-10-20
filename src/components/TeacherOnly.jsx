import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function TeacherOnly({ children }) {
  const { user } = useContext(UserContext);

  if (user.role !== "teacher") {
    return <Navigate to="/" replace />;
  }

  return children;
}
