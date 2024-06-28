import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  IconButton,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
  SimpleGrid,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Tfoot,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../components/context";
import { instance, instanceUpload } from "../utils/axios";
import { AlertModal } from "../components/alerts";
import { useNavigate } from "react-router-dom";

const getFormattedDateTime = (dateTimeStr, options) => {
  const dateTime = new Date(dateTimeStr);
  return dateTime.toLocaleString("es", options);
};

const FormHistory = ({
  values,
  role,
  handleUpdateBooking,
  handleFileInputChange,
  handleDeleteEvent,
}) => {
  const [details, setDetails] = useState(values?.details || "");

  let now = new Date();
  let bookingStart = new Date(values.start.dateTime);
  let isBookingPassed = now > bookingStart || values.status === "deleted";

  let extraDate = `${getFormattedDateTime(values.start.dateTime, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  })}`;

  let hour = `${getFormattedDateTime(values.start.dateTime, {
    hour: "numeric",
    minute: "numeric",
  })}`;

  let endHour = `${getFormattedDateTime(values.end.dateTime, {
    hour: "numeric",
    minute: "numeric",
  })}`;

  const handleDetails = (e) => {
    setDetails(e.target.value);
  };

  return (
    <Box>
      {values.status === "deleted" ? (
        <Text color="gray" textAlign="right">
          Consulta no disponible
        </Text>
      ) : now > bookingStart ? (
        <Text color="gray" textAlign="right">
          Consulta no disponible
        </Text>
      ) : (
        <Link href={values.hangoutLink}>
          <Text
            color="#205583"
            textDecoration="underline"
            _hover={{ textDecoration: "none" }}
            textAlign="right"
          >
            Ir a la consulta
          </Text>
        </Link>
      )}
      <Text color="#205583" textAlign="left">
        Doctor: {values.organizer.name}
      </Text>
      <Text color="#205583" textAlign="left">
        Paciente: {values?.patient?.name} {values?.patient?.lastName}
      </Text>
      <Text fontSize={["sm", "md"]} color="#205583" textAlign="left">
        Fecha: {extraDate}
      </Text>
      <Text fontSize={["sm", "md"]} color="#205583" textAlign="left">
        Hora: {hour}hs a {endHour}hs
      </Text>
      <Text color="#205583">
        Estado:{" "}
        {values.status === "deleted"
          ? "Cancelado"
          : now > bookingStart
          ? "Expiró"
          : "Confirmado"}
      </Text>

      <Box my={4}>
        <Text color="#205583" fontSize={18} fontWeight={600}>
          Detalle de la consulta
        </Text>
        <Divider my={2} />
        <Textarea
          placeholder="Detalles de la consulta"
          disabled={role !== "DOCTOR"}
          value={details}
          onChange={handleDetails}
        />

        {role === "DOCTOR" && (
          <Button
            onClick={() => handleUpdateBooking(values._id, details)}
            my={2}
            size="sm"
          >
            Actualizar detalle
          </Button>
        )}
      </Box>
      <Box my={4}>
        <Text color="#205583" fontSize={18} fontWeight={600}>
          Certificados
        </Text>
        <Divider my={2} />
        <Box mb={4}>
          {values?.certificate?.length > 0 &&
            values.certificate.map((c, idx) => (
              <Link key={idx} href={c.url}>
                Ver certificado {idx + 1}
              </Link>
            ))}
        </Box>
        {role === "DOCTOR" && (
          <Button position="relative" size="sm">
            <Input
              id="file-input"
              type="file"
              placeholder="Cargar certificado"
              size="sm"
              onChange={(e) =>
                handleFileInputChange(
                  e,
                  values?.organizer?._id,
                  values?.patient?._id,
                  values?._id
                )
              }
              multiple
              style={{ opacity: 0 }}
              position="absolute"
              top="0"
              left="0"
              w="full"
            />
            Cargar certificado
          </Button>
        )}
        <Divider my={4} />
        <Button
          onClick={() => handleDeleteEvent(values._id, values.organizer.email)}
          isDisabled={isBookingPassed}
          colorScheme="red"
          alignContent="center"
          size="sm"
          w="full"
        >
          {values.status === "deleted"
            ? "Cancelado"
            : now > bookingStart
            ? "Cancelar turno"
            : "Cancelar turno"}
        </Button>
      </Box>
    </Box>
  );
};

const History = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [dataBookings, setDataBookings] = useState([]);
  const [originalDataBookings, setOriginalDataBookings] = useState([]);
  const [patientSelected, setPatientSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [bookingSelected, setBookingSelected] = useState({});

  const { user, patients } = useContext(AppContext);

  // Estado para el segundo AlertModal
  const {
    isOpen: isOpenHistory,
    onOpen: onOpenHistory,
    onClose: onCloseHistory,
  } = useDisclosure();

  const fetchBookings = useCallback(async () => {
    try {
      let bookings = [];

      if (user.role === "DOCTOR") {
        bookings = await instance.get(
          `/calendars/all-events?doctor=${user.email}`
        );

        setOriginalDataBookings(bookings.data.data);
        return setDataBookings(bookings.data.data);
      }

      bookings = await instance.get(`/calendars/all-events/${user._id}`);

      setOriginalDataBookings(bookings.data.data);
      setDataBookings(bookings.data.data);
    } catch (err) {
      throw new Error(err.message);
    }
  }, [user]);

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
  }, [fetchBookings, user]);

  const handleDeleteEvent = async (bookingId, userEmail) => {
    try {
      const response = await instance.delete(
        `/calendars/${bookingId}?email=${userEmail}`
      );
      if (response.success) {
        toast({
          title: "Consulta cancelada con exito",
          description: "",
          position: "top-right",
          isClosable: true,
          duration: 3000,
          status: "success",
        });
        return await fetchBookings();
      }

      toast({
        title: "Error al intentar cancelar",
        description: "Vuelva a intentar porfavor",
        position: "top-right",
        isClosable: true,
        duration: 3000,
        status: "error",
      });
    } catch (err) {
      console.log(err.message);
      toast({
        title: "Error inesperado",
        description: err.message,
        position: "top-right",
        isClosable: true,
        duration: 3000,
        status: "error",
      });
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;

    const selected = patients.find((patient) => patient.value === value);
    setPatientSelected(selected);

    const isPatientInBookings = dataBookings.some(
      (booking) => booking?.patient?.dni === value
    );

    if (isPatientInBookings) {
      let bookingsFiltered = dataBookings.filter(
        (booking) => booking?.patient?.dni === value
      );
      return setDataBookings(bookingsFiltered);
    }

    if (value) {
      toast({
        title: "Error en filtrado",
        description: "No se encontro ningun paciente con ese nombre",
        position: "top-right",
        isClosable: true,
        duration: 3000,
        status: "error",
      });
    }

    setDataBookings(originalDataBookings);
  };

  const handleFileInputChange = async (e, doctorId, patientId, bookingId) => {
    const formData = new FormData();
    const images = e.target.files;
    // Convierte la colección de archivos en un array
    const files = Array.from(images);

    // Utiliza Promise.all para esperar a que se completen todas las promesas
    await Promise.all(
      files.map(async (file) => {
        return new Promise((resolve) => {
          // Haces el push al array dentro de la promesa
          // Esto asegura que el push se complete antes de continuar
          formData.append("files", file);
          resolve();
        });
      })
    );

    formData.append("doctorId", doctorId);
    formData.append("patientId", patientId);
    formData.append("bookingId", bookingId);

    try {
      if (images) {
        setLoading(true);
        await instanceUpload.post("/certificates/uploads", formData);
        await fetchBookings();
        setLoading(false);

        return toast({
          title: "Certificado guardado",
          description: "Se ha guardado satisfactoriamente",
          position: "top-right",
          isClosable: true,
          duration: 6000,
          status: "success",
        });
      }

      setLoading(false);
      toast({
        title: "Error al intentar guardar el certificado",
        description: "Debe seleccionar uno o mas documentos",
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: "error",
      });
    } catch (error) {
      // Maneja cualquier error de la solicitud, por ejemplo, muestra un mensaje de error.
      setLoading(false);
      return toast({
        title: "Error al intentar guardar el certificado",
        description: error.message,
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: "error",
      });
    }
  };

  const updateDetails = async (bookingId, details) => {
    try {
      const response = await instance.patch(
        `/calendars/update-booking/${bookingId}`,
        { details }
      );

      if (response.data.success) {
        toast({
          title: "Detalle de consulta",
          description: "Actualizado con exito",
          position: "top-right",
          isClosable: true,
          duration: 3000,
          status: "success",
        });
        return await fetchBookings();
      }

      toast({
        title: "Algo salio mal",
        description: "Intentalo de nuevo",
        position: "top-right",
        isClosable: true,
        duration: 3000,
        status: "warning",
      });
    } catch (err) {
      toast({
        title: "Error al tratar de actualizar consulta",
        description: err.message,
        position: "top-right",
        isClosable: true,
        duration: 3000,
        status: "error",
      });
      throw new Error(err.message);
    }
  };

  const handleSelectHistory = (booking) => {
    setBookingSelected(booking);
    onOpenHistory();
  };

  const headingTable = [
    {
      name: "medico",
      detail: ""
    },
    {
      name: "fecha",
      detail: ""
    },
    {
      name: "hora",
      detail: ""
    },
    {
      name: "tipo",
      detail: ""
    },
    {
      name: "link",
      detail: ""
    },
    {
      name: "estado de turno",
      detail: ""
    },
    {
      name: "paciente",
      detail: ""
    },
    {
      name: "acciones",
      detail: ""
    }
  ]

  return (
    <Flex
      w={["calc(100% - 60px)", "calc(100% - 155px)"]}
      h="100%"
      justifyContent={["center", "top"]}
      flexDirection="column"
    >
      <Box maxW={["full", "1240px", "full"]}>
        {/* CONTENT */}
        <Box>
          <Heading fontSize="2xl" color="#104DBA" lineHeight="29.3px" mb={6}>
            Historial de turnos
          </Heading>
          {loading ? (
            <Flex
              w="100%"
              flex={1}
              bg="#FCFEFF"
              borderRadius="xl"
              boxShadow="md"
              px={[2, 2, 4]}
              py={4}
              flexDirection="column"
              overflow="auto"
            >
              <Center>
                <Spinner color="#104DBA" />
              </Center>
            </Flex>
            ) : (
            <TableContainer
              borderTopStartRadius="15px"
              borderTopEndRadius="15px"
              borderBottomStartRadius="15px"
              borderBottomEndRadius="15px"
              boxShadow="0px 4px 4px 0px #00000040"
              overflow="hidden"
            >
              <Table
                size='sm'
                variant="unstyled"
              >
                <Thead
                  bgColor="#104DBA"
                  boxShadow="xl"
                  height={50}
                >
                  <Tr>
                    {headingTable?.map((h, idx) => (
                      <Th key={idx} color="#FFF" fontWeight={500} fontSize="16px" lineHeight="18.75px" px={8} textAlign="center">{h?.name}</Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {dataBookings?.length > 0 && dataBookings?.map((x, idx) => {
                    let now = new Date();
                    let bookingStart = new Date(x.start.dateTime);
                    let isBookingPassed = now > bookingStart || x.status === "deleted";

                    let extraDate = `${getFormattedDateTime(x.start.dateTime, { day: "numeric", month: "numeric", year: "numeric"})}`;

                    let hour = `${getFormattedDateTime(x.start.dateTime, { hour: "numeric", minute: "numeric" })}`;
                    // let endHour = `${getFormattedDateTime(x.end.dateTime, { hour: "numeric", minute: "numeric" })}`;

                    return (
                      <Tr key={idx} fontSize="12px" fontWeight={400} lineHeight="14.06px" textTransform="uppercase" px={8} textAlign="center">
                        <Td textAlign="center">DR. {x.organizer.name}</Td>
                        <Td textAlign="center">{extraDate}</Td>
                        <Td textAlign="center">{hour}</Td>
                        <Td textAlign="center">Consulta</Td>
                        <Td textAlign="center">
                        {x.status === "deleted" ? (
                            <Text color="gray">No disponible</Text>
                          ) : now > bookingStart ? (
                            <Text color="gray">No disponible</Text>
                          ) : (
                            <a href={x.hangoutLink} target="_blank">
                              <Text
                                color="#104DBA"
                                textDecoration="underline"
                                _hover={{ textDecoration: "none" }}
                              >
                                Ir a la consulta
                              </Text>
                            </a>
                          )}
                        </Td>
                        <Td textAlign="center">
                          {x.status === "deleted" ? "Cancelado" : now > bookingStart ? "Expiró" : "Confirmado"}
                        </Td>
                        <Td textAlign="center">
                          {x?.patient?.firstName} {x?.patient?.lastName}
                        </Td>
                        <Td textAlign="center">
                          <Button isDisabled={user?.role !== "DOCTOR" ? isBookingPassed : false} size="sm" bgColor="#FF0000" _hover={{ bgColor: "#FF000099" }} rounded="full" onClick={user?.role === "DOCTOR" ? () => handleSelectHistory(x) : () => handleDeleteEvent(x?.booking_id, x?.organizer?.email)}>
                            <Text color="#FFF">{user?.role === "DOCTOR" ? "ACCIONES" : "CANCELAR TURNO"}</Text>
                          </Button>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          {user.role !== "DOCTOR" && (
            <Flex justifyContent="flex-end" alignItems="center" my={8}>
              <Button bg="#104DBA" color="#FFFFFF" w="222px" size="sm" onClick={() => navigate('/turnos')} fontSize='16px' fontWeight={500}>
                SOLICITAR NUEVO TURNO
              </Button>
            </Flex>
          )}
        </Box>
      </Box>
      <AlertModal
        onClose={onCloseHistory}
        isOpen={isOpenHistory}
        alertHeader="Consulta"
        alertBody={
          <FormHistory
            values={bookingSelected}
            role={user.role}
            handleFileInputChange={handleFileInputChange}
            handleDeleteEvent={handleDeleteEvent}
            handleUpdateBooking={updateDetails}
          />
        }
        isLoading={false}
      />
    </Flex>
  );
};

export default History;
