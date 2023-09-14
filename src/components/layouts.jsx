import { Box, useColorModeValue, Flex } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import Navbar from "./navbar";
import DoctorContext from "./context";
import SidebarWithHeader from "./sidebar";

export const ProtectedRoutes = ({children}) => {
    const userStorage = localStorage.getItem("user")

    if(userStorage) {
      return children
    }
  
    return <Navigate to="/login" replace/>
}

export const LayoutWithNavbar = ({children}) => {
    return (
        <Flex bg={useColorModeValue('gray.50', 'gray.900')} w='100%' direction='column' minH="100vh">
            <DoctorContext>
                <Navbar/>
                <Box w='100%' flex='1' p={4}>
                    {children}
                </Box>
            </DoctorContext>
        </Flex>
    )
}

export const LayoutWithSidebarAndHeader = ({children}) => {
    return (
        <DoctorContext>
            <SidebarWithHeader>
                {children}
            </SidebarWithHeader>
        </DoctorContext>
    )
}