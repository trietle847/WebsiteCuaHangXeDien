import { type RouteObject, Navigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import EntityForm from "../pages/Dashboard/EntityForm";
import Report from "../pages/Dashboard/Report";
import ProtectedRoleRoute from "../components/ProtectedRoleRoute";

export const dashboardRoutes: RouteObject[] = [
  {
    element: <ProtectedRoleRoute allowedRoles={["staff"]} />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <Navigate to="products" replace /> },
          { path: "reports", element: <Report /> },
          { path: ":entity", element: <Dashboard /> },
          { path: ":entity/new", element: <EntityForm /> },
          {
            path: "orders/edit/:id",
            element: <Navigate to="/dashboard/orders" replace />,
          },
          { path: ":entity/edit/:id", element: <EntityForm /> },
        ],
      },
    ],
  },
];
