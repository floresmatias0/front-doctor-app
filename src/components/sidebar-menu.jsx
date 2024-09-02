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
  AiOutlineUser,
  AiOutlineHome
} from "react-icons/ai";
import { MdOutlineAdminPanelSettings, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { IoIosArrowForward } from "react-icons/io";
import { AppContext } from "./context";
import { Footer } from "./footer";
import { LogoCustom } from "./extras";
import { FaXmark } from "react-icons/fa6";

import "../styles/sidebarmenu.css";

const receiveMenu = (isOpen, color="#104DBA", width="20px", height="20px", role="PACIENTE", isMobile=false) => {
    const path = window.location.pathname
    const iconsMobile = [
      {
        icon: (
          <AiOutlineHome
            color={path === "/inicio" && isMobile ? "#FFF" : color}
            title="Home"
            className={isOpen ? "fade-in-text" : ""}
            style={{ width, height }}
          />
        ),
        title: "Home",
        href: "/inicio",
      },
      {
        icon: (
          <AiOutlineCalendar
            color={path === "/turnos" && isMobile ? "#FFF" : color}
            title="Nuevo turno"
            className={isOpen ? "fade-in-text" : ""}
            style={{ width, height }}
          />
        ),
        title: "Nuevo turno",
        href: "/turnos",
      },
      {
        icon: (
          <AiOutlineHistory
            color={path === "/historial-clinico" && isMobile ? "#FFF" : color}
            title="Historial clinico"
            className={isOpen ? "fade-in-text" : ""}
            style={{ width, height }}
          />
        ),
        title: "Historial",
        href: "/historial-clinico",
      },
      {
        icon: (
          <AiOutlineHistory
            color={path === "/mis-turnos" && isMobile ? "#FFF" : color}
            title="Mis turnos"
            className={isOpen ? "fade-in-text" : ""}
            style={{ width, height }}
          />
        ),
        title: "Mis turnos",
        href: "/mis-turnos",
      },
      {
        icon: (
          <AiOutlineUser
            color={path === "/mis-pacientes" && isMobile ? "#FFF" : color}
            title="Mis pacientes"
            className={isOpen ? "fade-in-text" : ""}
            style={{ width, height }}
          />
        ),
        title: "Pacientes",
        href: "/mis-pacientes",
      },
      {
        icon: (
          <AiOutlineSetting
            color={path === "/configuracion" && isMobile ? "#FFF" : color}
            title="Ajustes"
            className={isOpen ? "fade-in-text" : ""}
            style={{ width, height }}
          />
        ),
        title: "Ajustes",
        href: "/configuracion",
      },
      {
        icon: (
          <MdOutlineAdminPanelSettings
            color={path === "/administracion" && isMobile ? "#FFF" : color}
            title="Administración"
            className={isOpen ? "fade-in-text" : ""}
            style={{ width, height }}
          />
        ),
        title: "Admin",
        href: "/administracion",
      }
    ];

    if(role === "PACIENTE") {
      iconsMobile.splice(3, 2)
      iconsMobile.splice(4, 1)
    }

    if(role === "DOCTOR") {
      iconsMobile.splice(1, 1)
      iconsMobile.splice(1, 1)
      iconsMobile.splice(4, 1)
    }

    if(role === "ADMIN") {
      iconsMobile.splice(1, 1)
      iconsMobile.splice(1, 1)
    }

    return iconsMobile;
};

const SidebarMenu = ({ children }) => {
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(true);
  const [isOpenMobileMenu, setIsOpenMobileMenu] = useState(false);

  const handleOpen = () => setIsOpen(!isOpen);

  const menuItems = receiveMenu(isOpen, "#104DBA", "20px", "20px", user?.role);
  const menuMobileItems = receiveMenu(isOpen, "#104DBA", "24px", "24px", user?.role, true);

  const logout = () => {
    localStorage?.removeItem("user");
    localStorage?.removeItem("authToken");
    window.location.href = `${
      import.meta.env.VITE_BACKEND_URL
    }/auth/google/logout`;
  };

  const path = window.location.pathname

  return (
    <Box w="100%" h="100vh" position="relative">
      {/* SIDE DESKTOP */}
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
        display={["none", "block"]}
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
            <Flex justifyContent="center" align="center" flexDirection="column" gap={10}>
              <LogoCustom
                flexDirection="column"
                displayText={isOpen ? "inline-block" : "none"}
                maxTitleWidth={isOpen ? "75px" : "50px"}
                maxSvgWidth={isOpen ? "66px" : "50px"}
              />
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
            </Flex>
            <Center>
              <Flex gap={2} onClick={logout} w="full" justifyContent="center">
                <RiLogoutBoxLine
                  color="#104DBA"
                  title="Cerrar sesión"
                  className={isOpen ? "fade-in-text" : ""}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
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
      {/* NAV MOBILE */}
      <Box
        zIndex={5}
        bg="#FFFFFF"
        boxShadow="5px 6px 6px -1px #00000014"
        display={["flex", "none"]}
        py={2}
        px={4}
        position="sticky"
        top="0"
        left="0"
        w="full"
        h="60px"
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex alignItems="center" gap={2}>
          <Text fontSize="lg" lineHeight="18.75px" fontWeight={400} color="#104DBA">Hola, {user?.firstName}</Text>
          <Button
            variant="unstyled"
            onClick={() => setIsOpenMobileMenu(!isOpenMobileMenu)}
          >
            <IoIosArrowForward color="#104DBA"/>
          </Button>
        </Flex>
        <LogoCustom
          flexDirection="row"
          displayText="inline-block"
          maxTitleWidth="75px"
          maxSvgWidth="66px"
        />
      </Box>
      {/* CONTENIDO */}
      <Flex 
        h={["calc(100% - 120px)", "calc(100% - 80px)"]}
        w="full"
        justifyContent={['center', isOpen ? 'flex-end' : 'center']}
        alignItems="center"
        px={4}
        bgColor="#FFFFFF"
        transform={["inherit", "inherit"]}
        py={4}
      >
        {children}
      </Flex>
      {/* FOOTER DESKTOP */}
      <Footer
        styles={{ position: "absolute", bottom: 0, left: 0, margin: 0 }}
        display={["none", "block"]}
      />
      {/* FOOTER MOBILE */}
      <Flex
        zIndex={5}
        bg="#FFFFFF"
        boxShadow="0px -1px 4px 0px #00000040"
        display={["flex", "none"]}
        position="sticky"
        bottom="0"
        left="0"
        w="full"
        h="60px"
        justifyContent="center"
        alignItems="center"
        sx={{
          justifyContent: '-webkit-center',
          alignItems: '-webkit-center'
        }}
      >
        {menuMobileItems?.map((item, idx) => (
          <Link key={idx} href={item.href} _hover={{ textDecoration: "none" }} w="25%" h="full" alignContent="center" bg={path === item.href ? "#104DBA" : "#FFF"}>
            <Flex alignItems="center" justifyContent="center">
              {item.icon}
            </Flex>
          </Link>
        ))}
      </Flex>
      {isOpenMobileMenu && (
        <Flex
          w="full"
          h="full"
          zIndex={6}
          bgColor="white"
          flexDirection="column"
          display={["inline-block", "none"]}
          position="absolute"
          top={0}
          left={0}
          overflow="hidden"
        >
          <Box w="full" boxShadow="0px 2.85px 2.85px 0px #00000014">
            <Button
              bgColor="transparent"
              onClick={() => setIsOpenMobileMenu(false)}
              float="right"
              _active={{ backgroundColor: 'transparent' }}
              _hover={{ backgroundColor: 'transparent' }}
            >
              <Box bgColor="#104DBA" borderRadius='full'>
                <FaXmark
                  style={{
                    color: "#FFF",
                    width: "18px",
                    height: "18px",
                    padding: "2px",
                  }}
                />
              </Box>
            </Button>
            <Box display="inline-block" w="full" mx={10} mb={6}>
              <LogoCustom
                theme="light"
                svgWidth="74px"
                svgHeight="42px"
                titleWidth="78px"
                titleLineHeight="18px"
                titleSize="sm"
              />
            </Box>
          </Box>
          <Flex flexDirection="column" gap={3} px={8} pt={4}>
            <Box
              bgColor="transparent"
              onClick={() => handleRefFocus(refServices)}
            >
              <Text fontSize="14px" color="#474747">
                ayuda@zonamed.com.ar
              </Text>
            </Box>
            <Box
              bgColor="transparent"
              onClick={() => handleRefFocus(refHowWork)}
            >
              <Link href="/condiciones-del-servicio" _hover={{ textDecoration: "none" }}>
                <Text fontSize="14px" color="#474747">
                  Términos y condiciones  
                </Text>
              </Link>
            </Box>
            <Box bgColor="transparent" onClick={() => handleRefFocus(refWhoUs)}>
              <Text fontSize="14px" color="#474747">
                © 2024 ZonaMed
              </Text>
              <Text fontSize="14px" color="#474747">
                Todos los derechos reservados
              </Text>
            </Box>
            <Box bgColor="transparent" onClick={() => handleRefFocus(refWhoUs)}>
              <Text fontSize="14px" color="#474747">
                Tecnología desarrollada por 
                <Link href="https://merliteam.com" _hover={{ textDecoration: "none" }}>
                  <Text fontSize="14px" color="#474747">
                    merliteam.com 
                  </Text>
                </Link>
              </Text>
            </Box>
            <Box
              bgColor="transparent"
            >
              <Flex gap={2} onClick={logout} w="full" justifyContent="flex-start">
                <RiLogoutBoxLine
                  color="#104DBA"
                  title="Cerrar sesión"
                  className={isOpen ? "fade-in-text" : ""}
                  style={{ width: "20px", height: "20px", cursor: "pointer" }}
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
                  _hover={{ textDecoration: "underline" }}
                >
                  Cerrar sesión
                </Text>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default SidebarMenu;
