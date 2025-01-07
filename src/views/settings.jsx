import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Text,
  useDisclosure,
  useToast,
  Heading,
  Select,
  FormLabel,
  Spinner,
  Checkbox,
} from "@chakra-ui/react";
import { AppContext } from "../components/context";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import { instance } from "../utils/axios";
import { AlertModal } from "../components/alerts";
import { useSearchParams } from "react-router-dom";
import FormPatient from "../components/form-patient";
import { SiMercadopago } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import { FaCircleCheck } from "react-icons/fa6";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { MdErrorOutline } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import axios from 'axios';

const initialState = {
  firstName: false,
  lastName: false,
  email: false,
  reservePrice: false,
  reserveTime: false,
  especialization: false
};

export default function Settings() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const currentParams = Object.fromEntries([...searchParams]);
  const { code } = currentParams;
  const { user, setUser, patients, createPatient, updatePatient } = useContext(AppContext);
  const [isEditable, setIsEditable] = useState(initialState);
  const [patientSelected, setPatientSelected] = useState(null);
  const [secondSlotEnabled, setSecondSlotEnabled] = useState(!!(user?.reserveTimeFrom2 && user?.reserveTimeUntil2));

  const [provincia, setProvincia] = useState(user?.provincia || '');
  const [localidad, setLocalidad] = useState(user?.localidad || '');
  const [provincias, setProvincias] = useState([]);
  const [localidades, setLocalidades] = useState([]);

  // Estado para el primer AlertModal
  const {
    isOpen: isOpenFirst,
    onOpen: onOpenFirst,
    onClose: onCloseFirst,
  } = useDisclosure();

  // Estado para el segundo AlertModal
  const {
    isOpen: isOpenSecond,
    onOpen: onOpenSecond,
    onClose: onCloseSecond,
  } = useDisclosure();

  const handleSubmit = async (values) => {
    try {
      const payload = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        dateOfBirth: values.dateOfBirth,
        identityType: values.identityType,
        identityId: values.identityId,
        genre: values.genre,
        phone: values.phone,
        socialWork: values.socialWork,
        socialWorkId: values.socialWorkId,
        reservePrice: values.reservePrice,
        reserveTime: values.reserveTime,
        especialization: values.especialization,
        enrollment: values.enrollment,
        reserveTimeFrom: values.reserveTimeFrom,
        reserveTimeUntil: values.reserveTimeUntil,
        reserveTimeFrom2: secondSlotEnabled ? values.reserveTimeFrom2 : null,
        reserveTimeUntil2: secondSlotEnabled ? values.reserveTimeUntil2 : null,
        reserveSaturday: values.reserveSaturday,
        reserveSunday: values.reserveSunday,
        provincia: values.provincia,
        localidad: values.localidad
      };

      const updatedUser = await instance.put(`/users/${user?._id}`, payload);
      setUser(updatedUser.data.data);
      setIsEditable(initialState);
      toast({
        position: "top",
        render: () => (
          <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto", "428px"]} boxShadow="2xl">
            <HiOutlineBadgeCheck style={{ width: "36px", height: "36px", color: "#104DBA" }} />
            <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">
              El usuario se ha actualizado exitosamente.
            </Text>
          </Box>
        )
      });
    } catch (err) {
      toast({
        position: "top",
        render: () => (
          <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto", "428px"]} boxShadow="2xl">
            <MdErrorOutline style={{ width: "36px", height: "36px", color: "red" }} />
            <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">
              El usuario no se pudo actualizar.
            </Text>
          </Box>
        )
      });
      throw new Error(err.message);
    }
  };


  const handleSelectPatient = (patient) => {
    let formattedDate = patient.birthdate;

    if (patient.birthdate !== "") {
      let date = new Date(patient.birthdate);
      let year = date.getUTCFullYear();
      let month = String(date.getUTCMonth() + 1).padStart(2, "0");
      let day = String(date.getUTCDate()).padStart(2, "0");

      formattedDate = `${year}-${month}-${day}`;
    }

    let transformPatient = {
      ...patient,
      birthdate: formattedDate
    };

    setPatientSelected(transformPatient);
    onOpenSecond();
  };

  const connectMercadopago = useCallback(async () => {
    try {
      const body = {
        code: code,
        user_id: user._id,
      };

      await instance.post("/users/mercadopago", body);

      toast({
        title: "Mercado pago vinculado con exito",
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: "success",
      });

      setTimeout(() => {
        navigate("/configuracion");
      }, 2000);
    } catch (err) {
      toast({
        title: "Error en la respuesta de api mercadopago",
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: "error",
      });
      throw new Error(err.message);
    }
  }, [code, user, toast]);

  const handleLoginMp = () => {
    const randomId = Math.floor(Math.random() * Date.now());
    window.open(
      `${import.meta.env.VITE_MERCADOPAGO_OAUTH_URL}?client_id=${import.meta.env.VITE_MERCADOPAGO_CLIENT_ID
      }&response_type=code&platform_id=mp&state=${randomId}&redirect_uri=${import.meta.env.VITE_MERCADOPAGO_REDIRECT_URL
      }`,
      "_self"
    );
  };

  useEffect(() => {
    if (code) {
      const fetchDataMP = async () => {
        try {
          await connectMercadopago();
        } catch (err) {
          console.log("fetchDataMP ", err.message);
        }
      };

      fetchDataMP();
    }
  }, [code, connectMercadopago]);

  //LOGICA PARA EL SELECT DE ESPECIALIZACION
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      const { data } = await instance.get("/specializations");
      const response = data;
      if (response.success) {
        let specializations = response.data;
        specializations.sort((a, b) => a.name.localeCompare(b.name));
        setSpecializations(specializations);
      } else {
        setSpecializations([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("fetch specializations", err.message);
      setLoading(false);
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

  // Función para obtener provincias
  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        const response = await axios.get('https://apis.datos.gob.ar/georef/api/provincias');
        const sortedProvinces = response.data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre));
        setProvincias(sortedProvinces);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvincias();
  }, []);

  // Función para obtener localidades según la provincia seleccionada
  useEffect(() => {
    if (provincia) {
      const fetchLocalidades = async () => {
        try {
          const response = await axios.get(`https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia}&max=5000`);
          const sortedLocalities = response.data.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setLocalidades(sortedLocalities);
        } catch (error) {
          console.error("Error fetching localities:", error);
        }
      };
      fetchLocalidades();
    }
  }, [provincia]);

  return (
    <Flex
      w={["full", "calc(100% - 155px)"]}
      h={["full", "calc(100% - 80px)"]}
      px={[4, 2]}
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      overflowY="auto"
    >
      <Box maxW={["full", "1240px", "full"]}>
        <Flex
          flexDirection={["column", "row"]}
          justifyContent="space-between"
          alignItems={["start", "center"]}
        >
          <Heading
            fontSize={["15px", "25px"]}
            fontWeight={700}
            lineHeight={["17.58px", "29.3px"]}
            color="#104DBA"
            border={["1px solid #104DBA", "none"]}
            px={[4, 0]}
            py={[0.5, 0]}
            rounded={["xl", "none"]}
          >
            Ajustes
          </Heading>
          {user?.role === "PACIENTE" && (
            <Button
              bg="#104DBA"
              rightIcon={<ChevronRightIcon style={{ fontSize: "24px" }} />}
              onClick={onOpenFirst}
              color="#FFFFFF"
              w={["auto", "213px"]}
              size="sm"
              borderRadius="2xl"
              mt={4}
              fontWeight={500}
            >
              AGREGAR PACIENTE
            </Button>
          )}
        </Flex>
        <Box my={4}>
          <Formik
            initialValues={{
              firstName: user?.firstName,
              lastName: user?.lastName,
              email: user?.email,
              dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
              identityType: user?.identityType,
              identityId: user?.identityId,
              genre: user?.genre,
              phone: user?.phone,
              reservePrice: user?.reservePrice,
              reserveTime: user?.reserveTime,
              especialization: user?.especialization,
              socialWork: user?.socialWork,
              socialWorkId: user?.socialWorkId,
              enrollment: user?.enrollment,
              reserveTimeFrom: user?.reserveTimeFrom,
              reserveTimeUntil: user?.reserveTimeUntil,
              reserveTimeFrom2: secondSlotEnabled ? user?.reserveTimeFrom2 : null,
              reserveTimeUntil2: secondSlotEnabled ? user?.reserveTimeUntil2 : null,
              reserveSaturday: user?.reserveSaturday,
              reserveSunday: user?.reserveSunday,
              provincia: user?.provincia || '',
              localidad: user?.localidad || ''
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form style={{ gap: 10, display: "flex", flexDirection: "column" }} >
                <Text
                  fontSize={["md", "xl"]}
                  fontWeight={700}
                  lineHeight={["16.41px", "23.44px"]}
                  color="#104DBA"
                >
                  Datos personales
                </Text>
                <Flex
                  w="full"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={5}
                  py={4}
                >
                  <Field name="firstName">
                    {({ field }) => (
                      <FormControl id="firstName" w={["100%", "220px"]} isRequired>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Nombre
                        </FormLabel>
                        <Input
                          placeholder="John"
                          fontSize={["xs", "md"]}
                          _placeholder={{ color: "gray.500" }}
                          w={["100%", "220px"]}
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="lastName">
                    {({ field }) => (
                      <FormControl id="lastName" w={["100%", "220px"]} isRequired>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Apellido
                        </FormLabel>
                        <Input
                          placeholder="Doe"
                          fontSize={["xs", "md"]}
                          _placeholder={{ color: "gray.500" }}
                          w={["100%", "220px"]}
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="dateOfBirth">
                    {({ field }) => (
                      <FormControl id="dateOfBirth" w={["100%", "220px"]} isRequired>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Fecha de nacimiento
                        </FormLabel>
                        <Input
                          _placeholder={{ color: "gray.500" }}
                          fontSize={["xs", "md"]}
                          type="date"
                          w={["100%", "220px"]}
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="genre">
                    {({ field }) => (
                      <FormControl id="genre" w={["100%", "220px"]} isRequired>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Género
                        </FormLabel>
                        <Select
                          {...field}
                          placeholder="Selecciona una opción"
                          fontSize={["xs", "md"]}
                          w={["100%", "220px"]}
                        >
                          {["MASCULINO", "FEMENINO", "OTRO"].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="identityType">
                    {({ field }) => (
                      <FormControl id="identityType" w={["100%", "220px"]} isRequired>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Tipo documento
                        </FormLabel>
                        <Select
                          {...field}
                          placeholder="Selecciona una opción"
                          fontSize={["xs", "md"]}
                          w={["100%", "220px"]}
                        >
                          {["DNI", "CC", "CI"].map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="identityId">
                    {({ field }) => (
                      <FormControl id="identityId" w={["100%", "220px"]} isRequired>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Numero documento
                        </FormLabel>
                        <Input
                          placeholder="000000"
                          fontSize={["xs", "md"]}
                          _placeholder={{ color: "gray.500" }}
                          w={["100%", "220px"]}
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="phone">
                    {({ field }) => (
                      <FormControl id="lastName" w={["100%", "220px"]} isRequired>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Telefono de contacto
                        </FormLabel>
                        <Input
                          placeholder="99999999"
                          fontSize={["xs", "md"]}
                          _placeholder={{ color: "gray.500" }}
                          w={["100%", "220px"]}
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email">
                    {({ field }) => (
                      <FormControl id="email" w={["100%", "220px"]}>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Correo electronico
                        </FormLabel>
                        <Input
                          _placeholder={{ color: "gray.500" }}
                          fontSize={["xs", "md"]}
                          w={["100%", "220px"]}
                          disabled
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>

                  <Field name="provincia">
                    {({ field }) => (
                      <FormControl id="provincia" w={["100%", "220px"]} isRequired>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Provincia
                        </FormLabel>
                        <Select
                          {...field}
                          placeholder="Seleccionar provincia"
                          fontSize={["xs", "md"]}
                          w={["100%", "220px"]}
                          onChange={(e) => {
                            setFieldValue('provincia', e.target.value);
                            setProvincia(e.target.value);
                          }}
                        >
                          {provincias.map((prov, index) => (
                            <option key={index} value={prov.nombre}>{prov.nombre}</option>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Field>

                  {provincia && (
                    <Field name="localidad">
                      {({ field }) => (
                        <FormControl id="localidad" w={["100%", "220px"]} isRequired>
                          <FormLabel
                            fontSize={["xs", "md"]}
                            color="#104DBA"
                            fontWeight={400}
                            lineHeight={["12.3px", "16.24px"]}
                            w={["100%", "220px"]}
                          >
                            Localidad
                          </FormLabel>
                          <Select
                            {...field}
                            placeholder="Seleccionar localidad"
                            fontSize={["xs", "md"]}
                            w={["100%", "220px"]}
                            onChange={(e) => setFieldValue('localidad', e.target.value)}
                          >
                            {localidades.map((loc, index) => (
                              <option key={index} value={loc.nombre}>{loc.nombre}</option>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                    </Field>
                  )}


                  <Field name="socialWork">
                    {({ field }) => (
                      <FormControl id="socialWork" w={["100%", "220px"]}>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Obra social
                        </FormLabel>
                        <Input
                          _placeholder={{ color: "gray.500" }}
                          fontSize={["xs", "md"]}
                          w={["100%", "220px"]}
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Field name="socialWorkId">
                    {({ field }) => (
                      <FormControl id="socialWorkId" w={["100%", "220px"]}>
                        <FormLabel
                          fontSize={["xs", "md"]}
                          color="#104DBA"
                          fontWeight={400}
                          lineHeight={["12.3px", "16.24px"]}
                          w={["100%", "220px"]}
                        >
                          Numero socio obra social
                        </FormLabel>
                        <Input
                          placeholder="99999999"
                          fontSize={["xs", "md"]}
                          _placeholder={{ color: "gray.500" }}
                          w={["100%", "220px"]}
                          {...field}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Flex>
                {(user?.role === "DOCTOR" || user?.role === "ADMIN") && (
                  <Fragment>
                    <Text
                      fontSize={["md", "xl"]}
                      fontWeight={700}
                      lineHeight={["16.41px", "23.44px"]}
                      color="#104DBA"
                      mt={4}
                    >
                      Datos profesionales
                    </Text>
                    <Flex
                      w="full"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                      gap={5}
                      py={4}
                    >
                      <Field name="enrollment">
                        {({ field }) => (
                          <FormControl id="enrollment" w={["100%", "240px"]} isRequired>
                            <FormLabel
                              fontSize={["xs", "md"]}
                              color="#104DBA"
                              fontWeight={400}
                              lineHeight={["12.3px", "16.24px"]}
                              w={["100%", "220px"]}
                            >
                              Matrícula
                            </FormLabel>
                            <Input
                              placeholder="99"
                              fontSize={["xs", "md"]}
                              _placeholder={{ color: "gray.500" }}
                              w={["100%", "240px"]}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="especialization">
                        {({ field }) => (
                          <FormControl id="especialization" w={["100%", "240px"]} isRequired>
                            <FormLabel fontSize={["xs", "md"]} color="#104DBA" fontWeight={400} lineHeight={["12.3px", "16.24px"]} w={["100%", "220px"]}>
                              Especialización
                            </FormLabel>
                            {loading ? (
                              <Spinner />
                            ) : (
                              <Select
                                placeholder="Seleccionar"
                                fontSize={["xs", "md"]}
                                w={["100%", "240px"]}
                                {...field}
                              >
                                {specializations.map((spec) => (
                                  <option key={spec._id} value={spec.name}>
                                    {spec.name}
                                  </option>
                                ))}
                              </Select>
                            )}
                          </FormControl>
                        )}
                      </Field>
                      <Field name="reservePrice">
                        {({ field }) => (
                          <FormControl id="reservePrice" w={["100%", "240px"]} isRequired>
                            <FormLabel
                              fontSize={["xs", "md"]}
                              color="#104DBA"
                              fontWeight={400}
                              lineHeight={["12.3px", "16.24px"]}
                              w={["100%", "220px"]}
                            >
                              Precio de consulta
                            </FormLabel>
                            <Input
                              placeholder="99"
                              fontSize={["xs", "md"]}
                              _placeholder={{ color: "gray.500" }}
                              w={["100%", "240px"]}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>
                      <Field name="reserveTime">
                        {({ field }) => (
                          <FormControl id="reserveTime" w={["100%", "240px"]} isRequired>
                            <FormLabel fontSize={["xs", "md"]} color="#104DBA" fontWeight={400} lineHeight={["12.3px", "16.24px"]} w={["100%", "220px"]}>
                              Tiempo de consulta
                            </FormLabel>
                            <Input
                              placeholder="99"
                              fontSize={["xs", "md"]}
                              _placeholder={{ color: "gray.500" }}
                              w={["100%", "240px"]}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>

                      <Field name="reserveTimeFrom">
                        {({ field }) => (
                          <FormControl id="reserveTimeFrom" w={["100%", "240px"]} isRequired>
                            <FormLabel fontSize={["xs", "md"]} color="#104DBA" fontWeight={400} lineHeight={["12.3px", "16.24px"]} w={["100%", "220px"]}>
                              Inicio horario de atención
                            </FormLabel>
                            <Input
                              type="number"
                              placeholder="10"
                              fontSize={["xs", "md"]}
                              _placeholder={{ color: "gray.500" }}
                              w={["100%", "240px"]}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>

                      <Field name="reserveTimeUntil">
                        {({ field }) => (
                          <FormControl id="reserveTimeUntil" w={["100%", "240px"]} isRequired>
                            <FormLabel fontSize={["xs", "md"]} color="#104DBA" fontWeight={400} lineHeight={["12.3px", "16.24px"]} w={["100%", "220px"]}>
                              Fin horario de atención
                            </FormLabel>
                            <Input
                              type="number"
                              placeholder="17"
                              fontSize={["xs", "md"]}
                              _placeholder={{ color: "gray.500" }}
                              w={["100%", "240px"]}
                              {...field}
                            />
                          </FormControl>
                        )}
                      </Field>

                      <Field name="reserveSaturday">
                        {({ field }) => (
                          <FormControl id="reserveSaturday" w={["100%", "220px"]}>
                            <FormLabel fontSize={["xs", "md"]} color="#104DBA" fontWeight={400} lineHeight={["12.3px", "16.24px"]} w={["100%", "220px"]}>
                              Bloquear Sábado
                            </FormLabel>
                            <Checkbox {...field} defaultChecked={field?.value}></Checkbox>
                          </FormControl>
                        )}
                      </Field>

                      <Field name="reserveSunday">
                        {({ field }) => (
                          <FormControl id="reserveSunday" w={["100%", "220px"]}>
                            <FormLabel fontSize={["xs", "md"]} color="#104DBA" fontWeight={400} lineHeight={["12.3px", "16.24px"]} w={["100%", "220px"]}>
                              Bloquear Domingo
                            </FormLabel>
                            <Checkbox {...field} defaultChecked={field?.value}></Checkbox>
                          </FormControl>
                        )}
                      </Field>

                      <Checkbox
                        isChecked={secondSlotEnabled}
                        onChange={(e) => setSecondSlotEnabled(e.target.checked)}
                        colorScheme="blue"
                        ml={[0, 4]}
                        color="#104DBA"
                        sx={{
                          fontSize: ['sm', 'md', 'lg'], // Forzar el tamaño del texto
                          '& .chakra-checkbox__label': {
                            fontSize: ['sm', 'md'], // Asegurar que el texto del label también cambie
                          }
                        }}
                      >
                        Habilitar segunda franja horaria
                      </Checkbox>

                      <Flex justifyContent="space-between" mb={4} visibility={['visible', secondSlotEnabled ? 'visible' : 'hidden']} display={[secondSlotEnabled ? 'block' : 'none', 'flex']}>
                        <Field name="reserveTimeFrom2">
                          {({ field }) => (
                            <FormControl id="reserveTimeFrom2" w={["100%", "240px"]} mr={[2, 10]}>
                              <FormLabel fontSize={["xs", "md"]} color="#104DBA" fontWeight={400} lineHeight={["12.3px", "16.24px"]} w={["100%", "240px"]}>
                                Inicio horario de atención (2°)
                              </FormLabel>
                              <Input
                                type="number"
                                fontSize={["xs", "md"]}
                                _placeholder={{ color: "gray.500" }}
                                w={["100%", "240px"]}
                                {...field}
                              />
                            </FormControl>
                          )}
                        </Field>

                        <Field name="reserveTimeUntil2">
                          {({ field }) => (
                            <FormControl id="reserveTimeUntil2" w={["100%", "240px"]} ml={[0, 3]} mt={[3, 0]}>
                              <FormLabel fontSize={["xs", "md"]} color="#104DBA" fontWeight={400} lineHeight={["12.3px", "16.24px"]} w={["100%", "240px"]}>
                                Fin horario de atención (2°)
                              </FormLabel>
                              <Input
                                type="number"
                                fontSize={["xs", "md"]}
                                _placeholder={{ color: "gray.500" }}
                                w={["100%", "240px"]}
                                {...field}
                              />
                            </FormControl>
                          )}
                        </Field>

                      </Flex>
                    </Flex>
                  </Fragment>
                )}
                <Box w="full" textAlign="center">
                  <Button
                    bg="#104DBA"
                    color="#FFFFFF"
                    w={["220px", "300px"]}
                    size="sm"
                    borderRadius="2xl"
                    fontWeight={500}
                    mx="auto"
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    ACTUALIZAR DATA
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
          {user?.role === "PACIENTE" && (
            <Text
              fontSize={["md", "xl"]}
              fontWeight={700}
              lineHeight={["16.41px", "23.44px"]}
              color="#104DBA"
              mt={4}
            >
              A cargo
            </Text>
          )}
          {user?.role === "PACIENTE" && (
            patients?.length > 0 ? (
              <Accordion allowToggle mt={2}>
                <AccordionItem
                  border="none"
                  boxShadow="0px 4px 4px 0px #00000040"
                  borderEndEndRadius="xl"
                  borderEndStartRadius="xl"
                >
                  <h2>
                    <AccordionButton
                      bg={patients?.length > 0 ? "#104DBA" : "#87A6DD"}
                      _hover={{ backgroundColor: "#104DBA" }}
                      borderRadius={["md", "xl"]}
                      h={["auto", "46px"]}
                      justifyContent="flex-end"
                    >
                      <AccordionIcon
                        color="white"
                        w={["30px", "40px"]}
                        h={["30px", "40px"]}
                      />
                    </AccordionButton>
                  </h2>

                  <AccordionPanel
                    fontSize={["sm", "lg"]}
                    fontWeight="400"
                    color="#000000"
                    textTransform="capitalize"
                    lineHeight={["15px", "24px"]}
                    overflowY="scroll"
                    maxH="150px"
                  >
                    {patients?.length > 0 &&
                      patients.map((patient, idx) => (
                        <Text
                          key={idx}
                          onClick={() => handleSelectPatient(patient)}
                          _hover={{ textDecoration: "#104DBA", color: "#104DBA" }}
                          cursor="pointer"
                          my={1}
                        >
                          {patient?.firstName || patient?.lastName ? `${patient?.firstName} ${patient?.lastName}` : patient?.name}
                        </Text>
                      ))}
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>

            ) : (
              <Text mt={2} fontSize="lg">No tienes usuarios a cargo.</Text>
            )
          )}
          {(user?.role === "DOCTOR" || user?.role === "ADMIN") && (
            <Text
              fontSize={["md", "xl"]}
              fontWeight={700}
              lineHeight={["16.41px", "23.44px"]}
              color="#104DBA"
              mt={4}
            >
              Pago
            </Text>
          )}
          {(user?.role === "DOCTOR" || user?.role === "ADMIN") && user?.mercadopago_access?.access_token && (
            <Flex gap={2} alignItems="center" mt={4}>
              <FaCircleCheck color="#104DBA" />
              <Text>Tu cuenta de MercadoPago ya está vinculada.</Text>
            </Flex>
          )}
          {(user?.role === "DOCTOR" || user?.role === "ADMIN") && !user?.mercadopago_access?.access_token && (
            <Button
              bg="#104DBA"
              leftIcon={<SiMercadopago style={{ fontSize: "24px" }} />}
              onClick={handleLoginMp}
              color="#FFFFFF"
              w="fit-content"
              size="sm"
              borderRadius="2xl"
              mt={4}
              fontWeight={500}
            >
              VINCULAR CUENTA MERCADOPAGO
            </Button>
          )}
        </Box>
        <AlertModal
          onClose={() => onCloseFirst()}
          isOpen={isOpenFirst}
          alertHeader="Nuevo paciente"
          alertBody={
            <FormPatient
              handleSubmit={(values) => createPatient(values, onCloseFirst)}
            />
          }
          isLoading={false}
        />
        <AlertModal
          onClose={() => onCloseSecond()}
          isOpen={isOpenSecond}
          alertHeader="Editar paciente"
          alertBody={
            <FormPatient
              initialValues={patientSelected}
              handleSubmit={(values) => updatePatient(values, onCloseSecond)}
            />
          }
          isLoading={false}
        />
      </Box>
    </Flex>
  );
}