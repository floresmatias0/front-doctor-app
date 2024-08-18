import PropTypes from "prop-types";
import {
  Button,
  Flex,
  Text,
  Box,
  Image,
  Divider,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { Fragment, useEffect, useState, useCallback } from "react";
import { instance } from "../utils/axios";
import { FaMoneyBill } from "react-icons/fa";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import CustomCalendar from "./custom-calendar";

const ListDoctors = ({ onNext, onBack, isActive, patientSelected, doctorSelected, setDoctorSelected, daySelected, setDaySelected }) => {
  const initialStateTabs = {
    filter: false,
    doctors: true,
    calendar: true,
  };

  const [disableTabs, setDisableTabs] = useState(initialStateTabs);
  const [doctors, setDoctors] = useState([]);

  const currentDate = new Date();
  const [currentDateState, setCurrentDateState] = useState(currentDate);
  const [dataDoctor, setDataDoctor] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [hsSelected, setHsSelected] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(doctors.length / itemsPerPage);

  const currentDoctors = doctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const fetchDoctors = async () => {
    try {
      let filters = '{ "role": "DOCTOR" }';
      const { data } = await instance.get(`/users?filters=${filters}`);
      const response = data;

      if (response.success) {
        let doctors = response.data;
        let auxDoctors = [];

        if (doctors && doctors?.length > 0) {
          for (let i = 0; i < doctors.length; i++) {
            auxDoctors.push({
              label: doctors[i].name,
              value: doctors[i].email,
              picture: doctors[i].picture,
              reservePrice: doctors[i].reservePrice,
              reserveTime: doctors[i].reserveTime,
              especialization: doctors[i].especialization,
              public_key: doctors[i].mercadopago_access?.public_key
            });
          }
          setDoctors(auxDoctors);
        }

        setDoctors(auxDoctors);
      }

      return [];
    } catch (err) {
      console.log("fetch doctors", err.message);
      throw new Error("Something went wrong to search doctors");
    }
  };

  const handleDoctorsSelect = (doctor) => {
    setDoctorSelected(doctor);
  };

  const handleBackFilter = () => {
    setDisableTabs({
      ...disableTabs,
      filter: false,
      doctors: true,
      calendar: true,
    });
  };

  const handleBackDoctors = () => {
    setDisableTabs({
      ...disableTabs,
      filter: true,
      doctors: false,
      calendar: true,
    });
  };

  const handleNextCalendar = () => {
    setDisableTabs({
      ...disableTabs,
      filter: true,
      doctors: true,
      calendar: false,
    });
  };

  const handleNextProfesional = () => {
    setDisableTabs({
      ...disableTabs,
      filter: true,
      doctors: false,
    });
  };

  const fetchDataCalendar = useCallback(async () => {
    try {
      if(doctorSelected?.value) {
        setLoadingCalendar(true);
        setHsSelected(false);
  
        const { data } = await instance.get(
          `/calendars?email=${doctorSelected?.value}`
        );
  
        setCalendarEvents(data?.data?.items);
        let filters = `{ "email": "${doctorSelected?.value}" }`;
        const doctor = await instance.get(`/users?filters=${filters}`);
  
        setDataDoctor(doctor?.data?.data[0]);
        setLoadingCalendar(false);
      }
    } catch (err) {
      setLoadingCalendar(false);
      throw new Error("Something went wrong to search calendar doctor");
    }
  }, [doctorSelected]);

  useEffect(() => {
    const fetchDataCalendars = async () => {
      try {
        await fetchDataCalendar();
      } catch (err) {
        console.log(err);
      }
    };

    if (doctorSelected && isActive) {
      fetchDataCalendars();
    }
  }, [doctorSelected, isActive, fetchDataCalendar]);

  useEffect(() => {
    const fetchDataDoctors = async () => {
      try {
        await fetchDoctors();
      } catch (err) {
        throw new Error(err.message);
      }
    };

    if (isActive) fetchDataDoctors();
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  return (
    <Flex h="100%" maxH="100%" overflowY="auto" flexDirection="column" py={[0, 4]} px={[0, 10]} gap={[2, 5]} mt={[5, 0]}>
      <Flex justifyContent="space-between">
        <Text
          color="#FFF"
          bg="#104DBA"
          borderRadius="xl"
          w="auto"
          fontSize="xs"
          lineHeight="14.06px"
          textAlign="center"
          py={1}
          px={4}
          textTransform="capitalize"
        >
          Paciente: {patientSelected && patientSelected?.label}
        </Text>
      </Flex>
      {!disableTabs.filter && (
        <Flex flexDirection="column" flex={1} gap={4}>
          <Text fontWeight={400} fontSize="md" lineHeight="18.75px">
            ¿Como deseas realizar la busqueda de tu turno?
          </Text>

          <Flex
            justifyContent="space-between"
            flexDirection={["column", "row"]}
            gap={2}
            flex={1}
          >
            <Button
              fontSize="sm"
              color="#104DBA"
              lineHeight="16.45px"
              borderColor="#104DBA"
              border="2px"
              borderRadius="xl"
              size="sm"
              background="#FFFFFF"
              fontWeight={500}
              isDisabled
            >
              ESPECIALIDAD MEDICA
            </Button>
            <Button
              fontSize="sm"
              color="#104DBA"
              lineHeight="16.45px"
              borderColor="#104DBA"
              border="2px"
              borderRadius="xl"
              size="sm"
              background="#FFFFFF"
              fontWeight={500}
              onClick={handleNextProfesional}
            >
              PROFESIONAL
            </Button>
            <Button
              fontSize="sm"
              color="#104DBA"
              lineHeight="16.45px"
              borderColor="#104DBA"
              border="2px"
              borderRadius="xl"
              size="sm"
              background="#FFFFFF"
              fontWeight={500}
              isDisabled
            >
              TURNO MAS PROXIMO
            </Button>
          </Flex>
          <Flex justifyContent="flex-start" alignItems="flex-start" my={1}>
            <Button
              bg="#104DBA"
              color="#FFFFFF"
              w="120px"
              size="xs"
              leftIcon={
                <MdOutlineNavigateBefore
                  style={{ width: "20px", height: "20px" }}
                />
              }
              onClick={onBack}
            >
              <Text
                fontSize="xs"
                lineHeight="16px"
                fontWeight={500}
                textTransform="uppercase"
              >
                Anterior
              </Text>
            </Button>
          </Flex>
        </Flex>
      )}
      {!disableTabs.doctors && (
        <Fragment>
          <Text
            fontWeight={400}
            fontSize="md"
            lineHeight="18.75px"
            width="235px"
          >
            Por favor elija al profesional con el que desea atenderse.
          </Text>
          <Flex
            flex={1}
            w="full"
            flexWrap="wrap"
            justifyContent="space-between"
            flexDirection="row"
            gap={4}
            minH={["85px", "85px", "85px", "85px", "85px", "182px"]}
            maxH={["90px", "85px", "85px", "85px", "90px", "auto"]}
            overflowY={["scroll", "auto"]}
          >
            {currentDoctors.length > 0 ? (
                currentDoctors.map((doctor, idx) => (
                  <Flex
                    key={idx}
                    w={["full", "265px"]}
                    h="83px"
                    justifyContent="space-around"
                    boxShadow="0px 4px 4px 0px #00000040"
                    borderRadius="xl"
                    p={2}
                    cursor="pointer"
                    onClick={() => handleDoctorsSelect(doctor)}
                    border="2px"
                    borderColor={
                      doctorSelected?.label === doctor?.label
                        ? "#104DBA"
                        : "transparent"
                    }
                  >
                    <Image
                      rounded="full"
                      src={doctor?.picture}
                      w="40px"
                      h="40px"
                    />
                    <Flex flexDirection="column" justifyContent="space-between">
                      <Box>
                        <Text
                          fontSize="sm"
                          textTransform="capitalize"
                          fontWeight={700}
                          lineHeight="16.41px"
                        >
                          {doctor?.label}
                        </Text>
                        <Text fontSize="xs" fontWeight={400} lineHeight="14.06px">
                          {doctor?.especialization}
                        </Text>
                      </Box>

                      <Flex gap={2}>
                        <Box
                          display={[
                            "none",
                            "block",
                            "block",
                            "block",
                            "block",
                            "block",
                          ]}
                        >
                          <FaMoneyBill
                            style={{
                              width: "16px",
                              height: "16px",
                              color: "gray",
                            }}
                          />
                        </Box>
                        <Text fontSize="xs" fontWeight={300} lineHeight="14.06px">
                          Valor de la consulta: ${doctor?.reservePrice}
                        </Text>
                      </Flex>
                    </Flex>
                  </Flex>
                ))
              ) : (
                <Text fontWeight={300}>Lo sentimos, no hay doctores disponibles</Text>
              )
            }
          </Flex>
          <Flex justifyContent="flex-end" mt={[0, 4]} gap={2}>
            {doctors?.length > 0 && (
              <Button
                bg="transparent"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                size="xs"
              >
                <MdOutlineNavigateBefore
                  style={{ width: "16px", height: "16px" }}
                />
              </Button>
            )}
            <Text alignSelf="center" fontSize="xs">
              {doctors?.length > 0 ? (
                  `
                  ${Math.min((currentPage - 1) * itemsPerPage + 1, doctors.length)} - 
                  ${Math.min(currentPage * itemsPerPage, doctors.length)} de
                  ${doctors.length} resultados
                  `
              ) : (
                `${doctors.length} resultados`
              )}
              
            </Text>
            {doctors?.length > 0 && (
              <Button
                bg="transparent"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                size="xs"
              >
                <MdOutlineNavigateNext
                  style={{ width: "16px", height: "16px" }}
                />
              </Button>
            )}
          </Flex>
          <Flex justifyContent="flex-end" gap={[2, 4]}>
            <Button
              bg="#104DBA"
              color="#FFFFFF"
              w="120px"
              size="xs"
              leftIcon={
                <MdOutlineNavigateBefore
                  style={{ width: "20px", height: "20px" }}
                />
              }
              onClick={handleBackFilter}
            >
              <Text
                fontSize="xs"
                lineHeight="16px"
                fontWeight={500}
                textTransform="uppercase"
              >
                Anterior
              </Text>
            </Button>
            {Object?.keys(doctorSelected).length > 0 && (
              <Button
                bg="#104DBA"
                color="#FFFFFF"
                w="120px"
                size="xs"
                rightIcon={
                  <MdOutlineNavigateNext
                    style={{ width: "20px", height: "20px" }}
                  />
                }
                onClick={handleNextCalendar}
              >
                <Text
                  fontSize="xs"
                  lineHeight="16px"
                  fontWeight={500}
                  textTransform="uppercase"
                >
                  Continuar
                </Text>
              </Button>
            )}
          </Flex>
        </Fragment>
      )}
      {!disableTabs.calendar && (
        <Fragment>
          <Text fontWeight={400} fontSize="md" lineHeight="18.75px">
            Por favor seleccione la fecha para su turno
          </Text>

          <Flex flex={1}>
            <Flex
              boxShadow="0px 4px 4px 0px #00000040"
              w="full"
              minH={["auto", "auto", "auto", "auto", "auto", "321px"]}
              borderRadius="xl"
              justifyContent="center"
            >
              <Box w="full">
                <Flex
                  w={["full", "340px"]}
                  h="65px"
                  justifyContent="space-around"
                  p={2}
                  mx="auto"
                  gap={2}
                >
                  <Image
                    rounded="full"
                    src={doctorSelected?.picture}
                    w={50}
                    h={50}
                  />
                  <Flex flexDirection="column" justifyContent="space-between">
                    <Box>
                      <Text
                        fontSize="md"
                        textTransform="capitalize"
                        fontWeight={700}
                        lineHeight="19.69px"
                      >
                        {doctorSelected?.label}
                      </Text>
                      <Text fontSize={["sm", "md"]} fontWeight={400} lineHeight="16.88px">
                        {doctorSelected?.especialization}
                      </Text>
                    </Box>
                  </Flex>
                </Flex>
                <Divider />
                {loadingCalendar ? (
                  <Center h="100px">
                    <Spinner />
                  </Center>
                ) : (
                  <Flex
                    flex={1}
                    flexDirection="column"
                    justifyContent="space-between"
                    px={2}
                  >
                    <Box>
                      <CustomCalendar
                        currentDateState={currentDateState}
                        daySelected={daySelected}
                        setDaySelected={setDaySelected}
                        calendarEvents={calendarEvents}
                        selectedDoc={doctorSelected}
                      />
                    </Box>
                  </Flex>
                )}
              </Box>
            </Flex>
          </Flex>
          <Flex justifyContent="flex-end" gap={4}>
            <Button
              bg="#104DBA"
              color="#FFFFFF"
              w="120px"
              size="xs"
              leftIcon={
                <MdOutlineNavigateBefore
                  style={{ width: "20px", height: "20px" }}
                />
              }
              onClick={handleBackDoctors}
            >
              <Text
                fontSize="xs"
                lineHeight="16px"
                fontWeight={500}
                textTransform="uppercase"
              >
                Anterior
              </Text>
            </Button>
            {daySelected && (
              <Button
                bg="#104DBA"
                color="#FFFFFF"
                w="120px"
                size="xs"
                rightIcon={
                  <MdOutlineNavigateNext
                    style={{ width: "20px", height: "20px" }}
                  />
                }
                onClick={onNext}
                isDisabled={!daySelected}
              >
                <Text
                  fontSize="xs"
                  lineHeight="16px"
                  fontWeight={500}
                  textTransform="uppercase"
                >
                  Continuar
                </Text>
              </Button>
            )}
          </Flex>
        </Fragment>
      )}
    </Flex>
  );
};

ListDoctors.propTypes = {
  onNext: PropTypes.func,
  onBack: PropTypes.func,
  isActive: PropTypes.bool,
  patientSelected: PropTypes.object,
};

export default ListDoctors;