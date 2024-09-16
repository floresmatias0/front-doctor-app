import {
  Flex,
  Text,
  Button,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
  Spinner,
  Center,
  Heading,
  useDisclosure,
  Link,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../components/context";
import { instance, instanceUpload } from "../utils/axios";
import { AiOutlineEye } from "react-icons/ai";
import { FormHistory } from "./history";
import { AlertModal } from "../components/alerts";
import { MdErrorOutline, MdFileDownload } from "react-icons/md";
import * as XLSX from "xlsx";
import { HiOutlineBadgeCheck } from "react-icons/hi";

const Turns = () => {
  const [dataBookings, setDataBookings] = useState([]);
  const [dataBookingsNext, setDataBookingsNext] = useState([]);
  const [dataExcel, setDataExcel] = useState([]);
  const [bookingSelected, setBookingSelected] = useState({});
  const [documentsSelected, setDocumentsSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { user } = useContext(AppContext);

  const toast = useToast();

  // Estado para el segundo AlertModal
  const {
    isOpen: isOpenHistory,
    onOpen: onOpenHistory,
    onClose: onCloseHistory,
  } = useDisclosure();

  // Estado para el primer AlertModal
  const {
    isOpen: isOpenDocs,
    onOpen: onOpenDocs,
    onClose: onCloseDocs,
  } = useDisclosure();

  const fetchBookings = useCallback(async () => {
    try {
      let bookings = [];
      setLoading(true);
      if (user.role === "DOCTOR" || user.role === "ADMIN") {
        bookings = await instance.get(
          `/calendars/all-events?doctor=${user.email}`
        );
      } else {
        bookings = await instance.get(`/calendars/all-events/${user._id}`);
      }
      const { data } = bookings?.data;

      const filteredBookings = data.filter((booking) => {
        const bookingStart = new Date(booking.originalStartTime);
        return bookingStart >= new Date() && booking.status !== "deleted";
      });

      const filteredBookingsPassed = data.filter((booking) => {
        const bookingStart = new Date(booking.originalStartTime);
        return bookingStart <= new Date() && booking.status !== "deleted";
      });

      if (bookingSelected) {
        const updateBookingSelected = filteredBookingsPassed.find(
          (x) => x?._id === bookingSelected?._id
        );

        setBookingSelected(updateBookingSelected);
      } else {
        setBookingSelected({});
      }

      setLoading(false);
      setDataBookingsNext(filteredBookings);
      setDataBookings(filteredBookingsPassed);
      setDataExcel(data);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
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
      if (response?.success || response?.data?.success) {
        toast({
          position: "top",
          render: () => (
            <Box
              py={4}
              px={8}
              bg="white"
              borderRadius="md"
              maxW={["auto", "428px"]}
              boxShadow="2xl"
            >
              <HiOutlineBadgeCheck
                style={{ width: "36px", height: "36px", color: "#104DBA" }}
              />
              <Text
                color="#104DBA"
                fontSize="2xl"
                fontWeight={700}
                textOverflow="wrap"
                lineHeight="35.16px"
                width="75%"
              >
                Su turno ha sido cancelado exitosamente.
              </Text>
            </Box>
          ),
        });
        await fetchBookings();
      }
    } catch (err) {
      console.log(err.message);
      toast({
        position: "top",
        render: () => (
          <Box
            py={4}
            px={8}
            bg="white"
            borderRadius="md"
            maxW={["auto", "428px"]}
            boxShadow="2xl"
          >
            <MdErrorOutline
              style={{ width: "36px", height: "36px", color: "red" }}
            />
            <Text
              color="#104DBA"
              fontSize="2xl"
              fontWeight={700}
              textOverflow="wrap"
              lineHeight="35.16px"
              width="75%"
            >
              Ocurrio un error inesperado, intenta de nuevo mas tarde.
            </Text>
          </Box>
        ),
      });
    }
  };

  const headingTable = [
    {
      name: "paciente",
      detail: "",
    },
    {
      name: "obra social",
      detail: "",
    },
    {
      name: "n° afiliado",
      detail: "",
    },
    {
      name: "fecha",
      detail: "",
    },
    {
      name: "hora",
      detail: "",
    },
    {
      name: "tipo",
      detail: "",
    },
    {
      name: "link",
      detail: "",
    },
    {
      name: "estado de turno",
      detail: "",
    },
    {
      name: "tutor",
      detail: "",
    },
    {
      name: "acciones",
      detail: "",
    },
  ];

  const headingTablePassed = [
    {
      name: "paciente",
      detail: "",
    },
    {
      name: "fecha",
      detail: "",
    },
    {
      name: "hora",
      detail: "",
    },
    {
      name: "tipo",
      detail: "",
    },
    {
      name: "link",
      detail: "",
    },
    {
      name: "estado de turno",
      detail: "",
    },
    {
      name: "tutor",
      detail: "",
    },
    {
      name: "acciones",
      detail: "",
    },
  ];

  const handleSelectHistory = (booking) => {
    setBookingSelected(booking);
    onOpenHistory();
  };

  const handleCloseHistory = () => {
    setBookingSelected({});
    onCloseHistory();
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

    if (files?.length > 0) {
      try {
        if (images) {
          setUploadLoading(true);
          await instanceUpload.post("/certificates/uploads", formData);
          await fetchBookings();
          setUploadLoading(false);

          return toast({
            title: "Certificado guardado",
            description: "Se ha guardado satisfactoriamente",
            position: "top-right",
            isClosable: true,
            duration: 6000,
            status: "success",
          });
        }

        setUploadLoading(false);
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
        setUploadLoading(false);
        return toast({
          title: "Error al intentar guardar el certificado",
          description: error.message,
          position: "top-right",
          isClosable: true,
          duration: 6000,
          status: "error",
        });
      }
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

  const handleShowDocuments = (documents) => {
    setDocumentsSelected(documents);
    onOpenDocs();
  };

  const handleDeleteCertificate = async (bookingId, certificateId) => {
    try {
      await instance.delete(
        `/certificates/booking/${certificateId}?bookingId=${bookingId}`
      );
      await fetchBookings();
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }
  };

  const handleDownloadFileExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Turnos");

    XLSX.writeFile(workbook, "Turnos.xlsx");
  };

  return (
    <Flex
      w={["full", "calc(100% - 155px)"]}
      h="100%"
      justifyContent={["top", "top"]}
      flexDirection="column"
    >
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
            <Spinner color="#205583" />
          </Center>
        </Flex>
      ) : (
        <Box overflowY="auto">
          <Heading
            fontSize={["15px", "25px"]}
            fontWeight={700}
            lineHeight={["17.58px", "29.3px"]}
            color="#104DBA"
            border={["1px solid #104DBA", "none"]}
            px={[4, 0]}
            py={[0.5, 0]}
            rounded={["xl", "none"]}
            w={["110px", "auto"]}
            mb={4}
          >
            Mis turnos
          </Heading>
          <Box>
            <Heading
              as="h2"
              fontSize={["15px", "29px"]}
              lineHeight={["17.58px", "33.98px"]}
              fontWeight={700}
              color="#104DBA"
              mb={4}
            >
              Turnos próximos
            </Heading>
            {dataBookingsNext?.length > 0 ? (
              <TableContainer
                borderTopStartRadius="15px"
                borderTopEndRadius="15px"
                borderBottomStartRadius="15px"
                borderBottomEndRadius="15px"
                boxShadow="0px 4px 4px 0px #00000040"
                overflow="auto"
                order={5}
              >
                <Table size="md" variant="unstyled">
                  <Thead bgColor="#104DBA" boxShadow="xl" height={50}>
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
                    {dataBookingsNext?.length > 0 &&
                      dataBookingsNext
                        ?.map((x, idx) => {
                          let now = new Date();

                          let bookingStart = new Date(x.originalStartTime);

                          let hoursDifference =
                            (bookingStart - now) / (1000 * 60 * 60);

                          let canCancel = hoursDifference > 24;

                          let isBookingPassed =
                            now > bookingStart ||
                            x.status === "deleted" ||
                            !canCancel;

                          return (
                            <Tr
                              key={idx}
                              fontSize="12px"
                              fontWeight={400}
                              lineHeight="14.06px"
                              textTransform="uppercase"
                              px={8}
                              textAlign="center"
                            >
                              <Td textAlign="center">{x.patientName}</Td>
                              <Td textAlign="center">{x.patientSocialWork}</Td>
                              <Td textAlign="center">
                                {x.patientSocialWorkId}
                              </Td>
                              <Td textAlign="center">{x.beginning}</Td>
                              <Td textAlign="center">{x.startTime}</Td>
                              <Td textAlign="center">Consulta</Td>
                              <Td textAlign="center">
                                {x.status === "deleted" ? (
                                  <Text color="gray">No disponible</Text>
                                ) : now > bookingStart ? (
                                  <Text color="gray">No disponible</Text>
                                ) : (
                                  <Link href={x.link} target="_blank">
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
                                {x.status === "deleted"
                                  ? "Cancelado"
                                  : now > bookingStart
                                  ? "Expiró"
                                  : "Confirmado"}
                              </Td>
                              <Td textAlign="center">{x?.tutorName}</Td>
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
                                        zIndex: 3,
                                      }}
                                      onClick={() =>
                                        handleShowDocuments(x.certificate)
                                      }
                                    >
                                      <Text
                                        fontSize={[
                                          "8px",
                                          "8px",
                                          "8px",
                                          "8px",
                                          "10px",
                                        ]}
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
                                    onClick={() =>
                                      handleDeleteEvent(
                                        x?.bookingId,
                                        x?.doctorEmail
                                      )
                                    }
                                    isDisabled={isBookingPassed}
                                    _disabled={{
                                      opacity: 1,
                                      bg: "#DCDCDC",
                                    }}
                                    _hover={{
                                      bg: isBookingPassed ? "" : "inherit",
                                    }}
                                  >
                                    <Text
                                      fontSize={[
                                        "8px",
                                        "8px",
                                        "8px",
                                        "8px",
                                        "10px",
                                      ]}
                                      fontWeight={400}
                                      textTransform="uppercase"
                                      lineHeight="11.72px"
                                    >
                                      {x.status === "deleted"
                                        ? "Cancelado"
                                        : now > bookingStart
                                        ? "Cancelar"
                                        : "Cancelar"}
                                    </Text>
                                  </Button>
                                </Box>
                              </Td>
                            </Tr>
                          );
                        })
                        .slice(0, 5)}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text>No tienes turnos proximos</Text>
            )}
          </Box>

          <Box>
            <Flex justifyContent="space-between" alignItems="center">
              <Heading
                as="h2"
                fontSize={["15px", "29px"]}
                lineHeight={["17.58px", "33.98px"]}
                fontWeight={700}
                color="#104DBA"
                my={4}
              >
                Historial de turnos
              </Heading>
              {user?.role === "ADMIN" ||
                (user?.role === "DOCTOR" && (
                  <Button
                    onClick={handleDownloadFileExcel}
                    title="Exportar a excel"
                    size={["xs", "sm"]}
                    variant="unstyled"
                    display="flex"
                    borderWidth={1}
                    px={3}
                    borderColor="#104DBA"
                    borderRadius="full"
                    _hover={{
                      backgroundColor: "#104DBA",
                      "svg, p": {
                        color: "#FFF",
                        fill: "#FFF",
                        transition: "all 1 ease-in-out",
                      },
                    }}
                    isDisabled={dataBookings?.length === 0}
                  >
                    <Text
                      display={["none", "inline-block"]}
                      pr={[0, 2]}
                      color="#104DBA"
                      fontWeight={500}
                    >
                      Exportar a excel
                    </Text>
                    <MdFileDownload color="#104DBA" />
                  </Button>
                ))}
            </Flex>
            <TableContainer
              borderTopStartRadius="15px"
              borderTopEndRadius="15px"
              borderBottomStartRadius="15px"
              borderBottomEndRadius="15px"
              boxShadow="0px 4px 4px 0px #00000040"
              overflow="auto"
              order={5}
            >
              <Table size="md" variant="unstyled">
                <Thead bgColor="#104DBA" boxShadow="xl" height={50}>
                  <Tr>
                    {headingTablePassed
                      ?.map((h, idx) => (
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
                      ))
                      .slice(0, 7)}
                  </Tr>
                </Thead>
                <Tbody>
                  {dataBookings?.length > 0 &&
                    dataBookings
                      ?.map((x, idx) => {
                        let now = new Date();
                        let bookingStart = new Date(x.originalStartTime);

                        return (
                          <Tr
                            key={idx}
                            fontSize="12px"
                            fontWeight={400}
                            lineHeight="14.06px"
                            textTransform="uppercase"
                            px={8}
                            textAlign="center"
                          >
                            <Td textAlign="center">{x.patientName}</Td>
                            <Td textAlign="center">{x.beginning}</Td>
                            <Td textAlign="center">{x.startTime}</Td>
                            <Td textAlign="center">Consulta</Td>
                            <Td textAlign="center">
                              {x.status === "deleted" ? (
                                <Text color="gray">No disponible</Text>
                              ) : now > bookingStart ? (
                                <Text color="gray">No disponible</Text>
                              ) : (
                                <Link href={x.link} target="_blank">
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
                              {x.status === "deleted"
                                ? "Cancelado"
                                : now > bookingStart
                                ? "Expiró"
                                : "Confirmado"}
                            </Td>
                            <Td textAlign="center">
                              <Button
                                onClick={() => handleSelectHistory(x)}
                                variant="unstyled"
                              >
                                <AiOutlineEye
                                  style={{ width: "24px", height: "24px" }}
                                />
                              </Button>
                            </Td>
                          </Tr>
                        );
                      })
                      .slice(0, 5)}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
      <AlertModal
        onClose={handleCloseHistory}
        isOpen={isOpenHistory}
        alertHeader="Consulta"
        alertBody={
          <FormHistory
            values={bookingSelected}
            role={user.role}
            handleFileInputChange={handleFileInputChange}
            handleDeleteEvent={handleDeleteEvent}
            handleUpdateBooking={updateDetails}
            uploadLoading={uploadLoading}
            handleDeleteCertificate={handleDeleteCertificate}
          />
        }
        isLoading={false}
      />
      <AlertModal
        customWidth={300}
        onClose={onCloseDocs}
        isOpen={isOpenDocs}
        alertHeader="Documentos"
        alertBody={
          <Box>
            {documentsSelected?.map((doc, idx) => (
              <Flex key={idx} justifyContent="space-between">
                <Text>{doc?.name}</Text>
                <Link
                  href={doc?.url}
                  target="_blank"
                  color="#104DBA"
                  fontWeight={700}
                >
                  Ver
                </Link>
              </Flex>
            ))}
          </Box>
        }
        isLoading={false}
      />
    </Flex>
  );
};

export default Turns;
