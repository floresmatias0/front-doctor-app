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
    Link
  } from "@chakra-ui/react";
  import { Fragment, useCallback, useContext, useEffect, useState } from "react";
  import { AppContext } from "../components/context";
  import { instance, instanceUpload } from "../utils/axios";
  import { AiOutlineEye } from "react-icons/ai";
  import { FormHistory } from "./history";
  import { AlertModal } from "../components/alerts";
  
  const Patients = () => {
    const [dataBookings, setDataBookings] = useState([]);
    const [dataBookingsNext, setDataBookingsNext] = useState([]);
    const [bookingSelected, setBookingSelected] = useState({});
    const [documentsSelected, setDocumentsSelected] = useState([])
    const [loading, setLoading] = useState(false);
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
  
      const fetchPatients = useCallback(async () => {
          try {
          setLoading(true);
          const patients = await instance.get(`/calendars/doctor-patients/${user.email}`);
          const { data } = patients?.data;
  
          setLoading(false);
          setDataBookings(data);
          } catch (err) {
          console.log(err.message);
          setLoading(false);
          throw new Error(err.message);
          }
      }, [user]);
  
      useEffect(() => {
          const fetchDataPatients = async () => {
          if (user) {
              try {
              await fetchPatients();
              } catch (err) {
              console.log(err);
              }
          }
          };
  
          fetchDataPatients();
      }, [fetchPatients, user]);
  
      const getFormattedDateTime = (dateTimeStr, options) => {
          const dateTime = new Date(dateTimeStr);
          return dateTime.toLocaleString("es", options);
      };
  
      const handleDeleteEvent = async (bookingId, userEmail) => {
          try {
          const response = await instance.delete(
              `/calendars/${bookingId}?email=${userEmail}`
          );
          if (response.data.success) {
              toast({
              title: "Cancelado con exito",
              description: "Vuelva a intentar porfavor",
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
  
      const headingTable = [
          {
          name: "tutor",
          detail: "",
          },
          {
          name: "paciente",
          detail: "",
          },
          {
          name: "n documento",
          detail: "",
          },
          {
          name: "fecha nacimiento",
          detail: "",
          },
          {
          name: "telefono de contacto",
          detail: "",
          },
          {
          name: "obra social",
          detail: "",
          },
          {
          name: "",
          detail: "",
          }
      ];
  
      const handleSelectHistory = (booking) => {
          setBookingSelected(booking);
          onOpenHistory();
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
  
      const handleShowDocuments = (documents) => {
          setDocumentsSelected(documents)
          onOpenDocs()
      }

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
            bg="#FCFEFF"
            borderRadius="xl"
            boxShadow="md"
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
          <Fragment>
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
                      w="130px"
                      mb={4}
                  >
                      Mis pacientes
                  </Heading>
                  {dataBookings?.length > 0 ? (
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
                                  
                                  // let endHour = `${getFormattedDateTime(x.end.dateTime, { hour: "numeric", minute: "numeric" })}`;
                                    const dateOfBirth = new Date(x.dateOfBirth).toLocaleDateString()
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
                                      <Td textAlign="center"></Td>
                                      <Td textAlign="center">{x.firstName} {x.lastName}</Td>
                                      <Td textAlign="center">{x.identityId}</Td>
                                      <Td textAlign="center">{dateOfBirth}</Td>
                                      <Td textAlign="center">{x.phone}</Td>
                                      <Td textAlign="center">{x.socialWork}</Td>
                                      <Td textAlign="center">
                                        <AiOutlineEye style={{ width: "24px", height: "24px" }}/>
                                      </Td>
                                      </Tr>
                                  );
                                  })
                                  .slice(0, 5)}
                          </Tbody>
                          </Table>
                      </TableContainer>
                  ) : (
                      <Text>Aun no tienes pacientes</Text>
                  )}
              </Box>
          </Fragment>
        )}
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
                      <Link href={doc?.url} target="_blank" color="#104DBA" fontWeight={700}>Ver</Link>
                  </Flex>
                  ))}
              </Box>
              }
              isLoading={false}
          />
      </Flex>
    );
  };
  
  export default Patients;
  