import * as React from "react";
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

/* existing imports */
import ErrorPage from "./components/error-page";
import { LayoutWithNavbar, LayoutWithSidebar, ProtectedRoutes } from "./components/layouts";

import Login from "./routes/login";
import Verify from "./routes/verify";
import Profile from "./routes/profile";
import Home from "./routes/home";
import Appointment from "./routes/appointment";

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })

const handleLogin = () => window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google/?role=PATIENT`, "_self");
const handleLoginAdmin = () => window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google/?role=DOCTOR`, "_self");

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoutes><LayoutWithSidebar><Home /></LayoutWithSidebar></ProtectedRoutes>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/appointment",
    element: <ProtectedRoutes><LayoutWithSidebar><Appointment /></LayoutWithSidebar></ProtectedRoutes>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/verify",
    element: <Verify />,
    errorElement: <ErrorPage />
  },
  {
    path: "login",
    element: localStorage.getItem("user") ? <Navigate to="/" replace/> : <Login handleLogin={handleLogin}/>,
  },
  {
    path: "admin",
    element: localStorage.getItem("user") ? <Navigate to="/" replace/> : <Login handleLogin={handleLoginAdmin}/>,
  },
  {
    path: "/profile",
    element: <ProtectedRoutes><LayoutWithNavbar><Profile /></LayoutWithNavbar></ProtectedRoutes>,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);