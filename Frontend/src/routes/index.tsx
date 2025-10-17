import { type RouteObject, useRoutes } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/User/Login";
import ProductList from "../pages/Product/ProductList";
import ProductDetail from "../pages/Product/ProductDetail";
import Register from "../pages/User/Register";
import AuthSuccess from "../pages/User/AuthSuccess";
import { dashboardRoutes } from "./dashboardRoutes";

export const AppRoutes = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "login/success", element: <AuthSuccess /> },
        { path: "products", element: <ProductList /> },
        { path: "products/:id", element: <ProductDetail /> },
      ],
    },
    ...dashboardRoutes,
  ];

  return useRoutes(routes);
};
