import * as React from "react";
import { ChakraProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import ErrorPage from "./components/error-page";
import { LayoutWithSidebarAndFooter, ProtectedRoutes, ProtectedRoutesAdmin, ProtectedRoutesPatient } from "./components/layouts";

import Appointment from "./views/appointment";
import Graphs from "./views/charts";
import History from "./views/history";
import Home from "./views/home";
import LandingHome from "./views/landing";
import Login from "./views/login";
import Patients from "./views/patients";
import PrivacyPolicies from "./views/privacy-policies";
import Settings from "./views/settings";
import TermsOfServices from "./views/terms-of-services";
import Turns from "./views/turns";
import Verify from "./views/verify";

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
  heading: `'Roboto', sans-serif`,
  body: `'Roboto', sans-serif`
}
const breakpoints = {
  sm: '30em',  // 480px
  md: '48em',  // 768px
  lg: '62em',  // 992px
  xl: '84em',  // 1280px
  '2xl': '96em', // 1536px
};

const theme = extendTheme({ colors, fonts, breakpoints });

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
    element: <LayoutWithSidebarAndFooter><ProtectedRoutes><Home /></ProtectedRoutes></LayoutWithSidebarAndFooter>,
    errorElement: <ErrorPage />,
  },
  {
    path: "turnos",
    element: <LayoutWithSidebarAndFooter><ProtectedRoutesPatient><Appointment /></ProtectedRoutesPatient></LayoutWithSidebarAndFooter>,
    errorElement: <ErrorPage />,
  },
  {
    path: "verificacion",
    element: <Verify />,
    errorElement: <ErrorPage />
  },
  {
    path: "iniciar-sesion",
    element: localStorage.getItem("authToken") ? <Navigate to="/inicio" replace /> : <Login handleLogin={handleLogin} />,
  },
  {
    path: "configuracion",
    element: <LayoutWithSidebarAndFooter><ProtectedRoutes><Settings /></ProtectedRoutes></LayoutWithSidebarAndFooter>,
    errorElement: <ErrorPage />,
  },
  {
    path: "historial-clinico",
    element: <LayoutWithSidebarAndFooter><ProtectedRoutes><History /></ProtectedRoutes></LayoutWithSidebarAndFooter>,
    errorElement: <ErrorPage />,
  },
  {
    path: "mis-turnos",
    element: <LayoutWithSidebarAndFooter><ProtectedRoutes><Turns /></ProtectedRoutes></LayoutWithSidebarAndFooter>,
    errorElement: <ErrorPage />,
  },
  {
    path: "mis-pacientes",
    element: <LayoutWithSidebarAndFooter><ProtectedRoutes><Patients /></ProtectedRoutes></LayoutWithSidebarAndFooter>,
    errorElement: <ErrorPage />,
  },
  {
    path: "administracion",
    element: <LayoutWithSidebarAndFooter><ProtectedRoutesAdmin><Graphs /></ProtectedRoutesAdmin></LayoutWithSidebarAndFooter>,
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
  <ChakraProvider theme={theme}>
    <RouterProvider router={router} />
  </ChakraProvider>
);