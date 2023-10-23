import PropTypes from 'prop-types'
import { Box, Button, Center, Flex, Spinner, Text } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from 'react'
import { instance } from '../utils/axios'
import { es } from 'date-fns/locale'
import { format } from "date-fns"

const Payment = ({
    symptomsSelected,
    doctorSelected,
    user,
    patientSelected,
    selectDay,
    isActive
}) => {
    const [isLoading, setIsLoading] = useState(false)
    const [urlMercadopago, setUrlMercadopago] = useState(null)

    const confirmReserve = useCallback(async () => {
        try {
            setIsLoading(true)
            const endDateTime = new Date(selectDay);
            endDateTime.setMinutes(endDateTime.getMinutes() + doctorSelected?.reserveTime);
            
            const payment = await instance.post('/payments/create', {
                user_email: doctorSelected.value,
                tutor_email: user?.email,
                patient: patientSelected?._id,
                startDateTime: `${format(selectDay, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}`,
                endDateTime: `${format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}`,
                unit_price: doctorSelected.reservePrice,
                symptoms: symptomsSelected
            });
            const { init_point, sandbox_init_point } = payment.data.data;

            if(import.meta.env.VITE_ENVIRONMENT === "localhost") {
                setUrlMercadopago(sandbox_init_point)
                return setIsLoading(false)
            }

            setUrlMercadopago(init_point)
            setIsLoading(false)
        }catch(err) {
            console.log(err.message)
        }
    }, [doctorSelected, user, symptomsSelected, selectDay, patientSelected])
    
    const fecha = new Date(selectDay);
    const day = fecha.getDate();
    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
              await confirmReserve();
            }catch(err){
              console.log(err)
            }
          }
      
          if(isActive) fetchPaymentData();
    }, [confirmReserve, isActive])

    const handleClick = () => window.location.replace(urlMercadopago)

    return (
        <Flex h="100%" flexDirection="column">
            <Flex bgColor="#E5F2FA" flexDirection="column" justifyContent="center" alignItems="center" h={["auto", "237px"]}>
                <Box w={["100%", "100%", "100%", "50%"]} px={[4, 4, 4, 0]}>
                    <Text textAlign={["center", "left"]} fontSize={["md", "lg"]} color="#205583" my={2}>Detalles del turno médico de {patientSelected?.label}</Text>
                    <Flex w="100%" justifyContent="space-between" alignItems="center" my={[2, 8]} flexWrap={["wrap"]} gap={[3, 0]}>
                        <Box>
                            <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Médico</Text>
                            <Text fontSize={["sm", "lg"]} color="#205583">{doctorSelected?.label}</Text>
                        </Box>
                        <Box>
                            <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Especialización</Text>
                            <Text fontSize={["sm", "lg"]} color="#205583">Especializacion</Text>
                        </Box>
                        <Box>
                            <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Día</Text>
                            <Text fontSize={["sm", "lg"]} color="#205583">{`${day}/${month}/${year}`}</Text>
                        </Box>
                        <Box>
                            <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Hora</Text>
                            <Text fontSize={["sm", "lg"]} color="#205583">{selectDay && format(new Date(selectDay), 'HH:mm', { locale: es })}hs</Text>
                        </Box>
                    </Flex>
                </Box>
            </Flex>
            <Flex flexDirection="column" justifyContent="center" alignItems="center">
                <Box w={["100%", "100%", "90%", "50%"]} px={[4, 4, 4, 0]}>
                    <Text textAlign="center" fontSize={["lg","2xl"]} color="#205583" my={[2, 4]} fontWeight="bold">Tu turno aún no está confirmado.</Text>
                    <Text textAlign="center" fontSize={["sm", "lg"]} color="#205583">
                        Para garantizar tu cita, por favor, procede con el pago de la consulta <b>haciendo clic en el botón &quot;Pagar&quot;</b>. 
                        Serás <b>redirigido a Mercado Pago</b> para completar el proceso de pago correspondiente.
                    </Text>
                    <Flex justifyContent="center" alignItems="center" gap={2} my={[2, 0]} flexDirection={["column", "row"]}>
                        <Button bg="#FFFFFF" color="#205583" w={["220px","300px"]} size={["sm", "md"]} isDisabled>CANCELAR TURNO</Button>
                        {isLoading ? (
                            <Center>
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.500'
                                    size='xl'
                                />
                            </Center>
                        ) : (
                            urlMercadopago && (
                                <Box w={["100%", "auto"]}>
                                    <Button
                                        bg="#205583" color="#FFFFFF" w={["220px","300px"]} size={["xs", "sm"]}
                                        onClick={handleClick}
                                    >
                                        IR A MERCADOPAGO
                                    </Button>
                                </Box>
                            )
                        )}
                    </Flex>

                </Box>
            </Flex>
            <Flex flex={1} justifyContent="center" alignItems="flex-end" my={[2, 4]}>
                <Text textAlign="center" w={["100%", "100%", "90%", "50%"]} fontStyle="italic" fontSize={["sm", "lg"]} mx={[4, 0]} color="#205583">
                    Una vez que hayas realizado el pago con éxito, recibirás una confirmación por correo electrónico y tu turno quedará reservado de manera efectiva.
                </Text>
            </Flex>
        </Flex>
    )
}

Payment.propTypes = {
    symptomsSelected: PropTypes.array,
    doctorSelected: PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      reservePrice: PropTypes.number,
      reserveTime: PropTypes.number
    }).isRequired,
    patientSelected: PropTypes.shape({
        value: PropTypes.string,
        label: PropTypes.string,
        _id: PropTypes.string
    }).isRequired,
    selectDay: PropTypes.instanceOf(Date).isRequired,
    user: PropTypes.shape(),
    isActive: PropTypes.bool
}

export default Payment