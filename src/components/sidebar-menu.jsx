import { Box, Button, Center, Flex, Link, Text } from '@chakra-ui/react'
import { useContext, useState } from 'react'
import { AiOutlineCalendar, AiOutlineHistory, AiOutlineSetting, AiOutlinePieChart } from 'react-icons/ai'
import { BiHomeAlt } from 'react-icons/bi'
import { TbStethoscope } from 'react-icons/tb'
import { MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { RiLogoutBoxLine } from 'react-icons/ri'
import { AppContext } from './context'

import '../styles/sidebarmenu.css';

const receiveMenu = (isOpen, admin) => {
    const icons = [
        {
            icon: <BiHomeAlt color='#205583' title="Home" className={isOpen ? "fade-in-text" : ""} style={{ width: "24px", height: "24px" }}/>,
            title: "Home",
            href: "/"
        },
        {
            icon: <AiOutlineHistory color='#205583' title="Historial" className={isOpen ? "fade-in-text" : ""} style={{ width: "24px", height: "24px" }}/>,
            title: "Historial",
            href: "/historial"
        },
        {
            icon: <AiOutlineCalendar color='#205583' title="Mis turnos" className={isOpen ? "fade-in-text" : ""} style={{ width: "24px", height: "24px" }}/>,
            title: "Mis turnos",
            href: "/mis-turnos"
        },
        {
            icon: <AiOutlineSetting color='#205583' title="Ajustes" className={isOpen ? "fade-in-text" : ""} style={{ width: "24px", height: "24px" }}/>,
            title: "Ajustes",
            href: "/configuracion"
        },
        {
            icon: <AiOutlinePieChart color='#205583' title="Graficos" className={isOpen ? "fade-in-text" : ""} style={{ width: "24px", height: "24px" }}/>,
            title: "Graficos",
            href: "/graficos"
        }
    ]

    if(!admin) {
        icons.pop()
    }

    return icons
}

const SidebarMenu = () => {
    const { user } = useContext(AppContext)
    const [isOpen, setIsOpen] = useState(false)

    const handleOpen = () => setIsOpen(!isOpen)

    const sliderTransform = isOpen ? 'translateX(0)' : 'translateX(-120px)'
    const sliderTransformIcons = isOpen ? 'translateX(0)' : 'translateX(100px)'
    
    const menuItems = receiveMenu(isOpen, user?.super);

    const logout = () => {
        localStorage.removeItem("user");
        window.location.href = `${
          import.meta.env.VITE_BACKEND_URL
        }/auth/google/logout`;
    };

    return (
        <Box zIndex={5} bg='#FCFEFF' w="200px" boxShadow='md' p={4} position="absolute" top="0" left="0" h="100vh" borderRightRadius="lg" style={{ transform: sliderTransform, transition: 'transform 0.3s ease-in-out' }}>
            <Box w="100%" h="100%" position="relative">
                <Flex borderRadius="full" bg="#FCFEFF" w="36px" h="36px" position="absolute" top="10" right="-30" justifyContent="center" alignItems="center" boxShadow='xl'>
                    <Button p={0} m={0} h="100%" borderRadius="full" zIndex={10} onClick={handleOpen}>
                        <MdOutlineKeyboardArrowRight color='#205583' style={isOpen ? { transform: "rotate(180deg)", transition: "rotate(0deg)", width: "24px", height: "24px" } : { width: "24px", height: "24px" }}/>
                    </Button>
                </Flex>
                <Flex flexDirection="column" justifyContent="space-between" w={isOpen ? "100%" : "80px"}h="100%" style={{ transform: sliderTransformIcons, transition: 'transform 0.3s ease-in-out' }}>
                    <Center gap={2}>
                        <TbStethoscope color='#205583' className={isOpen ? "fade-in-text" : ""} style={{ width: "40px", height: "40px" }}/>
                        <Text className="fade-in-text" display={isOpen ? 'block' : 'none'} w="80px" fontSize='sm' color='#205583' style={{ fontWeight: 'bold', lineHeight: 'normal' }}>Atención pediátrica online</Text>
                    </Center>
                    <Center flexDirection="column" gap={5}>
                        {menuItems?.map((item, idx) => (
                            <Link key={idx} href={item.href}>
                                <Flex gap={2} alignItems="center" justifyContent="center">
                                    {item.icon}
                                    <Text className="fade-in-text" display={isOpen ? 'block' : 'none'} w="80px" fontSize='sm' color='#205583' style={{ fontWeight: 'bold', lineHeight: 'normal' }}>{item.title}</Text>
                                </Flex>
                            </Link>
                        ))}
                    </Center>
                    <Center>
                        <Button onClick={logout} bg="transparent">
                            <Flex gap={2}>
                                <RiLogoutBoxLine color='#205583' title="Cerrar sesión" className={isOpen ? "fade-in-text" : ""} style={{ width: "24px", height: "24px" }}/>
                                <Text className="fade-in-text" display={isOpen ? 'block' : 'none'} w="96px" fontSize='sm' color='#205583' style={{ fontWeight: 'bold', lineHeight: 'normal', opacity: isOpen ? 1 : 0, transition: 'opacity 0.3s ease-in-out' }}>Cerrar sesión</Text>
                            </Flex>
                        </Button>
                    </Center>
                </Flex>
            </Box>
        </Box>
    )
}

export default SidebarMenu