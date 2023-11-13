import { Box, Button, Center, Flex, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Select, Spinner, Text, useToast } from "@chakra-ui/react"
import { useCallback, useContext, useEffect, useState } from "react"
import { AppContext } from "../components/context"
import { instance, instanceUpload } from "../utils/axios"
import { FaEllipsis } from "react-icons/fa6"

const History = () => {
    const toast = useToast()
    const [dataBookings, setDataBookings] = useState([])
    const [originalDataBookings, setOriginalDataBookings] = useState([])
    const [patientSelected, setPatientSelected] = useState({})
    const [loading, setLoading] = useState(false)
    const { user, patients } = useContext(AppContext)

    const fetchBookings = useCallback(async () => {
        try {
            let bookings = []

            if(user.role === "DOCTOR") {
                bookings = await instance.get(`/calendars/all-events?doctor=${user.email}`)
                
                setOriginalDataBookings(bookings.data.data)
                return setDataBookings(bookings.data.data)
            }

            bookings = await instance.get(`/calendars/all-events/${user._id}`)

            setOriginalDataBookings(bookings.data.data)
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

    const handleChange = (e) => {
        const { value } = e.target

        const selected = patients.find((patient) => patient.value === value);
        setPatientSelected(selected)

        const isPatientInBookings = dataBookings.some((booking) => booking?.patient?.dni === value)

        if(isPatientInBookings) {
            let bookingsFiltered = dataBookings.filter((booking) => booking?.patient?.dni === value)
            return setDataBookings(bookingsFiltered)
        }

        if(value) {
            toast({
                title: "Error en filtrado",
                description: "No se encontro ningun paciente con ese nombre",
                position: "top-right",
                isClosable: true,
                duration: 3000,
                status: "error"
            })
        }
        
        setDataBookings(originalDataBookings)
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
            {user.role !== "DOCTOR" ? (
                <Flex w="100%" justifyContent="space-between" alignItems="center" flexDirection={["column", "row"]} my={1} flex="0 0 auto">
                    <Text color="#205583" fontSize={["md", "lg"]} fontWeight="bold">Historial de turnos</Text>
                    <Select
                        w={["auto", "250px"]}
                        h={["28px", "36px"]}
                        bg="#FFFFFF"
                        placeholder='Selecciona un paciente'
                        value={patientSelected?.value}
                        onChange={handleChange}
                        fontSize={["sm", "md"]}
                    >
                    {patients.map((patient, idx) => (
                        <option key={idx} value={patient.value}>{patient.label}</option>
                    ))}
                    </Select>
                </Flex>
            ) : (
                <Text color="#205583" fontSize={["md", "lg"]} fontWeight="bold">Historial de turnos</Text>
            )}

            {loading ? 
                (
                    <Flex w="100%" flex={1} bg="#FCFEFF" borderRadius="xl" boxShadow="md" px={[2, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <Center>
                            <Spinner color="#205583"/>
                        </Center>
                    </Flex>
                ) : (
                    <Flex w="100%" flex={1} bg="#FCFEFF" borderRadius="xl" boxShadow="md" px={[0, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <Flex justifyContent="space-between" display={["none", "none", "none", "none", "flex"]}>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Día</Box>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Hora</Box>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Tipo</Box>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Médico</Box>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Link</Box>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Estado Turno</Box>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Paciente</Box>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Acciones</Box>
                        </Flex>
                        {
                            dataBookings &&
                            dataBookings?.length > 0 &&
                            dataBookings?.map((x, idx) => {
                                let now = new Date();
                                let bookingStart = new Date(x.start.dateTime);
                                let isBookingPassed = now > bookingStart || x.status === "deleted";

                                let extraDate = `${getFormattedDateTime(x.start.dateTime, {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                })}`

                                let hour = `${getFormattedDateTime(x.start.dateTime, {
                                    hour: "numeric",
                                    minute: "numeric",
                                })}`

                                return (
                                    <Flex
                                        key={idx}
                                        display={["block", "flex"]}
                                        flexDirection={["column", "column", "column", "column", "row"]}
                                        alignItems="center"
                                    >
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                            <Text fontSize={["sm", "md"]} color="#205583">{extraDate}</Text>
                                        </Box>
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                            <Text fontSize={["sm", "md"]} color="#205583">{hour}</Text>
                                        </Box>
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                            <Text color="#205583">Online</Text>
                                        </Box>
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                            <Text color="#205583">{x.organizer.name}</Text>
                                        </Box>
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                            {x.status === "deleted" ? (
                                                <Text color="gray">Consulta</Text>
                                            ) : now > bookingStart ? (
                                                <Text color="gray">Consulta</Text>
                                            ) : (
                                                <a href={x.hangoutLink}>
                                                    <Text color="#205583" textDecoration="underline" _hover={{ textDecoration: "none" }}>Consulta</Text>
                                                </a>
                                            )}
                                        </Box>
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" fontWeight="normal" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                            <Text color="#205583">{x.status === "deleted" ? "Cancelado" : now > bookingStart ? "Expiró" : "Confirmado"}</Text>
                                        </Box>
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
                                            <Text color="#205583">{x?.patient?.name} {x?.patient?.lastName}</Text>
                                        </Box>
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" maxWidth={["auto", "auto", "auto", "auto", "14.28%"]}>
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
                                                    <MenuItem onClick={() => handleDeleteEvent(x._id, x.organizer.email)} isDisabled={isBookingPassed}>
                                                        {x.status === "deleted" ? "Cancelado" : now > bookingStart ? "Cancelar turno" : "Cancelar turno"}
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Box>
                                    </Flex>
                                );
                            })
                        }
                    </Flex>
                )
            }
        </Flex>
    )
}

export default History