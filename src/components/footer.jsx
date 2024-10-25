import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { LogoCustom } from "./extras";
import { BiLogoLinkedin } from "react-icons/bi";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export const FooterLanding = ({ styles = {} }) => {
  return (
    <Flex 
      w="full" 
      py={3} 
      mt={20} 
      bgColor="#104DBA" 
      style={styles}>
      <Container maxW="full" px={[4, 6, 8]}>
        <Flex
          display={["none", "none", "flex"]}
          flexDirection={["column", "column", "column", "row"]}
          justifyContent="space-between"
        >
          <Box alignContent="center">
            <Box maxH={["auto", "42px"]}>
              <LogoCustom theme="white" />
            </Box>
          </Box>

          <Box>
            <Flex gap={2} mt={5} justifyContent={["start", "end"]}>
              <Link href="https://facebook.com" target="__blank">
                <Box
                  w={["15px", "15px", "20px", "20px"]}
                  h={["15px", "15px", "20px", "20px"]}
                  borderRadius="50%"
                  bgColor="white"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  _hover={{ backgroundColor: "#F5F5F5" }}
                >
                  <FaFacebookF className="icon-responsive-v2" />
                </Box>
              </Link>
              <Link href="https://linkedin.com" target="__blank">
                <Box
                  w={["15px", "15px", "20px", "20px"]}
                  h={["15px", "15px", "20px", "20px"]}
                  borderRadius="50%"
                  bgColor="white"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  _hover={{ backgroundColor: "#F5F5F5" }}
                >
                  <BiLogoLinkedin className="icon-responsive-v2" />
                </Box>
              </Link>
              <Link href="https://instagram.com" target="__blank">
                <Box
                  w={["15px", "15px", "20px", "20px"]}
                  h={["15px", "15px", "20px", "20px"]}
                  borderRadius="50%"
                  bgColor="white"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  _hover={{ backgroundColor: "#F5F5F5" }}
                >
                  <FaInstagram className="icon-responsive-v2" />
                </Box>
              </Link>
            </Flex>

            <Text
              fontSize={["xs", "sm"]}
              align={["left", "right"]}
              color="white"
              fontWeight="400"
              lineHeight={["12px", "16px"]}
              mt={3}
            >
              ayuda@zonamed.com.ar
            </Text>
            <Text
              fontSize={["xs", "sm"]}
              align={["left", "right"]}
              color="white"
              fontWeight="400"
              lineHeight={["12px", "16px"]}
              mt={4}
            >
              © 2024 ZonaMed – Todos los derechos reservados
            </Text>
            <Text
              fontSize={["xs", "sm"]}
              align={["left", "right"]}
              color="white"
              fontWeight="400"
              lineHeight={["12px", "16px"]}
              alignContent="center"
            >
              <Link
                href="https://zonamed.com.ar/politica-de-privacidad"
                target="__blank"
                fontSize={["xs", "sm"]}
                color="white"
                my={4}
              >
                Política de privacidad
              </Link>
            </Text>
          </Box>
        </Flex>

        {/* Footer para pantallas móviles */}
        <Flex
          display={["flex", "flex", "none"]}
          flexDirection="column"
          alignItems="center"
          textAlign="center"
        >
          <Text 
            fontSize="2xl"
            fontWeight="bold" 
            color="white" 
            mb={4}
          >
            Zona Med
          </Text>

          <Flex gap={4} mb={4}>
            <Link href="https://linkedin.com" target="__blank">
              <Box
                w="30px"
                h="30px"
                borderRadius="50%"
                bgColor="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                _hover={{ backgroundColor: "#F5F5F5" }}
              >
                <BiLogoLinkedin />
              </Box>
            </Link>
            <Link href="https://instagram.com" target="__blank">
              <Box
                w="30px"
                h="30px"
                borderRadius="50%"
                bgColor="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                _hover={{ backgroundColor: "#F5F5F5" }}
              >
                <FaInstagram />
              </Box>
            </Link>
            <Link href="https://facebook.com" target="__blank">
              <Box
                w="30px"
                h="30px"
                borderRadius="50%"
                bgColor="white"
                display="flex"
                justifyContent="center"
                alignItems="center"
                _hover={{ backgroundColor: "#F5F5F5" }}
              >
                <FaFacebookF />
              </Box>
            </Link>
          </Flex>

          <Text fontSize="xs" color="white" mt={2}>
            ayuda@zonamed.com.ar
          </Text>
          <Text fontSize="xs" color="white" mt={2}>
            © 2024 ZonaMed – Todos los derechos reservados
          </Text>
          <Text fontSize="xs" color="white" mt={2}>
            <Link href="https://zonamed.com.ar/politica-de-privacidad" target="__blank">
              Política de privacidad
            </Link>
          </Text>
        </Flex>

        <Text
          fontSize={["xs", "sm"]}
          align="center"
          color="white"
          fontWeight="400"
          lineHeight={["12px", "16px"]}
          alignContent="center"
          marginTop={[3, 0]}
        >
          Tecnología desarrollada por{" "}
          <Link href="https://merliteam.com" target="__blank" fontWeight="bold" _hover={{ color: "white" }}>
            merliteam.com
          </Link>
        </Text>
      </Container>
    </Flex>
  );
};


export const Footer = ({styles = {}, display}) => {
  return (
    <Flex
      w="full"
      h='80px'
      py={3}
      bgColor="#104DBA"
      style={styles}
      display={display}
    >
      <Container maxW="container.2xl" h='full'>
        <Flex
          flexDirection={["column", "column", "column", "row"]}
          justifyContent="space-between"
          h='full'
          position='relative'
        >
          <Box h='full' alignContent='center'>
            <Link href="/condiciones-del-servicio" _hover={{ textDecoration: "none" }}>
              <Text
                fontSize={["xs", "sm"]}
                align="left"
                color="white"
                fontWeight="400"
                lineHeight={["12px", "16px"]}
                alignContent='center'
              >
                Términos y Condiciones
              </Text>
            </Link>
            <Text
              fontSize={["xs", "sm"]}
              align={["left", "right"]}
              color="white"
              fontWeight="400"
              lineHeight={["12px", "16px"]}
              alignContent='center'
            >
              ayuda@zonamed.com.ar
            </Text>
          </Box>
          <Text
            fontSize={["xs", "sm"]}
            align={["left", "right"]}
            color="white"
            fontWeight="400"
            lineHeight={["12px", "16px"]}
            position='absolute'
            bottom={0}
            left={["", "", "", "50%"]}
            transform={["", "", "", "translateX(-50%)"]}
          >
              Tecnología desarrollada por {" "}
            <Link href="https://merliteam.com" target="__blank" fontWeight="bold">
                merliteam.com
            </Link>
          </Text>
          <Box h='full' alignContent='center'>
            <Text
              fontSize={["xs", "sm"]}
              align={["left", "right"]}
              color="white"
              fontWeight="400"
              lineHeight={["12px", "16px"]}
              alignContent='center'
            >
              © 2024 ZonaMed – Todos los derechos reservados
            </Text>
            <Text
              fontSize={["xs", "sm"]}
              align={["left", "right"]}
              color="white"
              fontWeight="400"
              lineHeight={["12px", "16px"]}
              alignContent='center'
            >
              <Link href="https://zonamed.com.ar/politica-de-privacidad" fontSize={["xs", "sm"]} color="white" my={4}>Politica de privacidad</Link>
            </Text>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
};

