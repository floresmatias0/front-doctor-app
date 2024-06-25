import PropTypes from "prop-types";
import { Box, Button, Center, Checkbox, Divider, Flex, Image, Input, Link, Spinner, Text } from "@chakra-ui/react";
import { Fragment, useCallback, useEffect, useState } from "react";
import { instance } from "../utils/axios";
import { MdOutlineNavigateNext } from "react-icons/md";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { IoMdCalendar } from "react-icons/io";
import { FaInfoCircle } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const ListSymptoms = ({
  isActive,
  user,
  patientSelected,
  doctorSelected,
  daySelected
}) => {
  const initialStateTabs = {
    symptoms: false,
    payment: true,
  };

  const [disableTabs, setDisableTabs] = useState(initialStateTabs);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [checkTerms, setCheckTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [urlMercadopago, setUrlMercadopago] = useState(null)

  const fetchSymptoms = async () => {
    try {
      const { data } = await instance.get("/symptoms");
      const response = data;

      if (response.success) {
        let symptoms = response.data;

        return setSymptoms(symptoms);
      }

      setSymptoms([]);
    } catch (err) {
      console.log("fetch symptoms", err.message);
      throw new Error("Something went wrong to search symptoms");
    }
  };

  const handleSymptomSelect = (symptom) => {
    const isSelected = selectedSymptoms.includes(symptom);
    if (isSelected) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleNextSymptoms = () => {
    setDisableTabs({
      ...disableTabs,
      symptoms: true,
      payment: false,
    });
  };

  const confirmReserve = useCallback(async () => {
    try {
        setIsLoading(true)
        const endDateTime = new Date(daySelected);
        endDateTime.setMinutes(endDateTime.getMinutes() + doctorSelected?.reserveTime);
        
        const payment = await instance.post('/payments/create', {
            user_email: doctorSelected?.value,
            tutor_email: user?.email,
            patient: patientSelected?._id,
            startDateTime: `${format(daySelected, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}`,
            endDateTime: `${format(endDateTime, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")}`,
            unit_price: doctorSelected?.reservePrice,
            symptoms: selectedSymptoms
        })
        
        const { init_point, sandbox_init_point } = payment.data.data;

        if(import.meta.env.VITE_ENVIRONMENT === "localhost") {
            setUrlMercadopago(sandbox_init_point)
            return setIsLoading(false)
        }
        console.log({payment})
        setUrlMercadopago(init_point)
        setIsLoading(false)
    }catch(err) {
        throw new Error(err.message)
    }
  }, [doctorSelected, user, selectedSymptoms, daySelected, patientSelected])

  useEffect(() => {
    const fetchPaymentData = async () => {
        try {
          await confirmReserve();
        }catch(err){
            throw new Error(err.message)
        }
      }
  
      if(isActive) fetchPaymentData();
}, [confirmReserve, isActive])

  useEffect(() => {
    const fetchDataSymptoms = async () => {
      try {
        await fetchSymptoms();
      } catch (err) {
        console.log(err);
      }
    };

    if (isActive) fetchDataSymptoms();
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  const fechaFormateada = format(daySelected, "d  MMMM yyyy, HH:mm 'Hs.'", { locale: es });

  const handleClickPayment = () => window.location.replace(urlMercadopago)

  return (
    <Flex h="100%" flexDirection="column" p={4} gap={5}>
      <Text
        color="#FFF"
        bg="#104DBA"
        borderRadius="xl"
        w="120px"
        fontSize="xs"
        lineHeight="14.06px"
        textAlign="center"
        textTransform="capitalize"
        py={1}
      >
        Paciente: {patientSelected && patientSelected?.label}
      </Text>
      {!disableTabs.symptoms && (
        <Fragment>
          <Text fontWeight={400} fontSize="lg" lineHeight="18.75px">
            ¿Que sintomas presenta?
          </Text>
          <Flex gap={5} flexWrap="wrap">
            {symptoms?.length > 0 &&
              symptoms.map((symptom, idx) => (
                <Button
                  key={idx}
                  onClick={() => handleSymptomSelect(symptom)}
                  borderWidth="1px"
                  borderColor="#104DBA"
                  color={
                    selectedSymptoms.includes(symptom) ? "#FFF" : "#104DBA"
                  }
                  px={3}
                  borderRadius="xl"
                  fontSize="md"
                  textTransform="uppercase"
                  cursor="pointer"
                  bgColor={
                    selectedSymptoms.includes(symptom) ? "#104DBA" : "#FFF"
                  }
                  _hover={{ backgroundColor: "#104DBA", color: "#FFF" }}
                  size="xs"
                  fontWeight={400}
                >
                  {symptom?.name}
                </Button>
              ))}
          </Flex>
          <Flex
            flex={1}
            justifyContent="flex-end"
            alignItems="flex-end"
            my={[2, 4]}
          >
            {selectedSymptoms.length > 0 && (
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
                onClick={handleNextSymptoms}
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
      {!disableTabs.payment && (
        <Fragment>
          <Text fontWeight={400} fontSize="lg" lineHeight="18.75px">
            Por favor confirme su turno
          </Text>
          <Flex flex={1} flexDirection="column">
            <Flex
              boxShadow="0px 4px 4px 0px #00000040"
              w={["full", "285px"]}
              minH="268px"
              borderRadius="xl"
              justifyContent="center"
              flexDirection="column"
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
                    src={doctorSelected?.picture}
                    w="64px"
                    h="64px"
                  />
                  <Flex flexDirection="column" justifyContent="space-between">
                    <Box>
                      <Text
                        fontSize="sm"
                        textTransform="capitalize"
                        fontWeight={700}
                        lineHeight="19.69px"
                      >
                        Dr. {doctorSelected?.label}
                      </Text>
                      <Text fontSize="xs" fontWeight={400} lineHeight="16.88px">
                        {doctorSelected?.especialization}
                      </Text>
                      <Flex alignItems="center" gap={1}>
                        <IoMdCalendar style={{ color: "#AAAAAA" }} />
                        <Text fontSize="xs" lineHeight="14.06px">{fechaFormateada}</Text>
                      </Flex>
                    </Box>
                  </Flex>
                </Flex>
                <Divider />
                <Text fontSize="xs" fontWeight={300} lineHeight="14.06px" textAlign="center" my={3}>
                  Valor de la consulta: ${doctorSelected?.reservePrice}
                </Text>
              </Box>
              <Flex flexDirection="column" gap={2} flex={1}>
                  <Flex mx={4} alignItems="center">
                    <Checkbox value={checkTerms} onChange={() => setCheckTerms(!checkTerms)}>
                      <Text fontSize="9px">
                          Al sacar turno, aceptas los <Link color="#104DBA" href="/condiciones-del-servicio">terminos y condiciones</Link>, 
                          y confirmas haber entendido nuestra <Link color="#104DBA" href="/politica-de-privacidad">politica de privacidad</Link>
                        </Text>
                    </Checkbox>
                  </Flex>
                  <Flex gap={2} mx={4}>
                    <FaInfoCircle style={{ width: "24px", height: "24px" }} />

                    <Text fontSize="9px">
                      Si cancelas hasta 24 hs previas del turno,  se realizará el reintegro correspondiente al medio de pago utilizado. 
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
                        urlMercadopago && (
                          <Button
                              bg="#104DBA" color="#FFFFFF" w="auto" size="xs"
                              fontWeight={400}
                              onClick={handleClickPayment}
                              textTransform="uppercase"
                              fontSize="xs"
                              mx="auto"
                              isDisabled={!checkTerms}
                          >
                              abonar con mercadopago
                          </Button>
                        )
                    )}
                  </Flex>
                </Flex>
            </Flex>
          </Flex>
        </Fragment>
      )}
    </Flex>
  );
};

ListSymptoms.propTypes = {
  onNext: PropTypes.func,
  isActive: PropTypes.bool,
};

export default ListSymptoms;
