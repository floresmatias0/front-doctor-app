import { Box, Container, Flex, Link, Text } from "@chakra-ui/react";
import { LogoCustom } from "./extras";
import { BiLogoLinkedin } from "react-icons/bi";
import { FaFacebookF, FaInstagram } from "react-icons/fa";

export const FooterLanding = ({styles = {}}) => {
  return (
    <Flex
      w="full"
      py={3}
      mt={20}
      bgGradient="linear-gradient(60.5deg, #104DBA -12.14%, #88A6DD 55.27%, #FFFFFF 134.94%)"
      style={styles}
    >
      <Container maxW="container.xl">
        <Flex
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
              <Link href="https://facebook.com">
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
              <Link href="https://linkedin.com">
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
              <Link href="https://instagram.com">
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
              ayuda@zonapediatrica.com.ar
            </Text>
            <Text
              fontSize={["xs", "sm"]}
              align={["left", "right"]}
              color="white"
              fontWeight="400"
              lineHeight={["12px", "16px"]}
              mt={4}
            >
              © 2024 ZonaPediatrica – Todos los derechos reservados
            </Text>
          </Box>
        </Flex>
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
      bgGradient="linear-gradient(60.5deg, #104DBA -12.14%, #88A6DD 55.27%, #FFFFFF 134.94%)"
      style={styles}
      display={display}
    >
      <Container maxW="container.2xl" h='full'>
        <Flex
          flexDirection={["column", "column", "column", "row"]}
          justifyContent="space-between"
          h='full'
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
              ayuda@zonapediatrica.com.ar
            </Text>
          </Box>
          <Box h='full' alignContent='center'>
            <Text
              fontSize={["xs", "sm"]}
              align={["left", "right"]}
              color="white"
              fontWeight="400"
              lineHeight={["12px", "16px"]}
              alignContent='center'
            >
              © 2024 ZonaPediatrica – Todos los derechos reservados
            </Text>
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
};

