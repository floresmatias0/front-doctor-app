import * as React from "react";
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import DoctorContext from "./components/context";
import ErrorPage from "./components/error-page";
import { LayoutWithSidebar, ProtectedRoutes, ProtectedRoutesAdmin } from "./components/layouts";

import Login from "./views/login";
import Verify from "./views/verify";
import Home from "./views/home";
import Appointment from "./views/appointment";
import Settings from "./views/settings";
import History from "./views/history";
import PrivacyPolicies from "./views/privacy-policies";
import TermsOfServices from "./views/terms-of-services";
import Turns from "./views/turns";
import Upgrade from "./views/upgrade";
import Graphs from "./views/charts";
import LandingHome from "./views/landing";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './styles/main.css';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
  gray: {
    200: '#DCDCDC'
  }
}

const fonts = {
  heading: 'Roboto'
}

const theme = extendTheme({ colors, fonts });

const handleLogin = (role) => {
  window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google/?role=${role}`, "_self");
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingHome/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "inicio",
    element: <LayoutWithSidebar><ProtectedRoutes><Home /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "turnos",
    element: <LayoutWithSidebar><ProtectedRoutes><Appointment /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "verificacion",
    element: <Verify />,
    errorElement: <ErrorPage />
  },
  {
    path: "iniciar-sesion",
    element: localStorage.getItem("user") ? <Navigate to="/inicio" replace /> : <Login handleLogin={handleLogin} />,
  },
  {
    path: "configuracion",
    element: <LayoutWithSidebar><ProtectedRoutes><Settings /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "historial-clinico",
    element: <LayoutWithSidebar><ProtectedRoutes><History /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "mis-turnos",
    element: <LayoutWithSidebar><ProtectedRoutes><Turns /></ProtectedRoutes></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "mejora-de-usuario",
    element: <LayoutWithSidebar><ProtectedRoutesAdmin><Upgrade /></ProtectedRoutesAdmin></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "graficos",
    element: <LayoutWithSidebar><ProtectedRoutesAdmin><Graphs /></ProtectedRoutesAdmin></LayoutWithSidebar>,
    errorElement: <ErrorPage />,
  },
  {
    path: "politica-de-privacidad",
    element: <PrivacyPolicies />,
  },
  {
    path: "condiciones-del-servicio",
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