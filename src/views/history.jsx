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
import { instance } from "../utils/axios";
import { AlertModal } from "../components/alerts";
import { useNavigate } from "react-router-dom";
import { IoMdCalendar } from "react-icons/io";
import { IoDocumentTextOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { MdErrorOutline } from "react-icons/md";

export const FormHistory = ({
  values,
  role,
  handleUpdateBooking,
  handleFileInputChange,
  handleDeleteEvent,
  uploadLoading,
  handleDeleteCertificate,
}) => {
  const [details, setDetails] = useState(values?.details || "");

  let now = new Date();
  let bookingStart = new Date(values?.originalStartTime);
  let isBookingPassed = now > bookingStart || values?.status === "deleted";

  const handleDetails = (e) => {
    setDetails(e.target.value);
  };

  return (
    <Box px={2}>
      {values?.status === "deleted" ? (
        <Text color="gray" textAlign="right">
          Consulta no disponible
        </Text>
      ) : now > bookingStart ? (
        <Text color="gray" textAlign="right">
          Consulta no disponible
        </Text>
      ) : (
        <Link href={values?.link}>
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
        Doctor: {values?.doctorName}
      </Text>
      <Text color="#104DBA" textAlign="left">
        Paciente: {values?.patientName}
      </Text>
      <Text color="#104DBA" textAlign="left">
        Obra social: {values?.patientSocialWork}
      </Text>
      <Text color="#104DBA" textAlign="left">
        N° afiliado: {values?.patientSocialWorkId}
      </Text>
      <Text fontSize={["sm", "md"]} color="#104DBA" textAlign="left">
        Fecha: {values?.beginning}
      </Text>
      <Text fontSize={["sm", "md"]} color="#104DBA" textAlign="left">
        Hora: {values?.startTime}hs
      </Text>
      <Text color="#104DBA">
        Estado:{" "}
        {values?.status === "deleted"
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
          disabled={role !== "DOCTOR" || role !== "ADMIN"}
          value={details}
          onChange={handleDetails}
        />

        {(role === "DOCTOR" || role === "ADMIN") && (
          <Button
            onClick={() => handleUpdateBooking(values?.id, details)}
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
              <Flex gap={2} my={1} key={idx}>
                <Text>Documento {idx + 1}</Text>
                <Link
                  href={c?.url}
                  target="_blank"
                  bg="#EDF2F7"
                  px={2}
                  rounded="md"
                  fontSize="xs"
                  alignContent="center"
                  fontWeight={700}
                  _hover={{ bg: "#EDF2F7" }}
                  rel="noopener noreferrer"
                  download={c?.name?.trim()}
                >
                  Ver
                </Link>
                <Button
                  size="xs"
                  onClick={() => handleDeleteCertificate(values?.id, c?._id)}
                  bg="#EDF2F7"
                  px={2}
                  rounded="md"
                  fontSize="xs"
                  alignContent="center"
                  fontWeight={700}
                  _hover={{ bg: "#EDF2F7" }}
                >
                  Borrar
                </Button>
              </Flex>
            ))}
        </Box>
        {(role === "DOCTOR" || role === "ADMIN") && (
          <Button position="relative" size="sm">
            <Input
              id="file-input"
              type="file"
              placeholder="Cargar certificado"
              size="sm"
              onChange={(e) =>
                handleFileInputChange(
                  e,
                  values?.doctorId,
                  values?.patientId,
                  values?.id
                )
              }
              multiple
              style={{ opacity: 0 }}
              position="absolute"
              top="0"
              left="0"
              w="full"
            />
            {uploadLoading ? <Spinner /> : "Cargar certificado "}
          </Button>
        )}
        <Divider my={4} />
        <Button
          onClick={() => handleDeleteEvent(values?.id, values?.doctorEmail)}
          isDisabled={isBookingPassed}
          colorScheme="red"
          alignContent="center"
          size="sm"
          w="full"
        >
          {values?.status === "deleted"
            ? "Cancelado"
            : now > bookingStart
            ? "Cancelar"
            : "Cancelar"}
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
  const [cancelLoading, setCancelLoading] = useState(false);
  const [documentsSelected, setDocumentsSelected] = useState([]);
  const [turnSelected, setTurnSelected] = useState("");

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
      setLoading(true);
      let bookings = [];

      if (user.role === "DOCTOR" || user.role === "ADMIN") {
        bookings = await instance.get(
          `/calendars/all-events?doctor=${user.email}`
        );

        return setDataBookings(bookings.data.data);
      }

      bookings = await instance.get(`/calendars/all-events/${user._id}`);

      setDataBookings(bookings.data.data);
      setLoading(false);
    } catch (err) {
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
      setCancelLoading(true);
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
    } finally {
      setCancelLoading(false);
      onCloseCancelTurn();
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

  const headingTable = [
    {
      name: "doctor",
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
            width={["160px", "auto"]}
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
              <Table size="md" variant="unstyled">
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
                  {dataBookings?.length > 0 &&
                    dataBookings?.map((x, idx) => {
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
                          px={[0, 8]}
                          textAlign="center"
                        >
                          <Td textAlign="center">Dr/Dra. {x.doctorName}</Td>
                          <Td textAlign="center">{x.beginning}</Td>
                          <Td textAlign="center">{x.startTime}</Td>
                          <Td textAlign="center">Consulta</Td>
                          <Td textAlign="center">
                            {x?.status === "deleted" ? (
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
                            {x?.status === "deleted"
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
                                  bg: isBookingPassed ? "" : "inherit",
                                }}
                              >
                                <MdOutlineCancel size="18px" />
                              </Button>
                            </Flex>
                          </Td>
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
            </TableContainer>
          )}
          <Flex justifyContent="flex-end" alignItems="center" my={8}>
            <Button
              bg="#104DBA"
              color="#FFFFFF"
              w={["auto", "222px"]}
              size={["xs", "sm"]}
              onClick={() => navigate("/turnos")}
              fontSize="16px"
              fontWeight={500}
            >
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
                handleDeleteEvent(turnSelected?.id, turnSelected?.doctorEmail)
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
                {cancelLoading ? (
                  <Spinner color="#205583" size="sm" />
                ) : (
                  "Cancelar turno"
                )}
              </Text>
            </Button>
          </Box>
        }
        isLoading={false}
      ></AlertModal>
    </Flex>
  );
};

export default History;
