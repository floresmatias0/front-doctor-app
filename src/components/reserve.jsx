import PropTypes from 'prop-types'
import { Box, Button, Flex, Text } from "@chakra-ui/react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { es } from 'date-fns/locale'
import { format } from "date-fns"

const Reserve = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    const currentParams = Object.fromEntries([...searchParams]);
    const { doctor, patient, startDateTime, endDateTime } = currentParams;

    const fechaStart = new Date(startDateTime);
    const day = fechaStart.getDate();
    const month = fechaStart.getMonth() + 1;
    const year = fechaStart.getFullYear();

    return (
        <Flex h="100%" flexDirection="column">
            <Flex bgColor="#E5F2FA" flexDirection="column" justifyContent="center" alignItems="center" h={["auto", "237px"]}>
                <Box w={["100%", "100%", "100%", "50%"]} px={[4, 4, 4, 0]}>
                    <Text textAlign={["center", "left"]} fontSize={["md", "lg"]} color="#205583" my={2}>
                        Detalles del turno médico de
                        {patient}
                    </Text>
                    <Flex w="100%" justifyContent="space-between" alignItems="center" my={[2, 8]} flexWrap={["wrap"]} gap={[3, 0]}>
                        <Box>
                            <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Médico</Text>
                            <Text fontSize={["sm", "lg"]} color="#205583">
                                {doctor}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Especialización</Text>
                            <Text fontSize={["sm", "lg"]} color="#205583">Especializacion</Text>
                        </Box>
                        <Box>
                            <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Día</Text>
                            <Text fontSize={["sm", "lg"]} color="#205583">
                                {`${day}/${month}/${year}`}
                            </Text>
                        </Box>
                        <Box>
                            <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Hora</Text>
                            <Text fontSize={["sm", "lg"]} color="#205583">
                                {endDateTime && format(new Date(endDateTime), 'HH:mm', { locale: es })}hs
                            </Text>
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <Box w={["100%", "100%", "90%", "50%"]} px={[4, 4, 4, 0]}>
                    <Text textAlign="center" fontSize={["lg","2xl"]} color="#205583" my={4} fontWeight="bold">
                        El turno ya está reservado
                    </Text>
                    <Text textAlign="center" fontStyle="italic" fontSize={["sm", "lg"]} color="#205583">
                        En las próximas horas se confirmará tu pago, si surge algún problema nos comunicaremos con vos.
                    </Text>
                    <Text textAlign="center" fontSize={["sm", "lg"]} color="#205583" my={4}>
                        Por favor, <b>recuerda que si no podés conectarte en horario debes cancelar el turno a través de “Mis turnos” al menos 4 horas previo al mismo, de lo contrario, no se realizará un reembolso.</b> 
                        Apreciamos tu comprensión en este asunto.
                    </Text>
                    <Text textAlign="center" fontSize={["sm", "lg"]} color="#205583">
                        Gracias por confiar en nosotros para tu atención médica. <b>¡Esperamos verte en tu cita!</b>
                    </Text>
                </Box>
                <Flex gap={2} my={[2, 6]} flexDirection={["column", "row"]}>
                    <Button bg="#FFFFFF" color="#205583" w={["220px","300px"]} size={["sm", "md"]} onClick={() => navigate('/')}>VOLVER AL INICIO</Button>
                    <Button bg="#205583" color="#FFFFFF" w={["220px","300px"]} size={["sm", "md"]} isDisabled>IR A MIS TURNOS</Button>
                </Flex>
            </Flex>
            <Flex flex={1} justifyContent="center" alignItems="flex-end" my={[2, 4]}>
                <Text textAlign="center" w={["100%", "100%", "90%", "50%"]} fontStyle="italic" fontSize={["sm", "lg"]} mx={[4, 0]} color="#205583">
                    Si tienes alguna pregunta adicional, por favor, no dudes en ponerte en contacto con nuestro equipo de soporte.
                </Text>
            </Flex>
        </Flex>
    )
}

Reserve.propTypes = {
    doctorSelected: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      reservePrice: PropTypes.number
    }),
    patientSelected: PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string
    }),
    selectDay: PropTypes.instanceOf(Date),
    user: PropTypes.shape(),
    paymentStatus: PropTypes.bool,
    onNext: PropTypes.func,
    isActive: PropTypes.bool
}

export default Reserve