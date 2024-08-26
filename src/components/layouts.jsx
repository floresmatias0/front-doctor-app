import PropTypes from 'prop-types'
import { Box, Center, Spinner } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { AppContext } from "./context";
import SidebarWithHeader from "./sidebar";
import SidebarMenu from "./sidebar-menu";
import { useContext } from 'react';

export const ProtectedRoutes = ({children}) => {
    const { user, isLoading } = useContext(AppContext)

    if (!user && isLoading) {
        return (
            <Center h="full" w="full">
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </Center>
        )
    }

    if(!user) {
        return <Navigate to="/iniciar-sesion" replace/>
    }

    return children
}

export const ProtectedRoutesPatient = ({children}) => {
    const { user, isLoading } = useContext(AppContext)

    if (!user && isLoading) {
        return (
            <Center h="full" w="full">
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </Center>
        )
    }

    if(!user) {
        return <Navigate to="/iniciar-sesion" replace/>
    }

    if(user && user?.role !== 'PACIENTE')
        return <Navigate to="/inicio" replace/>
     
    return children
}

export const ProtectedRoutesAdmin = ({children}) => {
    const { user, isLoading } = useContext(AppContext)

    if (!user && isLoading) {
        return (
            <Center h="full" w="full">
                <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='blue.500'
                    size='xl'
                />
            </Center>
        )
    }

    if(!user) 
        return <Navigate to="/iniciar-sesion" replace/>

    if(user && user?.role !== 'ADMIN') 
        return <Navigate to="/inicio" replace/>

    return children
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

ProtectedRoutes.propTypes = {
    children: PropTypes.node,
}

ProtectedRoutesAdmin.propTypes = {
    children: PropTypes.node,
}
