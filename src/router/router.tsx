import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "../layout/RootLayout";
import { AboutPage, HomePage, ProductPage, ProductsPage } from "../page";
import { LoginPage } from "../page/LoginPage";
import { RegisterPage } from "../page/RegisterPage";
import { ClientLayout } from "../layout/ClientLayout";
import { OrdersUserPage } from "../page/OrdersUserPage";
import { CheckoutPage } from "../page/CheckoutPage";
import { ThankYouPage } from "../page/ThankYouPage";
import { OrderUserPage } from "../page/OrderUserPage";
import { DashboardLayout } from "../layout/DashboardLayout";
import { DashboardProductsPage } from "../page/dashboard/DashboardProductsPage";
import { DashboardNewProductsPage } from "../page/dashboard/DashboardNewProductsPage";
import { DashboardProductSlugPage } from "../page/dashboard/DashboardProductSlugPage";
import { DashboardOrdersPage } from "../page/dashboard/DashboardOrdersPage";
import { DashboardOrderPage } from "../page/dashboard/DashboardOrderPage";
import { ProtectedRoute } from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "products",
        element: <ProductsPage />,
      },
      {
        path: "products/:slug",
        element: <ProductPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "account",
        element: <ProtectedRoute redirectTo="/login" />,
        children: [
          {
            element: <ClientLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="/account/pedidos" replace />,
              },
              {
                path: "pedidos",
                element: <OrdersUserPage />,
              },
              {
                path: "pedidos/:id",
                element: <OrderUserPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/checkout",
    element: <ProtectedRoute redirectTo="/login" />,
    children: [
      {
        index: true,
        element: <CheckoutPage />,
      },
      {
        path: ":id/thank-you",
        element: <ThankYouPage />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute redirectTo="/" role="admin" />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard/productos" replace />,
          },
          {
            path: "productos",
            element: <DashboardProductsPage />,
          },
          {
            path: "productos/new",
            element: <DashboardNewProductsPage />,
          },
          {
            path: "productos/edit/:slug",
            element: <DashboardProductSlugPage />,
          },
          {
            path: "ordenes",
            element: <DashboardOrdersPage />,
          },
          {
            path: "ordenes/:id",
            element: <DashboardOrderPage />,
          },
        ],
      },
    ],
  },
]);
