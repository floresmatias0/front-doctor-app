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
import { LayoutWithSidebar, ProtectedRoutes, ProtectedRoutesAdmin } from "./components/layouts";

import Login from "./views/login";
import Verify from "./views/verify";
import Home from "./views/home";
import Appointment from "./views/appointment";
import Settings from "./views/settings";
import './styles/main.css';
import DoctorContext from "./components/context";
import History from "./views/history";
import PrivacyPolicies from "./views/privacy-policies";
import TermsOfServices from "./views/terms-of-services";
import Turns from "./views/turns";
import Upgrade from "./views/upgrade";
import Graphs from "./views/charts";

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ 
  colors,
})

const handleLogin = () => window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google/?role=PATIENT`, "_self");
const handleLoginAdmin = () => window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google/?role=DOCTOR`, "_self");

const router = createBrowserRouter([
  {
    path: "/",
    element: <LayoutWithSidebar><ProtectedRoutes><Home /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "appointment",
    element: <LayoutWithSidebar><ProtectedRoutes><Appointment /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "verify",
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
    path: "settings",
    element: <LayoutWithSidebar><ProtectedRoutes><Settings /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "history",
    element: <LayoutWithSidebar><ProtectedRoutes><History /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "my-turns",
    element: <LayoutWithSidebar><ProtectedRoutes><Turns /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "upgrade-user",
    element: <LayoutWithSidebar><ProtectedRoutesAdmin><Upgrade /></ProtectedRoutesAdmin></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "graphs",
    element: <LayoutWithSidebar><ProtectedRoutesAdmin><Graphs /></ProtectedRoutesAdmin></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "privacy-policies",
    element: <PrivacyPolicies />,
  },
  {
    path: "terms-of-services",
    element: <TermsOfServices />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <DoctorContext>
        <RouterProvider router={router} />
      </DoctorContext>
    </ChakraProvider>
  </React.StrictMode>
);