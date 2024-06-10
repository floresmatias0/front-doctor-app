import PropTypes from "prop-types";
import { Button, Text, Box, Center, Flex, Container, Heading, GridItem, Grid } from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { LogoCustom } from "../components/extras";

export default function Login({ handleLogin }) {
  return (
    <Flex bg="#FFFFFF" flexDirection="column" h='100vh'>
      {/* Navbar */}
      <Box
        w="full"
        h={["54px", "80px"]}
        boxShadow="0px 6px 6px 0px #00000014"
        alignContent="center"
      >
        <Container maxW="8xl" centerContent>
          <Flex
            justifyContent="start"
            alignItems="center"
            h="full"
            w="full"
            px={6}
          >
            <LogoCustom theme="light" />
          </Flex>
        </Container>
      </Box>
      <Flex flex={1} justifyContent='center' alignItems='center'>
        <Box w={['full', 'full', 'full', '889px', "889px"]} h={["572px"]} mx={['2em', '2em', '2em', 'auto','auto']} boxShadow='2xl' rounded='2xl'>
        <Grid templateColumns="repeat(12, 1fr)" h="full">
            <GridItem colSpan={[12, 12, 5, 5]} alignContent="center">
              <Flex justifyContent="center" alignItems="center" h='full'>
                <Box w={["180px", "180px", "250px", "250px"]}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 462 276"
                    fill="none"
                  >
                    <path
                      d="M410.743 102.043C410.743 192.059 337.77 265.032 247.754 265.032C157.738 265.032 84.7654 192.059 84.7654 102.043"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                    <path
                      d="M141.071 53.1461C141.071 84.2426 115.862 109.451 84.7654 109.451C53.6689 109.451 28.4602 84.2426 28.4602 53.1461"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                    <path
                      d="M452 51.9794C452 74.6004 433.463 93.0984 410.399 93.0984C387.334 93.0984 368.797 74.6004 368.797 51.9794C368.797 29.3583 387.334 10.8604 410.399 10.8604C433.463 10.8604 452 29.3583 452 51.9794Z"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                    <circle
                      cx="28.9353"
                      cy="29.7956"
                      r="18.9353"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                    <circle
                      cx="140.818"
                      cy="29.7956"
                      r="18.9353"
                      stroke="#104DBA"
                      stroke-width="20"
                    />
                  </svg>

                  <Heading
                    as="h1"
                    color="#104DBA"
                    textAlign="center"
                    fontWeight={700}
                    mt={3}
                    fontSize={["lg", "lg", "3xl", "3xl"]}
                    lineHeight={["18px", "70px"]}
                  >
                    Zona Pediatrica
                  </Heading>
                </Box>
              </Flex>
            </GridItem>
            <GridItem
              colSpan={[12, 12, 7, 7]}
              bgGradient="linear-gradient(61.63deg, #104DBA 26.71%, #88A6DD 85.17%, #FFFFFF 134.61%)"
              borderTopEndRadius={['none', '2xl']}
              borderBottomStartRadius={['2xl', 'none']}
              borderBottomEndRadius='2xl'
            >
              <Flex flexDirection='column' justifyContent='center' alignItems='center' h='full'>
                <Box w={["200px", "200px", "300px", "300px"]}>
                  <Heading
                    as="h2"
                    fontSize={["2xl", "48px"]}
                    color="white"
                    fontWeight="900"
                    lineHeight={["28.13px", "56.25px"]}
                    fontFamily="Roboto"
                    textAlign='left'
                  >
                    ¡Bienvenido!
                  </Heading>

                  <Text
                    color='white'
                    fontSize={['lg', 'xl']}
                    lineHeight='24px'
                    textAlign='left'
                    my={5}
                  >
                    Inicia sesion para poder acceder a nuestra plataforma
                  </Text>

                  <Button
                    backgroundColor='white'
                    fontSize={["sm", "xl"]}
                    leftIcon={<FcGoogle fontSize={24} />}
                    onClick={() => handleLogin("PATIENT")}
                    rounded='full'
                    w='full'
                    my={2}
                  >
                    <Text color='#104DBA' fontWeight={400}>Soy Paciente</Text>
                  </Button>
                  <Button
                    backgroundColor='white'
                    fontSize={["sm", "xl"]}
                    leftIcon={<FcGoogle fontSize={24} />}
                    onClick={() => handleLogin("DOCTOR")}
                    rounded='full'
                    w='full'
                    my={2}
                  >
                    <Text color='#104DBA' fontWeight={400}>Soy Doctor</Text>
                  </Button>
                </Box>
              </Flex>
            </GridItem>
          </Grid>
        </Box>
      </Flex>
    </Flex>
  );
}

Login.propTypes = {
  handleLogin: PropTypes.func,
};
