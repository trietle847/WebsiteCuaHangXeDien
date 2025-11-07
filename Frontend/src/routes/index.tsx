import { type RouteObject, useRoutes } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home";
import Login from "../pages/User/Login";
import ProductList from "../pages/Product/ProductList";
import ProductDetail from "../pages/Product/ProductDetail";
import Register from "../pages/User/Register";
import AuthSuccess from "../pages/User/AuthSuccess";
import Profile from "../pages/User/Profile/Profile";
import Service from "../pages/Service/ServiceHome";
import Repair from "../pages/Service/RepairService/RepairSchedule";
import Request from "../pages/User/Request";
import ForgetPassword from "../pages/User/ForgetPassword";
import { dashboardRoutes } from "./dashboardRoutes";
import ProtectedLoginRoute from "../components/ProtectedLoginRoute";
import CartPage from "../pages/Cart/CartPage";

export const AppRoutes = () => {
  const routes: RouteObject[] = [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "profile", element: <Profile /> },
        { path: "login/success", element: <AuthSuccess /> },

        { path: "cart", element: <CartPage /> },
        { path: "products/:id", element: <ProductDetail /> },

        { path: "products", element: <ProductList /> },
        { path: "services", element: <Service /> },
        { path: "services/repair", element: <Repair /> },
      ],
    },
    // Các phần này thuộc về Auth thường không cần header/footer chung
    {
      element: <ProtectedLoginRoute />,
      children: [
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "login/success", element: <AuthSuccess /> },
        { path: "request", element: <Request /> },
        { path: "forget-password", element: <ForgetPassword /> },
      ],
    },
    ...dashboardRoutes,
  ];

  return useRoutes(routes);
};
