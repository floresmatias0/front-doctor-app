import React, { useState, useCallback, useEffect, useContext } from 'react';
import { Button, Flex, Text, Box, Spinner, Table, TableContainer, Tbody, Td, Th, Thead, Tr, Center, Image, useDisclosure, Divider, Link, useToast } from "@chakra-ui/react";
import { AppContext } from "../components/context";
import { instance } from "../utils/axios";
import { AlertModal } from "../components/alerts";
import { IoMdCalendar } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { MdErrorOutline } from "react-icons/md";
import RatingPopup from '../components/rating-popup';

import BookingReminder from "../components/BookingReminder";
import "../styles/BookingReminder.css"
const Home = () => {
  const toast = useToast();
  const { user } = useContext(AppContext);

  const [nextBooking, setNextBooking] = useState(null);
  const [dataBookings, setDataBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentsSelected, setDocumentsSelected] = useState([]);
  const [turnSelected, setTurnSelected] = useState("");

  const [isRatingPopupOpen, setRatingPopupOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  {/*  Estados para AlertModal */}
  const { isOpen: isOpenDocs, onOpen: onOpenDocs, onClose: onCloseDocs } = useDisclosure();
  const { isOpen: isOpenCancelTurn, onOpen: onOpenCancelTurn, onClose: onCloseCancelTurn } = useDisclosure();

  const handleOpenRatingPopup = (appointment, doctor) => {
    setSelectedAppointment(appointment);
    setSelectedDoctor(doctor);
    setRatingPopupOpen(true);
  };

  const handleCloseRatingPopup = () => { setRatingPopupOpen(false); };

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      let bookings = [];

      if (user.role === "DOCTOR" || user.role === "ADMIN") {
        bookings = await instance.get(`/calendars/all-events?doctor=${user.email}`);
      } else {
        bookings = await instance.get(`/calendars/all-events/${user._id}`);
      }
      const { data } = bookings?.data;

      const filteredBookings = data.filter((booking) => {
        const bookingStart = new Date(booking.originalStartTime);
        return bookingStart >= new Date() && booking.status !== "deleted";
      });

      setDataBookings(filteredBookings); // Actualizamos la lista completa de turnos
      setLoading(false);
      setDataBookings(filteredBookings);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
    }
  }, [instance, user]);

  // Calcular el próximo turno siempre que `dataBookings` cambie
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
        return await fetchBookings();
      }

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
    } catch (err) {
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

  const handleShowDocuments = (documents) => {
    setDocumentsSelected(documents);
    onOpenDocs();
  };

  const handleShowCancelTurn = (turn) => {
    setTurnSelected(turn);
    onOpenCancelTurn();
  };

  const verifyTurnsAvailable = (turns) => {
    return turns.some((book) => {
      let now = new Date();
      let bookingStart = new Date(book.originalStartTime);
      let isBookingPassed = bookingStart > now && book.status !== "deleted";

      return isBookingPassed;
    });
  };

  const titleText =
    user.role === "DOCTOR" || user.role === "ADMIN"
      ? `Hola Dr/Dra. ${user?.lastName}`
      : dataBookings?.length > 0 && verifyTurnsAvailable(dataBookings)
        ? "Tienes turnos proximos"
        : "Sin turnos próximos.";

  const welcomeText =
    (user.role === "DOCTOR" && user.validated === "incompleted")
      ? "<p>Por favor complete sus datos para realizar la validación de sus datos.</p>"
      : (user.role === "DOCTOR" && user.validated === "pending")
        ? "<p>Su validación está pendiente. Por favor, espere la confirmación.</p>"
        : (user.role === "DOCTOR" && user.validated === "disabled")
          ? "<p>Lo sentimos, pero usted no se encuentra habilitado. Por favor revise los datos ingresados.</p>"
          : (user.role === "DOCTOR" || user.role === "ADMIN") && dataBookings?.length === 0
            ? "<p>Por el momento no tiene turnos agendados.</p>"
            : user.role === "PACIENTE" && dataBookings?.length === 0
              ? "Encuentra al médico que necesitas y programa tu cita en solo unos pasos. <b>¡Tu atención pediátrica está a solo cuatro pasos de distancia!</b>"
              : "";

  const headingTable = [
    {
      name: "tutor",
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
      name: "paciente",
      detail: "",
    },
    {
      name: "acciones",
      detail: "",
    },
  ];

  return (
    <Flex
      w={["full", "calc(100% - 155px)"]}
      h="100%"
      justifyContent={["center", "top"]}
      alignItems="center"
      flexDirection="column"
      mx={[5, 0]}
    >
      <Box maxW={["full", "1240px", "full"]}>
        <Flex flexDirection="column">
          {(user.role === "DOCTOR" || user.role === "ADMIN") &&
            dataBookings?.length > 0 ? (
            <Text
              fontSize={["26px", "30px"]}
              lineHeight={["30.47px", "35.16px"]}
              color="#104DBA"
              order={2}
            >
              Estos son tus próximos turnos.
            </Text>
          ) : (
            <Flex
              order={user.role === "DOCTOR" || user.role === "ADMIN" ? 2 : 1}
              gap={4}
            >
              {!(user.role === "DOCTOR" && !(user.validated === "completed")) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  style={{ width: "52px", height: "56px" }}
                  fill="#104DBA"
                >
                  <path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zm-95 89l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                </svg>
              )}
              {((user.role === "DOCTOR") && (user.validated === "completed") || user.role === "ADMIN") &&
                dataBookings?.length === 0 && (
                  <Text
                    fontSize={["26px", "48px"]}
                    lineHeight={["30.47px", "56.25px"]}
                    fontWeight={900}
                    color="#104DBA"
                    alignContent="center"
                  >
                    Sin turnos próximos.
                  </Text>
                )}
            </Flex>
          )}
          <Text
            color="#104DBA"
            fontSize={["28px", "48px"]}
            fontWeight="900"
            textAlign="left"
            mt={4}
            mb={2}
            lineHeight={["30.47px", "56.25px"]}
            order={user.role === "DOCTOR" || user.role === "ADMIN" ? 1 : 2}
          >
            {titleText}
          </Text>
          <Box
            color="#474747"
            fontSize={["md", "xl"]}
            w={["auto", "462px"]}
            mt={4}
            mb={6}
            textAlign="left"
            lineHeight="23.44px"
            order={3}
            style={{ lineHeight: "110%" }}
            alignContent="center"
          >
            <div
              dangerouslySetInnerHTML={{ __html: welcomeText }}
              style={{ alignContent: "center" }}
            ></div>
          </Box>
          {/* Aquí añadimos el popup del próximo turno */}
          <div className="mobile-only">
            {user?.role === "PACIENTE" && dataBookings?.length > 0 && !loading && (
              <div style={{ padding: "20px" }}>
                {/* Recordatorio de turno */}
                {nextBooking && (
                  <div style={{ marginTop: "20px" }}>
                    <BookingReminder booking={nextBooking} />
                  </div>
                )}
                {loading && <p>Cargando tus turnos...</p>}
              </div>
            )}
          </div>
          {dataBookings?.length > 0 && loading ? (
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
              overflow="auto"
              order={5}
            >
              <Table size="md" variant="unstyled">
                <Thead bgColor="#104DBA" boxShadow="xl" height={50}>
                  <Tr>
                    {dataBookings?.length > 0 &&
                      headingTable?.map((h, idx) => (
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
                  {dataBookings?.length > 0 &&
                    dataBookings
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
                            <Td textAlign="center">Dr/Dra. {x.doctorName}</Td>
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
                            <Td textAlign="center">{x?.patientName}</Td>
                            <Td textAlign="center">
                              <Flex
                                w="full"
                                h="full"
                                justifyContent="center"
                                alignItems="center"
                                gap="2"
                              >
                                {x?.certificate?.length > 0 && (
                                  <Button
                                    padding={0}
                                    w="20px"
                                    bg="#104DBA"
                                    color="#FFF"
                                    size="xs"
                                    rounded="md"
                                    title="Documentos adjuntos"
                                    onClick={() =>
                                      handleShowDocuments(x.certificate)
                                    }
                                  >
                                    <IoDocumentTextOutline size="18px" />
                                  </Button>
                                )}
                                <Button
                                  padding={0}
                                  w="20px"
                                  bg="#FF0000"
                                  color="#FFF"
                                  size="xs"
                                  rounded="md"
                                  onClick={() => handleShowCancelTurn(x)}
                                  isDisabled={isBookingPassed}
                                  _disabled={{
                                    opacity: 1,
                                    bg: "#DCDCDC",
                                  }}
                                  title={
                                    x.status === "deleted"
                                      ? "ya se cancelo"
                                      : isBookingPassed
                                        ? "Ya no se puede cancelar"
                                        : ""
                                  }
                                  _hover={{
                                    bg: "#fff",
                                    border: "1px solid #FF0000",
                                    svg: {
                                      fill: "#FF0000",
                                    },
                                  }}
                                >
                                  <MdOutlineCancel size="18px" />
                                </Button>
                              </Flex>
                            </Td>
                          </Tr>
                        );
                      })
                      .slice(0, 5)}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          <AlertModal
            customWidth={300}
            onClose={onCloseDocs}
            isOpen={isOpenDocs}
            alertHeader="Documentos"
            alertBody={
              <Box>
                {documentsSelected?.map((doc, idx) => (
                  <Flex key={idx} justifyContent="space-between" px={2}>
                    <Text>Documento {idx + 1}</Text>
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
          ></AlertModal>
          
          {/* Modal cancelar turno */}
          <AlertModal
            customWidth={300}
            onClose={onCloseCancelTurn}
            isOpen={isOpenCancelTurn}
            alertHeader=""
            alertBody={
              <Box w="full" px={2}>
                <Text
                  lineHeight="18.55px"
                  fontSize="md"
                  color="#000"
                  mb={4}
                  fontWeight={400}
                >
                  ¿Desea confirmar la cancelación del siguiente turno?
                </Text>
                {turnSelected && (
                  <Box
                    boxShadow="0px 3px 3px 0px #00000040"
                    pb={2}
                    rounded="lg"
                  >
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
                        src={turnSelected?.doctorPicture}
                        w="48px"
                        h="48px"
                      />
                      <Flex
                        flex={1}
                        flexDirection="column"
                        justifyContent="space-between"
                        alignItems="start"
                      >
                        <Box>
                          <Text
                            fontSize="15px"
                            textTransform="capitalize"
                            fontWeight={700}
                            lineHeight="12.3px"
                            textAlign="left"
                          >
                            Dr/Dra. {turnSelected?.doctorName}
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight={400}
                            lineHeight="10.55px"
                          >
                            {" "}
                          </Text>
                        </Box>
                        <Box>
                          <Flex alignItems="center" gap={1}>
                            <IoMdCalendar style={{ color: "#AAAAAA" }} />
                            <Text
                              fontSize={["xs", "sm"]}
                              fontWeight={300}
                              lineHeight="10.55px"
                            >
                              {turnSelected?.beginning}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    </Flex>
                    <Divider />
                    <Text
                      fontSize="sm"
                      fontWeight={300}
                      lineHeight="10.55px"
                      textAlign="center"
                      mt={4}
                      mb={1}
                    >
                      Valor de la consulta: ${turnSelected?.doctorPrice}
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
                  onClick={() =>
                    handleDeleteEvent(
                      turnSelected?.id,
                      turnSelected?.doctorEmail
                    )
                  }
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
          ></AlertModal>
        </Flex>
      </Box>

      <RatingPopup
        isOpen={isRatingPopupOpen}
        onClose={handleCloseRatingPopup}
        appointment={selectedAppointment}
        organizer={selectedDoctor}
        fetchBookings={fetchBookings}
      />

    </Flex>
  );
};

export default Home;
