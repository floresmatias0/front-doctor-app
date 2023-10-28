import {
    Text,
    Box,
    Center,
    Flex,
  } from "@chakra-ui/react";
  
  export default function TermsOfServices() {
    return (
    <Flex bg="#E5F2FA">
        <Box h="100vh" w="full" flex={1} py={[4, 4, 4, 12]} mx={[4, 28]}>
            <Box bg="#FCFEFF" w="full" h="full" borderRadius="xl" boxShadow="md" display="flex" flexDirection="column">
                <Center w="full" h="full" display="flex" flexDirection="column">
                    <Text fontSize={["md", "lg", "xl"]} fontWeight="bold" color="#205583" my={2}>Condiciones de Servicio</Text>
                    <Box mb={4} overflow="auto" w={["full", "full", "50%"]} mx={[4, 4, "auto"]} p={4}>
                    <Box mt={4}>
                        <Text fontSize="md" fontWeight="bold" color="#205583" my={2}>Última actualización: 27/10/2023</Text>
                        <Text>Al utilizar nuestra aplicación DoctorApp, aceptas cumplir con las siguientes condiciones de servicio:</Text>
                    </Box>

                    <Box mt={4}>
                        <Text fontSize="md" fontWeight="bold" color="#205583" my={2}>1. Uso de la Aplicación</Text>
                        <Text>Debes utilizar la aplicación de acuerdo con las leyes y regulaciones aplicables. No debes utilizar la aplicación de manera que pueda causar daño a terceros o a nosotros mismos.</Text>
                    </Box>

                    <Box mt={4}>
                        <Text fontSize="md" fontWeight="bold" color="#205583" my={2}>2. Acceso a Calendario de Google y MercadoPago</Text>
                        <Text>Si eres un usuario doctor y autorizas el acceso a tu calendario de Google o tu cuenta de MercadoPago, aceptas que la aplicación utilizará esta información únicamente para los fines especificados y necesarios para proporcionar los servicios solicitados.</Text>
                    </Box>

                    <Box mt={4}>
                        <Text fontSize="md" fontWeight="bold" color="#205583" my={2}>3. Responsabilidad</Text>
                        <Text>No somos responsables de ningún daño, pérdida o perjuicio que puedas experimentar al utilizar la aplicación. Utilizas la aplicación bajo tu propio riesgo.</Text>
                    </Box>

                    <Box mt={4}></Box>
                        <Text fontSize="md" fontWeight="bold" color="#205583" my={2}>4. Cambios en los Términos</Text>
                        <Text>Nos reservamos el derecho de modificar estas condiciones de servicio y la política de privacidad en cualquier momento. Te notificaremos sobre cualquier cambio importante.</Text>
                    </Box>
                </Center>
            </Box>
        </Box>
    </Flex>
    );
  }
  