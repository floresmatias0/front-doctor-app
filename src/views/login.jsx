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
      <Box h="100vh" w="100%" flex={1} py={[4, 4, 4, 12]} mx={[4, 28]} textAlign="center">
        <Box position="relative" w="100%" h="100%" bgImage={bear} bgSize={"cover"} bgPosition="50% 50%" bgRepeat="no-repeat" opacity="0.15" variant="unstyled" borderRadius="xl" boxShadow="dark-lg" display="flex" flexDirection="column">
        </Box>
        <Center position="absolute" top="50%" left="50%" display="flex" flexDirection="column" transform="translate(-50%, -50%)" gap={2}>
          <Box mb={4} textAlign="center">
            <Text fontSize={["xl", "2xl", "3xl"]} fontWeight="bold" color="#205583">Te damos la bienvenida</Text>
            <Text fontSize={["md", "lg"]} color="#205583">Seleccione su rol para iniciar sesión</Text>
          </Box>
          <Flex justifyContent="center" alignItems="center" gap={4}>
            <Button colorScheme="teal" fontSize={["sm", "md"]} minW='120px' variant='outline' leftIcon={<FcGoogle fontSize={22} />} onClick={() => handleLogin('PATIENT')}><Text>Paciente</Text></Button>
            <Button colorScheme="blue" fontSize={["sm", "md"]} minW='120px' variant='outline' leftIcon={<FcGoogle fontSize={22} />} onClick={() => handleLogin('DOCTOR')}><Text>Doctor</Text></Button>
          </Flex>
        </Center>
        <Text fontSize="sm"  color="#205583" my={2} position="absolute" bottom={10} left="50%" transform="translate(-50%, -50%)">
          Imagen de <a href="https://www.freepik.es/foto-gratis/peluche-oso-estetoscopio_1093603.htm#query=oso%20pediatra&position=37&from_view=search&track=ais"><b>Freepik</b></a>
        </Text>
      </Box>
    </Flex>
  );
}

Login.propTypes = {
  handleLogin: PropTypes.func
}
