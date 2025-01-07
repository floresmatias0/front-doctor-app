import PropTypes from "prop-types";
import { Button, Flex, Text, Box, Image, Divider, Center, Spinner, Select, FormControl, FormLabel, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { Fragment, useEffect, useState, useCallback } from "react";
import { instance } from "../utils/axios";
import { FaMoneyBill, FaSearch } from "react-icons/fa";
import { MdOutlineNavigateNext, MdOutlineNavigateBefore } from "react-icons/md";
import CustomCalendar from "./custom-calendar";
import { renderStars } from '../components/rating-stars';


const ListDoctors = ({ onNext, onBack, isActive, patientSelected, doctorSelected, setDoctorSelected, daySelected, setDaySelected }) => {
  const initialStateTabs = {
    filter: false,
    doctors: true,
    calendar: true,
    specialty: true,
    closest: true
  };

  const [disableTabs, setDisableTabs] = useState(initialStateTabs);
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const currentDate = new Date();
  const [currentDateState, setCurrentDateState] = useState(currentDate);
  const [dataDoctor, setDataDoctor] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [hsSelected, setHsSelected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(doctors.length / itemsPerPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [closestAppointments, setClosestAppointments] = useState([]);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);


  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const fetchDoctors = async () => {
    try {
      let filters = `{ "role":["DOCTOR", "ADMIN"]`;
      if (selectedSpecialization) {
        filters += `, "especialization": "${selectedSpecialization}"`;
      }
      filters += `}`;
      const { data } = await instance.get(`/users?filters=${filters}`);
      const response = data;
      setDoctorSelected(null);
      if (response.success) {
        let doctors = response.data;
        let auxDoctors = [];
        if (doctors && doctors?.length > 0) {
          for (let i = 0; i < doctors.length; i++) {
            if ((doctors[i].validated === 'completed') && (!selectedSpecialization || doctors[i].especialization === selectedSpecialization)) {
              const averageRating = await fetchAverageRating(doctors[i]._id);
              auxDoctors.push({
                label: `${doctors[i].firstName} ${doctors[i].lastName}`,
                value: doctors[i].email,
                picture: doctors[i].picture,
                reservePrice: doctors[i].reservePrice,
                reserveTime: doctors[i].reserveTime,
                reserveTimeFrom: doctors[i].reserveTimeFrom,
                reserveTimeUntil: doctors[i].reserveTimeUntil,
                reserveTimeFrom2: doctors[i].reserveTimeFrom2,
                reserveTimeUntil2: doctors[i].reserveTimeUntil2,
                reserveSaturday: doctors[i].reserveSaturday,
                reserveSunday: doctors[i].reserveSunday,
                especialization: doctors[i].especialization,
                public_key: doctors[i].mercadopago_access?.public_key,
                averageRating,
                id: doctors[i]._id,
              });
            }
          }
          setDoctors(auxDoctors);
        } else {
          setDoctors([]);
        }
      }
      return [];
    } catch (err) {
      console.log("fetch doctors", err.message);
      throw new Error("Something went wrong to search doctors");
    }
  };

  const normalizeText = (text) => {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  };


  const fetchAverageRating = async (doctorId) => {
    try {
      const response = await instance.get(`/rating/${doctorId}`);
      if (response.data.success) {
        return response.data.averageRating;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching average rating:', error);
      return 0;
    }
  };

  const fetchSpecializations = async () => {
    try {
      setLoadingSpecializations(true);
      const { data } = await instance.get("/specializations");
      const response = data;
      if (response.success) {
        let specializations = response.data;

        {/* Obtener los médicos*/}
        const { data: doctorsData } = await instance.get("/users?filters={\"role\":[\"DOCTOR\"]}");
        const doctors = doctorsData.data;

        {/*Filtrar especializaciones que tienen al menos un médico validado*/}
        const filteredSpecializations = specializations.filter(spec =>
          doctors.some(doc => doc.especialization === spec.name && doc.validated === 'completed')
        );

        filteredSpecializations.sort((a, b) => a.name.localeCompare(b.name));

        setSpecializations(filteredSpecializations);
      } else {
        setSpecializations([]);
      }
      setLoadingSpecializations(false);
    } catch (err) {
      console.error("fetch specializations", err.message);
      setLoadingSpecializations(false);
      throw new Error("Something went wrong to fetch specializations");
    }
  };

  useEffect(() => {
    const fetchDataSpecializations = async () => {
      try {
        await fetchSpecializations();
      } catch (err) {
        console.error(err);
      }
    };
    fetchDataSpecializations();
  }, []);

  {/* Función para obtener los turnos más próximos */} 
  const fetchClosestAppointments = async (specialization) => {
    setLoadingCalendar(true);
    try {
      const response = await instance.get(`/calendars/closest-appointments?specialization=${specialization}`);

      const sortedAppointments = response.data.data.sort((a, b) => new Date(a.nextAvailable.start) - new Date(b.nextAvailable.start));

      {/*Promedio de calificaciones para cada doctor */}
      const appointmentsWithRatings = await Promise.all(sortedAppointments.map(async appointment => {
        const averageRating = await fetchAverageRating(appointment.doctor._id);
        return {
          ...appointment,
          doctor: {
            ...appointment.doctor,
            averageRating
          }
        };
      }));

      setClosestAppointments(appointmentsWithRatings);
    } catch (err) {
      console.error("fetch closest appointments", err.message);
      throw new Error("Something went wrong to fetch closest appointments");
    } finally {
      setLoadingCalendar(false);
    }
  };

  const handleDoctorsSelect = (doctor) => {
    setDoctorSelected(doctor);
  };

  const handleSpecializationSelect = async (event) => {
    setSelectedSpecialization(event.target.value);
    await fetchClosestAppointments(event.target.value);
  };
  
  const handleDoctorSelection = (doctor, appointment) => {
    const adjustedDate = new Date(appointment.nextAvailable.start);
    adjustedDate.setHours(adjustedDate.getHours() + 3);
    setDoctorSelected({
      ...doctor,
      label: `${doctor.firstName} ${doctor.lastName}`
    });
    setDaySelected(adjustedDate);
  };

  const handleBackFilter = () => {
    setSelectedSpecialization("");
    setDoctorSelected(null);
    setSearchTerm("");
    setDisableTabs({
      ...disableTabs,
      filter: false,
      doctors: true,
      calendar: true,
      specialty: true,
      closest: true
    });
  };

  const handleBackDoctors = () => {
    setDisableTabs({
      ...disableTabs,
      filter: true,
      doctors: false,
      calendar: true,
      closest: true
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
      specialty: true
    });
  };

  const handleNextSpecialty = () => {
    setDisableTabs({
      ...disableTabs,
      filter: true,
      doctors: true,
      calendar: true,
      specialty: false,
    });
  };

  const handleNextClosest = () => {
    setDisableTabs({
      ...disableTabs,
      filter: true,
      closest: false,
    });
  };

  const handleBackClosest = () => {
    setSelectedSpecialization("");
    setDoctorSelected(null);
    setDisableTabs({
      ...disableTabs,
      filter: false,
      doctors: true,
      calendar: true,
      closest: true
    });
  };


  {/* CARROUSEL DOCTORES - TURNO MAS PROXIMO*/}

  const handlePrevClick = () => {
    setCurrentDoctorIndex((prevIndex) =>
      prevIndex === 0 ? closestAppointments.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentDoctorIndex((prevIndex) =>
      prevIndex === closestAppointments.length - 1 ? 0 : prevIndex + 1
    );
  };


  const fetchDataCalendar = useCallback(async () => {
    try {
      if (doctorSelected?.value) {
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
    setCurrentPage(1);
    const fetchDataDoctors = async () => {
      try {
        await fetchDoctors();
      } catch (err) {
        throw new Error(err.message);
      }
    };
    if (isActive) fetchDataDoctors();
  }, [isActive, selectedSpecialization]);

  if (!isActive) {
    return null;
  }

  const renderDoctors = () => {
    const filteredDoctors = doctors.filter(doctor =>
      normalizeText(doctor.label).includes(normalizeText(searchTerm))
    );

    {/*No paginamos en dispositivos móviles y mostramos todos los doctores*/} 
    if (window.innerWidth <= 768) {
      return filteredDoctors.map((doctor, idx) => (
        <Flex
          key={idx}
          w="full"
          h="88px"
          justifyContent="space-around"
          boxShadow="0px 4px 4px 0px #00000040"
          borderRadius="xl"
          p={2}
          m={[4, 0]}
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
            w={{ base: '60px', md: '55px' }}
            h={{ base: '60px', md: '55px' }}
          />
          <Flex flexDirection="column" justifyContent="space-between" minWidth={180}>
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
              <Box display="flex" alignItems="center">
                {renderStars(doctor.averageRating)}
                <Text fontSize="xs" fontWeight={300} lineHeight="14.06px" ml={1}>
                  ({doctor.averageRating.toFixed(1)})
                </Text>
              </Box>
            </Box>
            <Flex gap={2}>
              <Box display={["none", "block", "block", "block", "block", "block"]}>
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
      ));
    }

    {/*Paginamos en dispositivos de mayor tamaño*/}
    const currentDoctors = filteredDoctors.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    return currentDoctors.map((doctor, idx) => (
      <Flex
        key={idx}
        w={["full", "265px"]}
        h="88px"
        justifyContent="space-around"
        boxShadow="0px 4px 4px 0px #00000040"
        borderRadius="xl"
        p={2}
        m={[4, 0]}
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
          w={{ base: '60px', md: '55px' }}
          h={{ base: '60px', md: '55px' }}
        />
        <Flex flexDirection="column" justifyContent="space-between" minWidth={180}>
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
            <Box display="flex" alignItems="center">
              {renderStars(doctor.averageRating)}
              <Text fontSize="xs" fontWeight={300} lineHeight="14.06px" ml={1}>
                ({doctor.averageRating.toFixed(1)})
              </Text>
            </Box>
          </Box>
          <Flex gap={2}>
            <Box display={["none", "block", "block", "block", "block", "block"]}>
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
    ));
  };

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

      {/* Condición de la pestaña de filtro inicial */}
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
              onClick={handleNextSpecialty}
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
              onClick={handleNextClosest}
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

      {!disableTabs.specialty && (
        <Fragment>
          <Text fontWeight={400} fontSize="md" lineHeight="18.75px" py={2}>
            ¿Qué especialidad necesitas?
          </Text>
          <Select
            placeholder="Elegir especialidad"
            fontSize={["xs", "md"]}
            w={["auto", "250px"]}
            h={["28px", "36px"]}
            border="none"
            borderBottom="2px solid #104DBA"
            borderRadius="0"
            iconColor="#104DBA"
            focusBorderColor="#104DBA"
            sx={{
              boxShadow: "none",
              _focus: {
                borderBottom: "2px solid #104DBA",
                boxShadow: "none"
              },
              paddingBottom: [3, 1]
            }}
            value={selectedSpecialization}
            onChange={handleSpecializationSelect}
          >
            {specializations.map((spec) => (
              <option key={spec._id} value={spec.name}>
                {spec.name}
              </option>
            ))}
          </Select>
          <Flex justifyContent="flex-end" gap={4} mt={4}>
            <Button
              bg="#104DBA"
              color="#FFFFFF"
              w="120px"
              size="xs"
              py={3}
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
            {selectedSpecialization && (
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
                onClick={handleNextProfesional}
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

      {!disableTabs.doctors && (
        <Fragment>
          <Flex direction={{ base: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" pl={{ base: '12px', md: '0' }} pt={{ base: '4px', md: '0' }} pb={{ base: '4px', md: '0' }}>
            <Text fontWeight={400} fontSize="md" lineHeight="18.75px" width={{ base: 'fit-content', md: '235px' }}>
              Por favor elija al profesional con el que desea atenderse.
            </Text>
            <InputGroup mt={{ base: 4, md: 0 }} position={{ base: 'relative', md: 'absolute' }} right={{ base: '0', md: '45px' }} top={{ base: '0', md: '17px' }} w="220px">
              <Input
                placeholder="Buscar nombre de profesional"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                border="2px solid #A4A4A4"
                borderRadius="20px"
                fontSize="xs"
                paddingY="1px"
                height="22px"
                _placeholder={{ color: 'black' }}
              />
              <InputRightElement pointerEvents="none" display="flex" alignItems="center" paddingBottom="18px">
                <FaSearch color="gray.500" style={{ width: '12px', height: '12px' }} />
              </InputRightElement>
            </InputGroup>
          </Flex>

          <Flex
            flex={1}
            w="full"
            flexWrap="wrap"
            justifyContent="space-between"
            flexDirection="row"
            gap={[0, 4]}
            p={2}
            mt={1}
            minH={["300px", "85px", "85px", "105px", "105px", "240px"]}
            sx={{
              '@media (max-width: 768px)': {
                maxHeight: '45vh',
                overflowY: 'scroll',
              },
            }}
          >
            {renderDoctors()}
          </Flex>

          {/* Controles de Paginación */}
          {window.innerWidth > 768 && totalPages > 1 && (
            <Flex justifyContent="flex-end" alignItems="center" mt={0} pr={2} mb={1}>
              <MdOutlineNavigateBefore
                style={{ cursor: 'pointer', color: '#104DBA', marginRight: '5px' }}
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              />
              <Text mx={1} fontSize="xs">
                Mostrando {Math.min(currentPage * itemsPerPage, doctors.length)} de {doctors.length} resultados
              </Text>
              <MdOutlineNavigateNext
                style={{ cursor: 'pointer', color: '#104DBA', marginLeft: '5px' }}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              />
            </Flex>
          )}

          {/* Botones de Navegación */}
          {doctorSelected && (
            <Flex
              justifyContent={{ base: "center", md: "flex-end" }}
              gap={[2, 4]}
              mt={2}
              mb={2}
              sx={{
                '@media (max-width: 500px)': {
                  position: 'fixed',
                  bottom: '75px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bg: 'white',
                  zIndex: 1000,
                  p: 7,
                },
              }}
            >
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
            </Flex>
          )}
        </Fragment>
      )}

      {!disableTabs.closest && (
        <Fragment>
          <Flex flexDirection="column" alignItems="flex-start">
            <Text fontWeight={400} fontSize="md" lineHeight="18.75px" mt="-1.5" p={[3, 0]}>
              Por favor, seleccione primero la especialidad médica:
            </Text>
            <Select
              placeholder="Elegir especialidad"
              fontSize={["sm", "md"]}
              w={["auto", "250px"]}
              h={["30px", "36px"]}
              border="none"
              borderBottom="2px solid #104DBA"
              borderRadius="0"
              iconColor="#104DBA"
              focusBorderColor="#104DBA"
              sx={{
                boxShadow: "none",
                _focus: {
                  borderBottom: "2px solid #104DBA",
                  boxShadow: "none"
                },
                paddingBottom: [3, 1]
              }}
              mt={[0, 3]}
              value={selectedSpecialization}
              onChange={async (e) => {
                setSelectedSpecialization(e.target.value);
                await fetchClosestAppointments(e.target.value);
              }}
            >
              {specializations.map((spec) => (
                <option key={spec._id} value={spec.name}>
                  {spec.name}
                </option>
              ))}
            </Select>
          </Flex>

          {selectedSpecialization && (
            <Fragment>
              <Text fontWeight={400} fontSize="md" lineHeight="18.75px" mt={0} p={[4, 0]}>
                El turno más próximo es:
              </Text>
              {loadingCalendar ? (
                <Center h="100px" flexDirection="column">
                  <Spinner />
                  <Text mt={2}>Un momento por favor...</Text>
                </Center>
              ) : closestAppointments.length > 0 ? (
                <Fragment>
                  <Flex justifyContent="center" alignItems="center">
                    <Button onClick={handlePrevClick}
                      rounded="full"
                      p={1}
                      m={4}
                      color="#FFF"
                      _active={{ bgColor: "#104DBA" }}
                      _hover={{ bgColor: "#104DBA40" }}
                      size="xs"
                      bg="#104DBA"
                    >
                      <MdOutlineNavigateBefore size="md" />
                    </Button>

                    <Flex
                      key={currentDoctorIndex}
                      w={["full", "265px"]}
                      h="90px"
                      justifyContent="space-around"
                      boxShadow="0px 4px 4px 0px #00000040"
                      borderRadius="xl"
                      p={2}
                      cursor="pointer"
                      onClick={() => handleDoctorSelection(closestAppointments[currentDoctorIndex].doctor, closestAppointments[currentDoctorIndex])}
                      border="2px"
                      borderColor={
                        doctorSelected?.email === closestAppointments[currentDoctorIndex].doctor.email
                          ? "#104DBA"
                          : "transparent"
                      }
                    >
                      <Image
                        rounded="full"
                        src={closestAppointments[currentDoctorIndex].doctor.picture}
                        w={{ base: '60px', md: '55px' }}
                        h={{ base: '60px', md: '55px' }}
                      />
                      <Flex flexDirection="column" justifyContent="space-between">
                        <Box>
                          <Text fontSize="xs" lineHeight="14.06px" fontWeight={700}>
                            {new Date(closestAppointments[currentDoctorIndex].nextAvailable.start).toLocaleDateString('es-ES', { day: '2-digit', month: 'long' }).toUpperCase()}, {
                              new Date(new Date(closestAppointments[currentDoctorIndex].nextAvailable.start).setHours(new Date(closestAppointments[currentDoctorIndex].nextAvailable.start).getHours() + 3)).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                            } Hs.
                          </Text>
                          <Text fontSize="xs" fontWeight={700} lineHeight="14.06px">
                            {closestAppointments[currentDoctorIndex].doctor.firstName} {closestAppointments[currentDoctorIndex].doctor.lastName}
                          </Text>
                          <Text fontSize="xs" fontWeight={400} lineHeight="14.06px">
                            {closestAppointments[currentDoctorIndex].doctor.especialization}
                          </Text>
                          <Box display="flex" alignItems="center">
                            {renderStars(closestAppointments[currentDoctorIndex].doctor.averageRating)}
                            <Text fontSize="xs" fontWeight={300} lineHeight="14.06px" ml={2}>
                              ({closestAppointments[currentDoctorIndex].doctor.averageRating.toFixed(1)})
                            </Text>
                          </Box>
                          <Flex gap={2}>
                            <Box display={["none", "block", "block", "block", "block", "block"]}>
                              <FaMoneyBill
                                style={{
                                  width: "16px",
                                  height: "16px",
                                  color: "gray",
                                }}
                              />
                            </Box>
                            <Text fontSize="xs" fontWeight={300} lineHeight="14.06px">
                              Valor de la consulta: ${closestAppointments[currentDoctorIndex].doctor.reservePrice}
                            </Text>
                          </Flex>
                        </Box>
                      </Flex>
                    </Flex>

                    <Button onClick={handleNextClick}
                      rounded="full"
                      p={1}
                      m={4}
                      color="#FFF"
                      _active={{ bgColor: "#104DBA" }}
                      _hover={{ bgColor: "#104DBA40" }}
                      size="xs"
                      bg="#104DBA"
                    >
                      <MdOutlineNavigateNext size="md" />
                    </Button>
                  </Flex>

                  <Flex justifyContent="flex-end" gap={4} mt={4}>
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
                      onClick={handleBackClosest}
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
                    {doctorSelected && (
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
              ) : null}
            </Fragment>
          )}
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
              minH={["290px", "auto", "auto", "auto", "321px", "321px"]}
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