import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAdminAuthed } from "./auth";

export default function RequireAdmin() {
  const loc = useLocation();
  if (!isAdminAuthed()) {
    return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />;
  }
  return <Outlet />;
}

