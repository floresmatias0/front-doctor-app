import { Box, Button, Flex, Text, Tooltip } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react"
import { AppContext } from "../components/context"
import { instance } from "../utils/axios"
import { SlClose } from "react-icons/sl"

const History = () => {

    const [dataBookings, setDataBookings] = useState([])
    const { user } = useContext(AppContext)

    const fetchBookings = useCallback(async () => {
        try {
            let bookings = []

            if(user.role === "DOCTOR") {
                bookings = await instance.get(`/calendars/all-events?doctor=${user.email}`)
                
                return setDataBookings(bookings.data.data)
            }

            bookings = await instance.get(`/calendars/all-events/${user._id}`)

            setDataBookings(bookings.data.data)
        }catch(err) {
          console.log(err.message)
          throw new Error(err.message)
        }
    }, [user])
    
    useEffect(() => {
        const fetchDataBookings = async () => {
            if (user) {
                try {
                    await fetchBookings();
                } catch (err) {
                    console.log(err);
                }
            }
        };
    
        fetchDataBookings();
    }, [fetchBookings, user])

    const getFormattedDateTime = (dateTimeStr, options) => {
        const dateTime = new Date(dateTimeStr);
        return dateTime.toLocaleString('es', options);
    }
    
    const handleDeleteEvent = async (bookingId, userEmail) => {
        try {
          await instance.delete(`/calendars/${bookingId}?email=${userEmail}`)
        }catch(err) {
          console.log(err.message)
        }
    }

    const statuses = {
        'confirmed': 'CONFIRMADO',
        'deleted': 'CANCELADO'
    }

    return (
        <Box w={["280px", "100%"]} h="100%" bg="#FCFEFF" position="relative" variant="unstyled" borderRadius="xl" boxShadow="md" display="flex" flexDirection="column">
            <Flex w="100%" h="100%" px={[0, 2]} flexDirection="column" overflow="auto">
                <Text color="#205583" fontSize={["lg", "xl"]} fontWeight="bold"textAlign="center" my={4}>Historial de turnos</Text>
                <Flex justifyContent="space-between" display={["none", "none", "none", "none", "flex"]}>
                    <Box flex="1" fontWeight="bold" textTransform="uppercase" color="#205583">Título</Box>
                    <Box flex="1" fontWeight="bold" textTransform="uppercase" color="#205583">Reunion</Box>
                    <Box flex="1" fontWeight="bold" textTransform="uppercase" color="#205583">Estado</Box>
                    <Box flex="1" fontWeight="bold" textTransform="uppercase" color="#205583">Doctor</Box>
                    <Box flex="1" fontWeight="bold" textTransform="uppercase" color="#205583">Paciente</Box>
                    <Box flex="1" fontWeight="bold" textTransform="uppercase" color="#205583">Fecha</Box>
                    <Box flex="1" fontWeight="bold" textTransform="uppercase" color="#205583">Acciones</Box>
                </Flex>
                {
                    dataBookings &&
                    dataBookings?.length > 0 &&
                    dataBookings?.map((x, idx) => {
                        let now = new Date();
                        let bookingStart = new Date(x.start.dateTime);
                        let isBookingPassed = now > bookingStart || x.status === "deleted";

                        let date = `${getFormattedDateTime(x.start.dateTime, {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })} de ${getFormattedDateTime(x.start.dateTime, {
                            hour: "numeric",
                            minute: "numeric",
                        })} a ${getFormattedDateTime(x.end.dateTime, {
                            hour: "numeric",
                            minute: "numeric",
                        })}hs.`;

                        return (
                            <Flex
                                key={idx}
                                borderWidth="1px"
                                borderRadius="md"
                                p={2}
                                my={2}
                                display={["block", "flex"]}
                                flexDirection={["column", "column", "column", "column", "row"]}
                                alignItems="center"
                            >
                                <Box flex="1" display={["block", "flex"]} fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                    <Text fontSize="lg">{x.summary}</Text>
                                </Box>
                                <Box flex="1" display={["block", "flex"]} fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                    {x.status === "deleted" ? (
                                        <Text>Google meet</Text>
                                    ) : now > bookingStart ? (
                                        <Text>Google meet</Text>
                                    ) : (
                                        <a href={x.hangoutLink}>
                                            <Text color='blue'>Google meet</Text>
                                        </a>
                                    )}
                                </Box>
                                <Box flex="1" display={["block", "flex"]} fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                    {statuses[x.status]}
                                </Box>
                                <Box flex="1" display={["block", "flex"]} fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                    {x.organizer.email}
                                </Box>
                                <Box flex="1" display={["block", "flex"]} fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                    {x?.name}
                                </Box>
                                <Box flex="1" display={["block", "flex"]} fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                    {date}
                                </Box>
                                <Box display={["block", "flex"]} maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                    <Tooltip label={x.status === "deleted" ? "Cancelado" : now > bookingStart ? "Expiró" : "Cancelar turno"}>
                                        <Button onClick={() => handleDeleteEvent(x._id, x.organizer.email)} isDisabled={isBookingPassed}>
                                            <SlClose />
                                        </Button>
                                    </Tooltip>
                                </Box>
                            </Flex>
                        );
                    }).reverse()
                }
            </Flex>
        </Box>
    )
}

export default History