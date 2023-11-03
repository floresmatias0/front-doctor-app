import { Flex, Text, Button, Box, Menu, MenuButton, IconButton, MenuList, MenuItem, Input, useToast, Spinner, Center } from "@chakra-ui/react"
import { Fragment, useCallback, useContext, useEffect, useState } from "react"
import { AppContext } from "../components/context"
import { instance, instanceUpload } from "../utils/axios"
import { MdAdd } from "react-icons/md"
import { BiChevronRight, BiTimeFive } from "react-icons/bi"
import { AiOutlineCalendar } from "react-icons/ai"
import { useNavigate } from "react-router-dom"
import { FaEllipsis } from "react-icons/fa6"

const Turns = () => {
    const navigate = useNavigate()
    const [dataBookings, setDataBookings] = useState([])
    const [loading, setLoading] = useState(false)
    const { user } = useContext(AppContext)

    const toast = useToast()

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

    const handleFileInputChange = async (e, doctorId, patientId, bookingId) => {
        const formData = new FormData()
        const images = e.target.files
        // Convierte la colección de archivos en un array
        const files = Array.from(images)

        // Utiliza Promise.all para esperar a que se completen todas las promesas
        await Promise.all(
            files.map(async (file) => {
                return new Promise((resolve) => {
                    // Haces el push al array dentro de la promesa
                    // Esto asegura que el push se complete antes de continuar
                    formData.append('files', file);
                    resolve();
                });
            })
        );

        formData.append('doctorId', doctorId)
        formData.append('patientId', patientId)
        formData.append('bookingId', bookingId)

        try {
            if(images) {
                setLoading(true)
                await instanceUpload.post('/certificates/uploads', formData);
                await fetchBookings();
                setLoading(false)

                return toast({
                  title: "Certificado guardado",
                  description: "Se ha guardado satisfactoriamente",
                  position: "top-right",
                  isClosable: true,
                  duration: 6000,
                  status: "success"
                });
            }
            setLoading(false)

            toast({
                title: "Error al intentar guardar el certificado",
                description: "Debe seleccionar uno o mas documentos",
                position: "top-right",
                isClosable: true,
                duration: 6000,
                status: "error"
              });

        } catch (error) {
          // Maneja cualquier error de la solicitud, por ejemplo, muestra un mensaje de error.
          setLoading(false)
          return toast({
            title: "Error al intentar guardar el certificado",
            description: error.message,
            position: "top-right",
            isClosable: true,
            duration: 6000,
            status: "error"
          });
        }
    };

    return (
        <Flex w={["280px", "100%"]} h="100%" flexDirection="column">
            {loading ? 
                (
                    <Flex w="100%" flex={1} bg="#FCFEFF" borderRadius="xl" boxShadow="md" px={[2, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <Center>
                            <Spinner color="#205583"/>
                        </Center>
                    </Flex>
                ) : (
                <Fragment>
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
                                                    <Flex justifyContent="space-between" alignItems="start" flexWrap="wrap">
                                                        <Box>
                                                            <Text w="full" letterSpacing="3.2px" color="#205583" fontSize="md">Paciente {x?.patient?.name} {x?.patient?.lastName}</Text>
                                                            <Text w="full" letterSpacing="3.2px" color="#205583" fontSize="md" textTransform="capitalize">{x?.summary}</Text>
                                                        </Box>
                                                            <Menu>
                                                                <MenuButton
                                                                    as={IconButton}
                                                                    aria-label='Options'
                                                                    icon={<FaEllipsis />}
                                                                    variant='ghost'
                                                                    />
                                                                <MenuList>
                                                                        {user.role === "DOCTOR" && (
                                                                            <MenuItem display="flex" alignItems="center" justifyContent="center">
                                                                                <Button position="relative" w="full">
                                                                                    <Input
                                                                                        id="file-input"
                                                                                        type="file"
                                                                                        placeholder="Cargar certificado"
                                                                                        size="sm"
                                                                                        onChange={(e) => handleFileInputChange(e, x?.organizer?._id, x?.patient?._id, x?._id)}
                                                                                        multiple
                                                                                        style={{ opacity: 0 }}
                                                                                        position="absolute"
                                                                                        top="0"
                                                                                        left="0"
                                                                                        w="full"
                                                                                    />
                                                                                    Cargar certificado
                                                                                </Button>
                                                                            </MenuItem>
                                                                        )}
                                                                        {x.certificate && x.certificate.length > 0 && (
                                                                            x.certificate.map((c, idx) => (
                                                                                <MenuItem key={idx} onClick={() => window.open(c.url)}>Certificado {idx + 1}</MenuItem>
                                                                            ))
                                                                        )}
                                                                </MenuList>
                                                            </Menu>
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
                </Fragment>
            )}
        </Flex>
    )
}

export default Turns