import {
  Box,
  Button,
  Center,
  Flex,
  Link,
  Text,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import {
  AiOutlineCalendar,
  AiOutlineHistory,
  AiOutlineSetting,
  AiOutlinePieChart,
} from "react-icons/ai";
import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { AppContext } from "./context";

import "../styles/sidebarmenu.css";
import { Footer } from "./footer";
import { LogoCustom } from "./extras";

const receiveMenu = (isOpen, admin) => {
  const icons = [
    {
      icon: (
        <BiHomeAlt
          color="#104DBA"
          title="Home"
          className={isOpen ? "fade-in-text" : ""}
          style={{ width: "24px", height: "24px" }}
        />
      ),
      title: "Home",
      href: "/inicio",
    },
    {
      icon: (
        <AiOutlineCalendar
          color="#104DBA"
          title="Mis turnos"
          className={isOpen ? "fade-in-text" : ""}
          style={{ width: "24px", height: "24px" }}
        />
      ),
      title: "Nuevo turno",
      href: "/turnos",
    },
    {
      icon: (
        <AiOutlineHistory
          color="#104DBA"
          title="Historial"
          className={isOpen ? "fade-in-text" : ""}
          style={{ width: "24px", height: "24px" }}
        />
      ),
      title: "Historial",
      href: "/historial-clinico",
    },
    {
      icon: (
        <AiOutlineSetting
          color="#104DBA"
          title="Ajustes"
          className={isOpen ? "fade-in-text" : ""}
          style={{ width: "24px", height: "24px" }}
        />
      ),
      title: "Ajustes",
      href: "/configuracion",
    },
    {
      icon: (
        <AiOutlinePieChart
          color="#104DBA"
          title="Graficos"
          className={isOpen ? "fade-in-text" : ""}
          style={{ width: "24px", height: "24px" }}
        />
      ),
      title: "Graficos",
      href: "/graficos",
    },
  ];

  if (!admin) {
    icons.pop();
  }

  return icons;
};

const SidebarMenu = ({ children }) => {
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(true);

  const handleOpen = () => setIsOpen(!isOpen);

  const menuItems = receiveMenu(isOpen, user?.super);

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = `${
      import.meta.env.VITE_BACKEND_URL
    }/auth/google/logout`;
  };

  const path = window.location.pathname

  return (
    <Box w="100%" h="100vh" position="relative">
      <Box
        zIndex={5}
        bg="#FFFFFF"
        w={isOpen ? "155px" : "60px"}
        boxShadow="5px 6px 6px -1px #00000014"
        p={2}
        position="absolute"
        top="0"
        left="0"
        bottom="80px"
      >
        <Box w="100%" h="100%" position="relative">
          <Flex
            borderRadius="full"
            bgColor="#104DBA"
            w="30px"
            h="30px"
            position="absolute"
            top="40px"
            right="-25px"
            justifyContent="center"
            alignItems="center"
            boxShadow="2xl"
            onClick={handleOpen}
            cursor='pointer'
          >
            <MdOutlineKeyboardArrowRight
              color="#FFF"
              style={
                isOpen
                  ? {
                      transform: "rotate(180deg)",
                      transition: "rotate(0deg)",
                      width: "16px",
                      height: "16px",
                    }
                  : { width: "16px", height: "16px" }
              }
            />
          </Flex>
          <Flex
            flexDirection="column"
            justifyContent="space-between"
            w="100%"
            h="100%"
          >
            <Flex justifyContent="center" align="center">
              <LogoCustom
                flexDirection="column"
                displayText={isOpen ? "inline-block" : "none"}
                maxTitleWidth={isOpen ? "75px" : "50px"}
                maxSvgWidth={isOpen ? "66px" : "50px"}
              />
            </Flex>
            <Center flexDirection="column" gap={5}>
              {menuItems?.map((item, idx) => (
                <Link key={idx} href={item.href} _hover={{ textDecoration: "none" }}>
                  <Flex gap={2} alignItems="center" justifyContent="center">
                    {item.icon}
                    <Text
                      className="fade-in-text"
                      display={isOpen ? "block" : "none"}
                      w="80px"
                      fontSize="sm"
                      color={path === item.href ? "#104DBA" : "#474747"}
                      fontWeight={400}
                      lineHeight="23.44px"
                      _hover={{ color: "#104DBA" }}
                    >
                      {item.title}
                    </Text>
                  </Flex>
                </Link>
              ))}
            </Center>
            <Center>
              <Flex gap={2} onClick={logout} w="full" justifyContent="space-around">
                <RiLogoutBoxLine
                  color="#104DBA"
                  title="Cerrar sesión"
                  className={isOpen ? "fade-in-text" : ""}
                  style={{ width: "24px", height: "24px", cursor: "pointer" }}
                />
                <Text
                  className="fade-in-text"
                  display={isOpen ? "block" : "none"}
                  w="90px"
                  fontSize="sm"
                  color="#474747"
                  fontWeight={400}
                  lineHeight="23.44px"
                  cursor="pointer"
                >
                  Cerrar sesión
                </Text>
              </Flex>
            </Center>
          </Flex>
        </Box>
      </Box>
      <Flex 
        h="calc(100% - 80px)"
        w="full"
        justifyContent={['flex-end', isOpen ? 'flex-end' : 'center']}
        alignItems="center"
        px={4}
        bgColor="#FFFFFF"
      >
        {children}
      </Flex>
      <Footer
        styles={{ position: "absolute", bottom: 0, left: 0, margin: 0 }}
      />
    </Box>
  );
};

export default SidebarMenu;
