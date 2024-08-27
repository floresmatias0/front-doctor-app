import { useNavigate } from "react-router-dom";
import {
  Button,
  Flex,
  Text,
  Box,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Center,
  Image,
  useDisclosure,
  Divider,
  Link,
} from "@chakra-ui/react";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../components/context";
import { instance } from "../utils/axios";
import { AlertModal } from "../components/alerts";
import { format } from "date-fns";
import { IoMdCalendar } from "react-icons/io";

import { es } from "date-fns/locale";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { MdErrorOutline } from "react-icons/md";

const getFormattedDateTime = (dateTimeStr, options) => {
  const dateTime = new Date(dateTimeStr);
  return dateTime.toLocaleString("es", options);
};

const getStartAndEndOfWeek = () => {
  const now = new Date();
  const dayOfWeek = now.getDay(); // Sunday - Saturday : 0 - 6
  const start = new Date(now);
  const end = new Date(now);

  // Set to the start of the week (Monday)
  start.setDate(now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
  start.setHours(0, 0, 0, 0);

  // Set to the end of the week (Sunday)
  end.setDate(now.getDate() - dayOfWeek + 7);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

const Home = () => {
  const navigate = useNavigate();
  const { user } = useContext(AppContext);

  const [dataBookings, setDataBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documentsSelected, setDocumentsSelected] = useState([]);
  const [turnSelected, setTurnSelected] = useState("");

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
      setLoading(true);
      if ((user.role === "DOCTOR" || user.role === "ADMIN")) {
        bookings = await instance.get(
          `/calendars/all-events?doctor=${user.email}`
        );
      } else {
        bookings = await instance.get(`/calendars/all-events/${user._id}`);
      }
      const { data } = bookings?.data;
      const { start, end } = getStartAndEndOfWeek();
      const filteredBookings = data.filter((booking) => {
        const bookingStart = new Date(booking.start.dateTime);
        return bookingStart >= start && bookingStart <= end;
      });
      setLoading(false);
      setDataBookings(filteredBookings);
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
      let bookingStart = new Date(book.start.dateTime);
      let isBookingPassed = bookingStart > now && book.status !== "deleted";

      return isBookingPassed;
    });
  };

  const titleText =
    (user.role === "DOCTOR" || user.role === "ADMIN")
      ? `Hola Dr. ${user?.lastName}`
      : dataBookings?.length > 0 && verifyTurnsAvailable(dataBookings)
      ? "Tienes turnos proximos"
      : "Sin turnos próximos.";
  const welcomeText =
      (user.role === "DOCTOR" || user.role === "ADMIN") && dataBookings?.length === 0 ? "<p>Por el momento no tiene turnos agendados.</p>"
      : user.role === "PACIENTE" ? "Encuentra al médico que necesitas y programa tu cita en solo unos pasos. <b>¡Tu atención pediátrica está a solo cuatro pasos de distancia!</b>" : "";

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
          {(user.role === "DOCTOR" || user.role === "ADMIN") && dataBookings?.length > 0 ? (
            <Text fontSize={["26px", "30px"]} lineHeight={["30.47px", "35.16px"]} color="#104DBA" order={2}>
              Estos son tus próximos turnos.
            </Text>
          ) : (
            <Flex order={(user.role === "DOCTOR" || user.role === "ADMIN") ? 2 : 1} gap={4}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                style={{ width: "52px", height: "56px" }}
                fill="#104DBA"
              >
                <path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zm-95 89l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
              </svg>
              {(user.role === "DOCTOR" || user.role === "ADMIN") && dataBookings?.length === 0 && (
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
            order={(user.role === "DOCTOR" || user.role === "ADMIN") ? 1 : 2}
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
            <div dangerouslySetInnerHTML={{ __html: welcomeText }} style={{ alignContent: 'center' }}></div>
          </Box>
            {(user.role === "DOCTOR" || user.role === "ADMIN") &&
              dataBookings?.length > 0 &&
              (loading ? (
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
                      {dataBookings?.length > 0 &&
                        dataBookings
                          ?.map((x, idx) => {
                            let now = new Date();
                            let bookingStart = new Date(x.start.dateTime);
                            let hoursDifference = (bookingStart - now) / (1000 * 60 * 60);
                            let canCancel = hoursDifference < 24 && hoursDifference > 0;

                            let isBookingPassed = now > bookingStart || x.status === "deleted" || !canCancel;

                            let extraDate = `${getFormattedDateTime(
                              x.start.dateTime,
                              {
                                day: "numeric",
                                month: "numeric",
                                year: "numeric",
                                timeZone: "America/Argentina/Buenos_Aires"
                              }
                            )}`;

                            let hour = `${getFormattedDateTime(x.start.dateTime, {
                              hour: "numeric",
                              minute: "numeric",
                              timeZone: "America/Argentina/Buenos_Aires"
                            })}`;
                            // let endHour = `${getFormattedDateTime(x.end.dateTime, { hour: "numeric", minute: "numeric" })}`;

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
                                  {x.status === "deleted"
                                    ? "Cancelado"
                                    : now > bookingStart
                                    ? "Expiró"
                                    : "Confirmado"}
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
                                      onClick={() => handleShowCancelTurn(x)}
                                      isDisabled={isBookingPassed}
                                      _disabled={{
                                        opacity: 1,
                                        bg: "#DCDCDC",
                                      }}
                                      title={x.status === "deleted" ? "ya se cancelo" : isBookingPassed ? "Ya no se puede cancelar" : ""}
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
                                          "9px",
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
              ))}
          {(user.role !== "DOCTOR" && user.role !== "ADMIN") && (
            <Flex
              justifyContent="flex-start"
              alignItems="start"
              gap={4}
              flexDirection="row"
              flexWrap="wrap"
              my={2}
              order={4}
            >
              <Button
                bg="#104DBA"
                color="#FFFFFF"
                w="222px"
                size="sm"
                onClick={() => navigate("/turnos")}
                fontSize="16px"
                fontWeight={500}
              >
                SOLICITAR NUEVO TURNO
              </Button>
              {/* {dataBookings?.length > 0 && verifyTurnsAvailable(dataBookings) && (
                <Button
                  bg="#104DBA"
                  color="#FFFFFF"
                  w="222px"
                  size="sm"
                  onClick={() => navigate("/historial-clinico")}
                  fontSize="16px"
                  fontWeight={500}
                >
                  MIS TURNOS
                </Button>
              )} */}
            </Flex>
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
                            Dr. {turnSelected?.organizer?.name}
                          </Text>
                          <Text
                            fontSize="sm"
                            fontWeight={400}
                            lineHeight="10.55px"
                          >
                            {turnSelected?.organizer?.especialization}
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
                              {format(
                                new Date(turnSelected?.start?.dateTime),
                                "d  MMMM yyyy, HH:mm 'Hs.'",
                                { locale: es }
                              )}
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
                  onClick={() =>
                    handleDeleteEvent(
                      turnSelected?._id,
                      turnSelected?.organizer?.email
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
    </Flex>
  );
};

export default Home;
