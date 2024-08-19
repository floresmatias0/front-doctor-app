import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  Link,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
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
import { format } from "date-fns";
import { IoMdCalendar } from "react-icons/io";

import { es } from 'date-fns/locale';
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { MdErrorOutline } from "react-icons/md";


const getFormattedDateTime = (dateTimeStr, options) => {
  const dateTime = new Date(dateTimeStr);
  return dateTime.toLocaleString("es", options);
};

export const FormHistory = ({
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
    <Box px={2}>
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
            color="#104DBA"
            textDecoration="underline"
            _hover={{ textDecoration: "none" }}
            textAlign="right"
          >
            Ir a la consulta
          </Text>
        </Link>
      )}
      <Text color="#104DBA" textAlign="left">
        Doctor: {values.organizer.name}
      </Text>
      <Text color="#104DBA" textAlign="left">
        Paciente: {values?.patient?.name} {values?.patient?.lastName}
      </Text>
      <Text fontSize={["sm", "md"]} color="#104DBA" textAlign="left">
        Fecha: {extraDate}
      </Text>
      <Text fontSize={["sm", "md"]} color="#104DBA" textAlign="left">
        Hora: {hour}hs a {endHour}hs
      </Text>
      <Text color="#104DBA">
        Estado:{" "}
        {values.status === "deleted"
          ? "Cancelado"
          : now > bookingStart
          ? "Expiró"
          : "Confirmado"}
      </Text>

      <Box my={4}>
        <Text color="#104DBA" fontSize={18} fontWeight={600}>
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
        <Text color="#104DBA" fontSize={18} fontWeight={600}>
          Certificados y resultados
        </Text>
        <Divider my={2} />
        <Box mb={4}>
          {values?.certificate?.length > 0 &&
            values.certificate.map((c, idx) => (
              <Flex gap={2}>
                <Text>Documento {idx + 1}</Text>
                  <Link key={idx} href={c.url} target="_blank" bg="#EDF2F7" px={2} rounded="md" fontSize="xs" alignContent="center" fontWeight={700} _hover={{ bg: "#EDF2F7" }} rel="noopener noreferrer" download={c.name.trim()}>
                    Ver
                  </Link>
              </Flex>
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
  const [loading, setLoading] = useState(false);
  const [documentsSelected, setDocumentsSelected] = useState([])
  const [turnSelected, setTurnSelected] = useState("")

  const { user } = useContext(AppContext);

  // Estado para el primer AlertModal
  const {
    isOpen: isOpenDocs,
    onOpen: onOpenDocs,
    onClose: onCloseDocs,
  } = useDisclosure();

  // Estado para el segundo AlertModal
  const {
    isOpen: isOpenCancelTurn,
    onOpen: onOpenCancelTurn,
    onClose: onCloseCancelTurn,
  } = useDisclosure();

  const fetchBookings = useCallback(async () => {
    try {
      let bookings = [];

      if (user.role === "DOCTOR") {
        bookings = await instance.get(
          `/calendars/all-events?doctor=${user.email}`
        );

        return setDataBookings(bookings.data.data);
      }

      bookings = await instance.get(`/calendars/all-events/${user._id}`);

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
      if (response?.success) {
        toast({
          position: "top",
          render: () => (
              <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto","428px"]} boxShadow="2xl">
                  <HiOutlineBadgeCheck  style={{ width: "36px", height: "36px", color:"#104DBA" }}/>
                  <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">Su turno ha sido cancelado exitosamente.</Text>
              </Box>
          )
        })
        return await fetchBookings();
      }

      toast({
        position: "top",
        render: () => (
            <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto","428px"]} boxShadow="2xl">
                <MdErrorOutline  style={{ width: "36px", height: "36px", color:"red" }}/>
                <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">Ocurrio un error inesperado, intenta de nuevo mas tarde.</Text>
            </Box>
        )
      })
    } catch (err) {
      toast({
        position: "top",
        render: () => (
            <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto","428px"]} boxShadow="2xl">
                <MdErrorOutline  style={{ width: "36px", height: "36px", color:"red" }}/>
                <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">Ocurrio un error inesperado, intenta de nuevo mas tarde.</Text>
            </Box>
        )
      })
    }
  };

  const handleShowDocuments = (documents) => {
    setDocumentsSelected(documents)
    onOpenDocs()
  }

  const handleShowCancelTurn = (turn) => {
    setTurnSelected(turn)
    onOpenCancelTurn()
  }

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
      w={["full", "calc(100% - 155px)"]}
      h="100%"
      justifyContent={["top", "top"]}
      flexDirection="column"
    >
      <Box maxW={["full", "1240px", "full"]}>
        {/* CONTENT */}
        <Box>
          <Heading
            fontSize={["15px", "25px"]}
            fontWeight={700}
            lineHeight={["17.58px", "29.3px"]}
            color="#104DBA"
            border={["1px solid #104DBA", "none"]}
            px={[4, 0]}
            py={[0.5, 0]}
            rounded={["xl", "none"]}
            mb={6}
            width="160px"
          >
            Historial de turnos
          </Heading>
          {loading ? (
            <Flex
              w="100%"
              flex={1}
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
              maxH="450px"
              overflowY="auto"
            >
              <Table
                size="md"
                variant="unstyled"
              >
                <Thead
                  bgColor="#104DBA"
                  boxShadow="xl"
                  height={50}
                  position="sticky"
                  top={0}
                  zIndex={3}
                >
                  <Tr>
                    {headingTable?.map((h, idx) => (
                      <Th
                        key={idx}
                        color="#FFF"
                        fontWeight={500}
                        fontSize="16px"
                        lineHeight="18.75px"
                        px={8}
                        textAlign="center"
                      >
                        {h?.name}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {dataBookings?.length > 0 && dataBookings?.map((x, idx) => {
                    let now = new Date();
                    let bookingStart = new Date(x.start.dateTime);
                    let isBookingPassed = now > bookingStart || x.status === "deleted";

                    let startDate = new Date(x.start.dateTime).toLocaleDateString('es-AR', { timeZone: "America/Argentina/Buenos_Aires" });
                    let hourDate = new Date(x.start.dateTime).toLocaleTimeString('es-AR', {
                        hour: "numeric",
                        minute: "numeric",
                        timeZone: "America/Argentina/Buenos_Aires"
                    });

                    return (
                      <Tr
                        key={idx}
                        fontSize="12px"
                        fontWeight={400}
                        lineHeight="14.06px"
                        textTransform="uppercase"
                        px={[0, 8]}
                        textAlign="center"
                      >
                        <Td textAlign="center">DR. {x.organizer.name}</Td>
                        <Td textAlign="center">{startDate}</Td>
                        <Td textAlign="center">{hourDate}</Td>
                        <Td textAlign="center">Consulta</Td>
                        <Td textAlign="center">
                          {x.status === "deleted" ? (
                            <Text color="gray">No disponible</Text>
                          ) : now > bookingStart ? (
                            <Text color="gray">No disponible</Text>
                          ) : (
                            <Link href={x.hangoutLink} target="_blank">
                              <Text
                                color="#104DBA"
                                textDecoration="underline"
                                _hover={{ textDecoration: "none" }}
                              >
                                Ir a la consulta
                              </Text>
                            </Link>
                          )}
                        </Td>
                        <Td textAlign="center">
                          {x.status === "deleted" ? "Cancelado" : now > bookingStart ? "Expiró" : "Confirmado"}
                        </Td>
                        <Td textAlign="center">
                          {x?.patient?.firstName} {x?.patient?.lastName}
                        </Td>
                        <Td textAlign="center">
                          <Box w="full" h="full" position="relative">
                            {x?.certificate?.length > 0 && (
                              <Button
                                padding={0}
                                position="absolute"
                                top="-12px"
                                left="0"
                                w="calc(100% - 20px)"
                                bg="#38C521"
                                color="#FFF"
                                size="xs"
                                rounded="xl"
                                transform="translateX(0px)"
                                transition="transform 0.8s, z-index 0.3s"
                                zIndex={1}
                                _hover={{
                                  transform: "translateX(20px)",
                                  zIndex: 3
                                }}
                                onClick={() => handleShowDocuments(x.certificate)}
                              >
                                <Text
                                  fontSize={["8px", "8px", "8px", "8px", "10px"]}
                                  fontWeight={400}
                                  textTransform="uppercase"
                                  lineHeight="11.72px"
                                >
                                  DOCUMENTOS
                                </Text>
                              </Button>
                            )}
                            <Button
                              padding={0}
                              px={4}
                              position="absolute"
                              top="-12px"
                              left="0"
                              w="calc(100% - 20px)"
                              bg="#FF0000"
                              color="#FFF"
                              size="xs"
                              rounded="xl"
                              transform="translateX(20px)"
                              transition="transform 0.5s, z-index 0.5s"
                              zIndex={2}
                              onClick={() => handleShowCancelTurn(x)}
                              isDisabled={isBookingPassed}
                              _disabled={{
                                opacity: 1,
                                bg: "#DCDCDC"
                              }}
                              _hover={{
                                bg: isBookingPassed ? "" : "inherit"
                              }}
                            >
                              <Text
                                fontSize={["8px", "8px", "8px", "8px", "10px"]}
                                fontWeight={400}
                                textTransform="uppercase"
                                lineHeight="11.72px"
                              >
                                {x.status === "deleted"
                                  ? "Cancelado"
                                  : now > bookingStart
                                  ? "Cancelar turno"
                                  : "Cancelar turno"}
                              </Text>
                            </Button>
                          </Box>
                        </Td>
                      </Tr>
                    )
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          <Flex justifyContent="flex-end" alignItems="center" my={8}>
            <Button bg="#104DBA" color="#FFFFFF" w={["auto", "222px"]} size={["xs", "sm"]} onClick={() => navigate('/turnos')} fontSize='16px' fontWeight={500}>
              SOLICITAR NUEVO TURNO
            </Button>
          </Flex>
        </Box>
      </Box>
      <AlertModal
        customWidth={300}
        onClose={onCloseDocs}
        isOpen={isOpenDocs}
        alertHeader="Documentos"
        alertBody={
          <Box>
            {documentsSelected?.map((doc, idx) => (
              <Flex key={idx} justifyContent="space-between" px={2}>
                <Text>{doc?.name}</Text>
                <Link href={doc?.url} target="_blank" color="#104DBA" fontWeight={700}>Ver</Link>
              </Flex>
            ))}
          </Box>
        }
        isLoading={false}
      >
      </AlertModal>
      {/* Modal cancelar turno */}
      <AlertModal
        customWidth={300}
        onClose={onCloseCancelTurn}
        isOpen={isOpenCancelTurn}
        alertHeader=""
        alertBody={
          <Box w="full" px={2}>
            <Text lineHeight="18.55px" fontSize="md" color="#000" mb={4} fontWeight={400}>
              ¿Desea confirmar la cancelación del siguiente turno?
            </Text>
            {turnSelected && (
              <Box boxShadow="0px 3px 3px 0px #00000040" pb={2} rounded="lg">
                <Flex
                  w="full"
                  h="auto"
                  justifyContent="space-around"
                  px={2}
                  py={4}
                  mx="auto"
                  gap={2}
                >
                  <Image
                    rounded="full"
                    src={turnSelected?.organizer?.picture}
                    w="48px"
                    h="48px"
                  />
                  <Flex flex={1} flexDirection="column" justifyContent="space-between" alignItems="start">
                    <Box>
                      <Text
                        fontSize="15px"
                        textTransform="capitalize"
                        fontWeight={700}
                        lineHeight="12.3px"
                        textAlign="left"
                      >
                        Dr. {turnSelected?.organizer?.name}
                      </Text>
                      <Text fontSize="sm" fontWeight={400} lineHeight="10.55px">
                        {turnSelected?.organizer?.especialization}
                      </Text>
                    </Box>
                    <Box>
                      <Flex alignItems="center" gap={1}>
                        <IoMdCalendar style={{ color: "#AAAAAA" }} />
                        <Text fontSize={["xs", "sm"]} fontWeight={300} lineHeight="10.55px">{format(new Date(turnSelected?.start?.dateTime), "d  MMMM yyyy, HH:mm 'Hs.'", { locale: es })}</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
                <Divider />
                <Text fontSize="sm" fontWeight={300} lineHeight="10.55px" textAlign="center" mt={4} mb={1}>
                  Valor de la consulta: ${turnSelected?.organizer?.price}
                </Text>
              </Box>
            )}

            <Button
              padding={0}
              px={4}
              bg="#FF0000"
              color="#FFF"
              size="xs"
              rounded="md"
              onClick={() => handleDeleteEvent(turnSelected?._id, turnSelected?.organizer?.email)}
              float="right"
              mt={4}
            >
              <Text
                fontSize="xs"
                fontWeight={400}
                textTransform="uppercase"
                lineHeight="11.72px"
              >
                Cancelar turno
              </Text>
            </Button>
          </Box>
        }
        isLoading={false}
      >
      </AlertModal>
    </Flex>
  );
};

export default History;
