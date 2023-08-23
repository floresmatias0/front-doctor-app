import { Box, useColorModeValue } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import Navbar from "./navbar";

export const ProtectedRoutes = ({children}) => {
    const userStorage = localStorage.getItem("user")

    if(userStorage) {
      return children
    }
  
    return <Navigate to="/login" replace/>
}

export const Layout = ({children}) => {
    return (
        <Box bg={useColorModeValue('white.100', 'gray.900')} w='100%'>
            <Navbar/>
            <Box w='100%' p={4} bg={useColorModeValue('gray.50', 'gray.900')}>{children}</Box>
        </Box>
    )
}