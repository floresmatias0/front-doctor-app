import PropTypes from 'prop-types'
import { Box, useColorModeValue, Flex, Center, Spinner } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import Navbar from "./navbar";
import { AppContext } from "./context";
import SidebarWithHeader from "./sidebar";
import SidebarMenu from "./sidebar-menu";
import { useContext } from 'react';

export const ProtectedRoutes = ({children}) => {
    const { user, isLoading } = useContext(AppContext)

    if (!user && isLoading) {
        return (
            <Box bg="#FFFFFF" w={["280px", "100%"]} h="100%" borderRadius="xl" boxShadow="md">
                <Center h="100%">
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Center>
            </Box>
        )
    }

    if(!user) {
        return <Navigate to="/iniciar-sesion" replace/>
    }

    return children
}

export const ProtectedRoutesAdmin = ({children}) => {
    const { user, isLoading } = useContext(AppContext)

    if (!user && isLoading) {
        return (
            <Box bg="#FFFFFF" w={["280px", "100%"]} h="100%" borderRadius="xl" boxShadow="md">
                <Center h="100%">
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Center>
            </Box>
        )
    }

    if(!user) 
        return <Navigate to="/iniciar-sesion" replace/>

    if(user && !user?.super) 
        return <Navigate to="/inicio" replace/>

    return children
}

export const LayoutWithNavbar = ({children}) => {
    return (
        <Flex bg={useColorModeValue('gray.50', 'gray.900')} w='100%' direction='column' minH="100vh">
            <Navbar/>
            <Box w='100%' flex='1' p={4}>
                {children}
            </Box>
        </Flex>
    )
}

export const LayoutWithSidebarAndHeader = ({children}) => {
    return (
        <SidebarWithHeader>
            {children}
        </SidebarWithHeader>
    )
}

export const LayoutWithSidebarAndFooter = ({children}) => {
    return (
        <SidebarMenu>
            {children}
        </SidebarMenu>
    )
}

LayoutWithSidebarAndFooter.propTypes = {
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

ProtectedRoutesAdmin.propTypes = {
    children: PropTypes.node,
}
