import PropTypes from 'prop-types'
import { Box, useColorModeValue, Flex } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import Navbar from "./navbar";
import DoctorContext from "./context";
import SidebarWithHeader from "./sidebar";
import SidebarMenu from "./sidebar-menu";

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

export const LayoutWithSidebar = ({children}) => {
    return (
        <Flex bg="#E5F2FA">
            <SidebarMenu/>
            <Box h="100vh" w="100%" flex={1} py={[4, 4, 4, 12]} mx={[24, 28]}>
                {children}
            </Box>
        </Flex>
    )
}

LayoutWithSidebar.propTypes = {
    children: PropTypes.node,
}

LayoutWithSidebarAndHeader.propTypes = {
    children: PropTypes.node,
}

LayoutWithNavbar.propTypes = {
    children: PropTypes.node,
}

ProtectedRoutes.propTypes = {
    children: PropTypes.node,
}
