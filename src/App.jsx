import { HashRouter, Route, Routes } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import TeacherOnly from "./components/TeacherOnly";
import CourseDetailPage from "./pages/CourseDetailPage";
import CourseFormPage from "./pages/CourseFormPage";
import CoursesPage from "./pages/CoursesPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <CoursesPage />
            </RequireAuth>
          }
        />
        <Route
          path="/courses/new"
          element={
            <RequireAuth>
              <TeacherOnly>
                <CourseFormPage />
              </TeacherOnly>
            </RequireAuth>
          }
        />
        <Route
          path="/courses/:courseId"
          element={
            <RequireAuth>
              <CourseDetailPage />
            </RequireAuth>
          }
        />
        <Route
          path="/courses/:courseId/edit"
          element={
            <RequireAuth>
              <TeacherOnly>
                <CourseFormPage />
              </TeacherOnly>
            </RequireAuth>
          }
        />
      </Routes>
    </HashRouter>
  );
}
