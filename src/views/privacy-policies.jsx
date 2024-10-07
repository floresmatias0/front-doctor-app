import {
  Text,
  Box,
  Center,
  Flex
} from "@chakra-ui/react";

export default function PrivacyPolicies() {
  return (
    <Flex bg="#FFF">
      <Box h="100vh" w="full" flex={1} py={[4, 4, 4, 12]} mx={[4, 28]}>
        <Box bg="#FFF" w={["full", "920px"]} h="full" borderRadius="xl" boxShadow="xl" display="flex" flexDirection="column" mx="auto">
          <Center w="full" h="full" display="flex" flexDirection="column">
            <Text fontSize="28px" lineHeight="33.75px" fontWeight="bold" color="#104DBA" my={2}>Política de privacidad</Text>
            <Box mb={4} overflow="auto" mx={[4, 20]} p={4}>
              <Box mt={4}>
                <Text fontSize="xl" fontWeight="bold" color="#104DBA" my={2}>Última actualización: 07/10/2024</Text>
                <Text>Agradecemos que utilices nuestra aplicación <b>ZonaMed</b>. La protección de tus datos personales es una prioridad para nosotros. Esta Política de Privacidad describe cómo recopilamos, utilizamos y compartimos información personal a través de nuestra aplicación. Al utilizar la aplicación, aceptas los términos de esta política.</Text>
              </Box>

              <Box mt={4}>
                <Text fontSize="xl" fontWeight="bold" color="#104DBA" my={2}>1. Información que Recopilamos</Text>
                
                <Text>1.1. Acceso a Calendario de Google</Text>
                <Text pl={6}>Si eres un usuario doctor y autorizas el acceso, podemos recopilar y utilizar información de tu calendario de Google para proporcionar funcionalidades relacionadas con la gestión de citas y eventos en la aplicación.</Text>

                <Text>1.2. Acceso a Datos de Google para Iniciar Sesión</Text>
                <Text pl={6}>Para facilitar el proceso de inicio de sesión, recopilamos ciertos datos de tu cuenta de Google. Esto incluye tu nombre, dirección de correo electrónico y una identificación única de usuario.</Text>

                <Text>1.3. Acceso a tu Cuenta de MercadoPago</Text>
                <Text pl={6}>Si eres un usuario doctor y autorizas el acceso, podemos recopilar información de tu cuenta de MercadoPago para facilitar la generación de pagos en tu nombre.</Text>
              </Box>

              <Box mt={4}>
                <Text fontSize="xl" fontWeight="bold" color="#104DBA" my={2}>2. Uso de la Información</Text>
                <Text>Utilizamos la información recopilada para proporcionar, mantener y mejorar nuestra aplicación, así como para ofrecer servicios personalizados. No compartiremos tus datos personales con terceros sin tu consentimiento, a menos que sea necesario para proporcionar los servicios solicitados o cumplir con obligaciones legales.</Text>
              </Box>

              <Box mt={4}>
                <Text fontSize="xl" fontWeight="bold" color="#104DBA" my={2}>3. Retención y Eliminación de Datos</Text>
                <Text>3.1. Retención de Datos: Retenemos tus datos personales durante el tiempo necesario para cumplir con los fines descritos en esta política, salvo que se requiera un período de retención más largo por razones legales.</Text>
                <Text>3.2. Eliminación de Datos: Puedes solicitar la eliminación de tus datos en cualquier momento, así como la cancelación de citas a través de la aplicación. Cuando se cancela una cita, los datos relacionados se eliminarán de acuerdo con nuestras políticas de retención. También manejamos solicitudes de reembolso de dinero por consultas canceladas según las condiciones especificadas en la aplicación.</Text>
              </Box>

              <Box mt={4}>
                <Text fontSize="xl" fontWeight="bold" color="#104DBA" my={2}>4. Seguridad de los Datos</Text>
                <Text>Tomamos medidas razonables para proteger tu información personal. Sin embargo, ten en cuenta que ningún sistema de seguridad es completamente impenetrable. Tú también tienes un papel importante en la seguridad de tus datos. Mantén tus credenciales de acceso seguras y actualizadas.</Text>
              </Box>
            </Box>
          </Center>
        </Box>
      </Box>
    </Flex>
  );
}
