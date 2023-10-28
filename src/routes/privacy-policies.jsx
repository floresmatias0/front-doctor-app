import {
  Text,
  Box,
  Center,
  Flex
} from "@chakra-ui/react";

export default function PrivacyPolicies() {
  return (
    <Flex bg="#FCFEFF">
      <Box h="100vh" w="full" flex={1} py={[4, 4, 4, 12]} mx={[4, 28]}>
        <Box bg="#FCFEFF" w="full" h="full" borderRadius="xl" boxShadow="md" display="flex" flexDirection="column">
          <Center w="full" h="full" display="flex" flexDirection="column">
              <Text fontSize={["md", "lg", "xl"]} fontWeight="bold" color="#205583" my={2}>Políticas de privacidad</Text>
              <Box mb={4} overflow="auto" w={["full", "full", "50%"]} mx={[4, 4, "auto"]} p={4}>
                <Box mt={4}>
                    <Text fontSize="md" fontWeight="bold" color="#205583" my={2}>Última actualización: 27/10/2023</Text>
                    <Text>Agradecemos que utilices nuestra aplicación <b>DoctorApp</b>. La protección de tus datos personales es una prioridad para nosotros. Esta Política de Privacidad describe cómo recopilamos, utilizamos y compartimos información personal a través de nuestra aplicación. Al utilizar la aplicación, aceptas los términos de esta política.</Text>
                </Box>

                <Box mt={4}>
                    <Text fontSize="md" fontWeight="bold" color="#205583" my={2}>1. Información que Recopilamos</Text>
                    
                    <Text>1.1.Acceso a Calendario de Google</Text>
                    <Text pl={6}>Si eres un usuario doctor y autorizas el acceso, podemos recopilar y utilizar información de tu calendario de Google para proporcionar funcionalidades relacionadas con la gestión de citas y eventos en la aplicación.</Text>

                    <Text>1.2.Acceso a Datos de Google para Iniciar Sesión</Text>
                    <Text pl={6}>Para facilitar el proceso de inicio de sesión, recopilamos ciertos datos de tu cuenta de Google. Esto incluye tu nombre, dirección de correo electrónico y una identificación única de usuario.</Text>

                    <Text>1.3.Acceso a tu Cuenta de MercadoPago</Text>
                    <Text pl={6}>Si eres un usuario doctor y autorizas el acceso, podemos recopilar información de tu cuenta de MercadoPago para facilitar la generación de pagos en tu nombre.</Text>
                </Box>

                <Box mt={4}>
                    <Text fontSize="md" fontWeight="bold" color="#205583" my={2}>2. Uso de la Información</Text>

                    <Text>Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestra aplicación, así como para ofrecer servicios personalizados. No compartiremos tus datos personales con terceros sin tu consentimiento, a menos que sea necesario para proporcionar los servicios solicitados o cumplir con obligaciones legales.</Text>
                </Box>

                <Box mt={4}>
                    <Text fontSize="md" fontWeight="bold" color="#205583" my={2}>3. Seguridad de los Datos</Text>
                    <Text>Tomamos medidas razonables para proteger tu información personal. Sin embargo, ten en cuenta que ningún sistema de seguridad es completamente impenetrable. Tú también tienes un papel importante en la seguridad de tus datos. Mantén tus credenciales de acceso seguras y actualizadas.</Text>
                </Box>
              </Box>
          </Center>
        </Box>
      </Box>
    </Flex>
  );
}
