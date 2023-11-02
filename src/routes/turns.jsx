import { Flex, Text, Button, Box } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react"
import { AppContext } from "../components/context"
import { instance } from "../utils/axios"
import { MdAdd } from "react-icons/md"
import { BiChevronRight, BiTimeFive } from "react-icons/bi"
import { AiOutlineCalendar } from "react-icons/ai"
import { useNavigate } from "react-router-dom"

const Turns = () => {
    const navigate = useNavigate()
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

    return (
        <Flex w={["280px", "100%"]} h="100%" flexDirection="column">
            <Flex w="100%" justifyContent="space-between" alignItems="center" flexDirection={["column", "row"]} my={2} flex="0 0 auto">
                <Text color="#205583" fontSize={["lg", "xl"]} fontWeight="bold">Mis turnos</Text>
                <Button leftIcon={<MdAdd/>} bg="#FCFEFF" size="sm" onClick={() => navigate('/appointment')}>Nuevo Turno</Button>
            </Flex>

            <Flex w="100%" flex={1} bg="#FCFEFF" borderRadius="xl" boxShadow="md" px={[2, 2, 4]} py={4} flexDirection="column" overflow="auto">
                <Flex gap={4} flexDirection={["column", "column", "column", "row",  "row"]}>
                    <Flex flex={1} flexDirection="column" gap={2}>
                        <Text color="#205583" fontSize={["md", "lg"]} fontWeight="bold" mb={2}>Próximos turnos</Text>
                        {
                            dataBookings &&
                            dataBookings?.length > 0 &&
                            dataBookings?.map((x, idx) => {
                                let now = new Date();
                                let bookingStart = new Date(x.start.dateTime);
                                let isBookingPassed = bookingStart > now;
        
                                let extraDate = `${getFormattedDateTime(x.start.dateTime, {
                                    day: "2-digit",
                                    weekday: "long",
                                    month: "long",
                                    year: "numeric",
                                })}`
        
                                let from = `${getFormattedDateTime(x.start.dateTime, {
                                    hour: "numeric",
                                    minute: "numeric",
                                })}`

                                let to = `${getFormattedDateTime(x.end.dateTime, {
                                    hour: "numeric",
                                    minute: "numeric",
                                })}`

                                if(isBookingPassed) {
                                    return (
                                        <Flex key={idx} w="full" boxShadow="base" borderRadius="md" h={["136px"]} p={4} flexDirection="column" justifyContent="space-between">
                                            <Flex justifyContent="space-between">
                                                <Text letterSpacing="3.2px" color="#205583" fontSize="md">Paciente {x?.patient?.name} {x?.patient?.lastName}</Text>
                                                <Text letterSpacing="3.2px" color="#205583" fontSize="md">Consulta Online</Text>
                                            </Flex>
                                            <Flex justifyContent="space-between">
                                                <Box>
                                                    <Flex gap={2}>
                                                        <AiOutlineCalendar color="#205583"/>
                                                        <Text fontSize="sm" color="#205583" textTransform="uppercase">
                                                            {extraDate}
                                                        </Text>
                                                    </Flex>
                                                    <Flex gap={2} justifyItems="center">
                                                        <BiTimeFive color="#205583"/>
                                                        <Text fontSize="sm" color="#205583" textTransform="uppercase">
                                                            {from} -
                                                        </Text>
                                                        <Text fontSize="sm" color="#205583" textTransform="uppercase">
                                                            {to}
                                                        </Text>
                                                    </Flex>
                                                </Box>
                                                <Box>
                                                    <Text fontSize="sm" color="#205583" fontWeight="bold" textTransform="capitalize">{x.organizer.name}</Text>
                                                    <Text fontSize="sm" color="#205583">Especialidad</Text>
                                                </Box>
                                                <Box>
                                                    <Button rightIcon={<BiChevronRight color="#FCFFFF"/>} bg="#205583" color="#FFFFFF" onClick={() => window.open(x.hangoutLink, '_blank')}>Ir a la reunion</Button>
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    )
                                }
                            })
                        }
                    </Flex>
                    <Flex flex="0 0 auto" flexDirection="column" w={["full", "full", "full", "320px", "384px"]} gap={2}>
                        <Text color="#205583" fontSize={["md", "lg"]} fontWeight="bold" mb={2}>Últimos turnos</Text>
                        {
                            dataBookings &&
                            dataBookings?.length > 0 &&
                            dataBookings?.map((x, idx) => {
                                let now = new Date();
                                let bookingStart = new Date(x.start.dateTime);
                                let isOldBooking = bookingStart < now || x.status === "deleted";
        
                                let extraDate = `${getFormattedDateTime(x.start.dateTime, {
                                    day: "2-digit",
                                    weekday: "long",
                                    month: "long",
                                    year: "numeric",
                                })}`
        
                                let from = `${getFormattedDateTime(x.start.dateTime, {
                                    hour: "numeric",
                                    minute: "numeric",
                                })}`

                                let to = `${getFormattedDateTime(x.end.dateTime, {
                                    hour: "numeric",
                                    minute: "numeric",
                                })}`

                                if(isOldBooking) {
                                    return (
                                        <Flex key={idx} w="full" boxShadow="base" borderRadius="md" h={["220px"]} p={4} flexDirection="column" justifyContent="space-between">
                                            <Flex justifyContent="space-between" flexWrap="wrap">
                                                <Text w="full" letterSpacing="3.2px" color="#205583" fontSize="md">Paciente {x?.patient?.name} {x?.patient?.lastName}</Text>
                                                <Text w="full" letterSpacing="3.2px" color="#205583" fontSize="md" textTransform="capitalize">{x?.summary}</Text>
                                            </Flex>
                                            <Flex justifyContent="space-between" flexDirection="column" gap={2}>
                                                <Box>
                                                    <Flex gap={2} w="full">
                                                        <AiOutlineCalendar color="#205583"/>
                                                        <Text fontSize="sm" color="#205583" textTransform="uppercase">
                                                            {extraDate}
                                                        </Text>
                                                    </Flex>
                                                    <Flex gap={2} justifyItems="center" w="full">
                                                        <BiTimeFive color="#205583"/>
                                                        <Text fontSize="sm" color="#205583" textTransform="uppercase">
                                                            {from} -
                                                        </Text>
                                                        <Text fontSize="sm" color="#205583" textTransform="uppercase">
                                                            {to}
                                                        </Text>
                                                    </Flex>
                                                </Box>
                                                <Box>
                                                    <Text fontSize="sm" color="#205583" fontWeight="bold" textTransform="capitalize">{x.organizer.name}</Text>
                                                    <Text fontSize="sm" color="#205583">Especialidad</Text>
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    )
                                }
                            })
                        }
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Turns