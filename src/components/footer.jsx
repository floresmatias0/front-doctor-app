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
              alignContent='center'
            >
              <Link href="https://zonamed.com.ar/politica-de-privacidad" fontSize={["xs", "sm"]} color="white" my={4}>Politica de privacidad</Link>
            </Text>
          </Box>
        </Flex>
          <Text
            fontSize={["xs", "sm"]}
            align="center"
            color="white"
            fontWeight="400"
            lineHeight={["12px", "16px"]}
            alignContent='center'
            marginTop={[5, 0]}
          >
              Tecnología desarrollada por {" "}
            <Link href="https://merliteam.com" target="__blank">
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
      bgGradient="linear-gradient(60.5deg, #104DBA -12.14%, #88A6DD 55.27%, #FFFFFF 134.94%)"
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
            <Link href="https://merliteam.com" target="__blank">
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

