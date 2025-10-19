import { type RouteObject, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import EntityForm from "../pages/Dashboard/EntityForm";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Navigate to="products" replace /> },
      { path: ":entity", element: <Dashboard /> },
      { path: ":entity/new", element: <EntityForm /> },
      { path: ":entity/edit/:id", element: <EntityForm /> },
    ],
  },
];
