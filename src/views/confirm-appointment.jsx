import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { instance } from '../utils/axios';
import {
  Box,
  Button,
  Heading,
  Text,
  Spinner,
  Center,
  Flex,
  Image,
  Divider,
  Checkbox,
  Link,
  useMediaQuery,
} from '@chakra-ui/react';
import { Footer } from '../components/footer';
import { IoMdCalendar } from 'react-icons/io';
import { FaInfoCircle } from 'react-icons/fa';
import { SiMercadopago } from "react-icons/si";

const ConfirmAppointment = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const bookingId = params.get('bookingId');
  const [turno, setTurno] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkTerms, setCheckTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile] = useMediaQuery("(max-width: 600px)");

  const handleCheckTerms = (e) => setCheckTerms(e.target.checked);

  useEffect(() => {
    const fetchTurnoDetails = async () => {
      try {
        const response = await instance.get(`/bookings/${bookingId}`);
        const fetchedTurno = response.data.data;
        // Fetch doctor data based on the user_email
        const doctorResponse = await instance.get(`/users?email=${fetchedTurno.organizer.email}`);
        if (doctorResponse.data.success) {
          const doctor = doctorResponse.data.data[0];
          fetchedTurno.organizer.especialization = doctor.especialization;
        }
        setTurno(fetchedTurno);
      } catch (error) {
        console.error('Error fetching turno details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurnoDetails();
  }, [bookingId]);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const response = await instance.post('/payments/create-booking-payment', {
        bookingId: turno._id,
        unit_price: turno.organizer.price,
        user_email: turno.organizer.email,
        tutor_email: turno.patientInfo.email
      });
      window.location.href = response.data.data.init_point;
    } catch (error) {
      console.error('Error initiating payment:', error);
    } finally {
      setIsLoading(false);
    }
  };


  if (loading) {
    return (
      <Center height="100vh">
        <Spinner />
      </Center>
    );
  }

  if (!turno) {
    return (
      <Center height="100vh">
        <Text>Error al cargar los detalles del turno.</Text>
      </Center>
    );
  }

  const doctorEspecializations = turno.organizer.especialization?.join(', ') || 'N/A';

  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Box backgroundColor="#104DBA" height={{ base: "10px", lg: "5px", xl:"10px" }} width="100%"></Box>
      <Box backgroundColor="#FFFFFF" height={{ base: "60px", lg: "60px", xl:"70px" }} width="100%" boxShadow="0px 4px 4px 0px rgba(0, 0, 0, 0.25)">
        <Box p={{base: 1, lg: 1, xl: 2}} px={4} display="flex" alignItems="center" justifyContent="start">
          <Box display="flex" alignItems="center" as='a' href="https://www.zonamed.com.ar" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 462 276"
              fill="none"
              width="60px"
              height="60px"
            >
              <path
                d="M410.743 102.043C410.743 192.059 337.77 265.032 247.754 265.032C157.738 265.032 84.7654 192.059 84.7654 102.043"
                stroke="#104DBA"
                strokeWidth="20"
              />
              <path
                d="M141.071 53.1461C141.071 84.2426 115.862 109.451 84.7654 109.451C53.6689 109.451 28.4602 84.2426 28.4602 53.1461"
                stroke="#104DBA"
                strokeWidth="20"
              />
              <path
                d="M452 51.9794C452 74.6004 433.463 93.0984 410.399 93.0984C387.334 93.0984 368.797 74.6004 368.797 51.9794C368.797 29.3583 387.334 10.8604 410.399 10.8604C433.463 10.8604 452 29.3583 452 51.9794Z"
                stroke="#104DBA"
                strokeWidth="20"
              />
              <circle
                cx="28.9353"
                cy="29.7956"
                r="18.9353"
                stroke="#104DBA"
                strokeWidth="20"
              />
              <circle
                cx="140.818"
                cy="29.7956"
                r="18.9353"
                stroke="#104DBA"
                strokeWidth="20"
              />
            </svg>
            <Text ml={2} fontSize={{ base: "lg", lg: "lg", xl:"xl" }} fontWeight="bold" color="#104DBA">Zona Med</Text>
          </Box>
        </Box>
      </Box>
      {isMobile ? (
        <Box w="full" flex="1" p={8} className="container">
          <Heading marginBottom={4} marginTop={6} fontSize="30px" textAlign="center">¡Hola {turno.patientInfo.name}!</Heading>
          <Heading fontSize="24px" textAlign="center" color="#104DBA">Estás a solo un paso de confirmar y reservar tu turno.</Heading>
          <Flex
              boxShadow="0px 4px 4px 0px #00000040"
              w={["full", "285px"]}
              minH="268px"
              justifyContent="center"
              flexDirection="column"
              mx="auto"
              my={8}
              borderRadius={10}
            >
              <Box w="full">
                <Flex
                  w="full"
                  h="auto"
                  justifyContent="space-around"
                  p={2}
                  mx="auto"
                  gap={2}
                >
                  <Image
                    rounded="full"
                    src={turno.organizer.picture}
                    w="90px"
                    h="90px"
                  />
                  <Flex flexDirection="column" justifyContent="space-around">
                    <Box >
                      <Text
                        fontSize="md"
                        textTransform="capitalize"
                        fontWeight={700}
                        lineHeight="19.69px"
                      >
                        Dr/Dra. {turno.organizer.name}
                      </Text>
                      <Text fontSize="sm" fontWeight={400} lineHeight="16.88px">
                        {doctorEspecializations}
                      </Text>
                      <Flex alignItems="center" gap={1}>
                        <IoMdCalendar style={{ color: "#AAAAAA" }} />
                        <Text fontSize="sm" lineHeight="14.06px">
                          {new Date(turno.start.dateTime).toLocaleString()}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
                <Divider />
                <Text fontSize="md" fontWeight={400} lineHeight="14.06px" textAlign="center" my={5}>
                  Valor de la consulta: ${turno.organizer.price}
                </Text>
              </Box>
              <Flex flexDirection="column" gap={2} flex={1}>
                <Flex mx={4} alignItems="center">
                  <Checkbox value={checkTerms} onChange={handleCheckTerms}>
                    <Text fontSize="12px">
                      Al sacar turno, aceptas los <Link color="#104DBA" href="/condiciones-del-servicio">términos y condiciones</Link>, 
                      y confirmas haber entendido nuestra <Link color="#104DBA" href="/politica-de-privacidad">política de privacidad</Link>.
                    </Text>
                  </Checkbox>
                </Flex>
                                <Flex gap={2} mx={4}>
                  <FaInfoCircle style={{ width: "24px", height: "24px" }} />
                  <Text fontSize="12px">
                    Tenés 24 hs. para confirmar tu reserva. En caso contrario, se cancelará y liberará la agenda del profesional.
                  </Text>
                </Flex>
                <Flex justifyContent="center" alignItems="center" flexDirection="column" flex={1}>
                  {isLoading ? (
                    <Center>
                      <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='sm'
                      />
                    </Center>
                  ) : (
                    <Button
                      bg="#104DBA" color="#FFFFFF" w="auto" size="xs"
                      fontWeight={400}
                      onClick={handlePayment}
                      textTransform="uppercase"
                      fontSize="md"
                      mx="auto"
                      isDisabled={!checkTerms}
                      my={8}
                      padding={4}
                      leftIcon={<SiMercadopago style={{ fontSize: "24px" }} />}
                    >
                      Abonar con Mercado Pago
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Flex>
          <Box
            background="linear-gradient(61deg, #104DBA -12.14%, #87A6DD 55.27%, #FFF 134.94%)"
            boxShadow="0px 6px 22px 0px rgba(217, 217, 217, 0.18)"
            width="100%"
            height="80px"
            position="fixed"
            bottom="0"
            left="0"
            p={4}
            textAlign="center"
          >
            <Link color="#FFF" fontSize="14px" href="https://www.zonamed.com.ar" target="_blank">
              www.zonamed.com.ar
            </Link>
            <Text color="#FFF" fontSize="14px" mt={2}>
              © 2025 ZonaMed – Todos los derechos reservados
            </Text>
          </Box>
        </Box>
      ) : (
        <>
          <Box flex="1">
            <Heading marginTop={{ base: 5, lg: 5, xl: 20 }} marginBottom={{ base: 2, lg: 1, xl: 4 }} fontSize={{ base: "26px", lg: "26px", xl: "38px" }} textAlign="center">¡Hola {turno.patientInfo.name}!</Heading>
            <Heading fontSize={{ base: "20px", lg: "20px", xl: "28px" }} textAlign="center" color="#104DBA">Estás a solo un paso de confirmar y reservar tu turno.</Heading>
            <Flex
              boxShadow="0px 4px 14px 0px #00000040"
              w={{ base: "full", lg: "310px", xl: "500px" }}
              minH={{ base: "full", lg: "285px", xl: "380px" }}
              justifyContent="center"
              flexDirection="column"
              mx="auto"
              my={{ base: 5, lg: 5, xl: 12 }}
              px={{ base: 2, lg: 2, xl: 4 }}
              borderRadius={6}
            >
              <Box w="full">
                <Flex
                  w="full"
                  h="auto"
                  justifyContent="space-around"
                  p={2}
                  mx="auto"
                  gap={2}
                >
                  <Image
                    rounded="full"
                    src={turno.organizer.picture}
                    w={{ base: "80px", lg: "80px", xl: "120px" }}
                    h={{ base: "80px", lg: "80px", xl: "120px" }}
                  />
                  <Flex flexDirection="column" justifyContent="space-around">
                    <Box>
                      <Text
                        fontSize={{ base: "sm", lg: "sm", xl: "xl" }}
                        textTransform="capitalize"
                        fontWeight={700}
                        lineHeight="19.69px"
                      >
                        Dr/Dra. {turno.organizer.name}
                      </Text>
                      <Text fontSize={{ base: "xs", lg: "xs", xl: "md" }} fontWeight={400} lineHeight={{ base: "16.88px", lg: "16.88px", xl: "35.88px" }}>
                        {doctorEspecializations}
                      </Text>
                      <Flex alignItems="center" gap={1}>
                        <IoMdCalendar style={{ color: "#AAAAAA" }} />
                        <Text fontSize={{ base: "xs", lg: "xs", xl: "md" }} lineHeight="14.06px">
                          {new Date(turno.start.dateTime).toLocaleString()}
                        </Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
                <Divider />
                <Text fontSize={{ base: "sm", lg: "sm", xl: "lg" }} fontWeight={400} lineHeight={{ base: "xs", lg: "15px", xl: "30px" }} textAlign="center" my={3}>
                  Valor de la consulta: ${turno.organizer.price}
                </Text>
              </Box>
              <Flex flexDirection="column" gap={2} flex={1}>
                <Flex mx={4} alignItems="center">
                  <Checkbox value={checkTerms} onChange={handleCheckTerms}>
                    <Text mx={{ base: "0px", lg: "0px", xl: "7px" }} fontSize={{ base: "9px", lg: "9px", xl: "14px" }}>
                      Al sacar turno, aceptas los <Link color="#104DBA" href="/condiciones-del-servicio">términos y condiciones</Link>, 
                      y confirmas haber entendido nuestra <Link color="#104DBA" href="/politica-de-privacidad">política de privacidad</Link>.
                    </Text>
                  </Checkbox>
                </Flex>
                <Flex gap={2} mx={4}>
                  <FaInfoCircle style={{ width: "24px", height: "24px" }} />
                  <Text mx={{ base: "0px", lg: "0px", xl: "7px" }} fontSize={{ base: "9px", lg: "9px", xl: "14px" }}>
                    Tenés 24 hs. para confirmar tu reserva. En caso contrario, se cancelará y se liberará la agenda del profesional.
                  </Text>
                </Flex>
                <Flex justifyContent="center" alignItems="center" flexDirection="column" flex={1}>
                  {isLoading ? (
                    <Center>
                      <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='sm'
                      />
                    </Center>
                  ) : (
                    <Button
                      bg="#104DBA" color="#FFFFFF" w="auto" size="sm"
                      fontWeight={400}
                      onClick={handlePayment}
                      textTransform="uppercase"
                      fontSize={{ base: "xs", lg: "xs", xl: "md" }}
                      mx="auto"
                      isDisabled={!checkTerms}
                      leftIcon={<SiMercadopago style={{ fontSize: "24px" }} />}
                      marginBottom={2}
                    >
                      Abonar con Mercado Pago
                    </Button>
                  )}
                </Flex>
              </Flex>
            </Flex>
          </Box>
          <Footer />
        </>
      )}
    </Flex>
  );
};

export default ConfirmAppointment;

