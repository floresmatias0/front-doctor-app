import PropTypes from 'prop-types'
import {
  Button,
  Text,
  Box,
  Center,
  Flex,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import bear from "../assets/peluche-oso-estetoscopio.jpg"

export default function Login({ handleLogin }) {
  return (
    <Flex bg="#E5F2FA">
      <Box h="100vh" w="100%" flex={1} py={[4, 4, 4, 12]} mx={[4, 28]}>
        <Box position="relative" w="100%" h="100%" bgImage={bear} bgSize={"cover"} bgPosition="50% 50%" bgRepeat="no-repeat" opacity="0.3" variant="unstyled" borderRadius="xl" boxShadow="md" display="flex" flexDirection="column">
        {/* Imagen de <a href="https://www.freepik.es/foto-gratis/peluche-oso-estetoscopio_1093603.htm#query=oso%20pediatra&position=37&from_view=search&track=ais">Freepik</a> */}
        </Box>
        <Center position="absolute" top="50%" left="50%" display="flex" flexDirection="column" transform="translate(-50%, -50%)">
          <Box mb={4} textAlign="center">
            <Text fontSize={["md", "lg", "xl"]} fontWeight="bold" color="#205583">Te damos la bienvenida</Text>
            <Text fontSize={["xs", "sm"]} color="#205583">Iniciá sesión para poder acceder a nuestra plataforma</Text>
          </Box>
          <Button
            variant="outline"
            leftIcon={<FcGoogle />}
            onClick={handleLogin}
            color="#205583"
            fontSize={["xs", "sm"]}
          >
            <Text>Iniciar sesion con google</Text>
          </Button>
        </Center>
      </Box>
    </Flex>
  );
}

Login.propTypes = {
  handleLogin: PropTypes.func
}
