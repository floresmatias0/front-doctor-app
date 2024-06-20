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

const initialState = {
  name: false,
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
      const updatedUser = await instance.put(`/users/${user?._id}`, {
        name: values.name,
        email: values.email,
        reservePrice: values.reservePrice,
        reserveTime: values.reserveTime,
        especialization: values.especialization,
      });
      setUser(updatedUser.data.data);
      setIsEditable(initialState);
      toast({
        title: "Datos actualizados",
        description: "Actualizacion de datos satisfactoria",
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: "success",
      });
    } catch (err) {
      toast({
        title: "Datos no actualizados",
        description: err.message,
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: "error",
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
      birthdate: formattedDate,
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
      `${import.meta.env.VITE_MERCADOPAGO_OAUTH_URL}?client_id=${
        import.meta.env.VITE_MERCADOPAGO_CLIENT_ID
      }&response_type=code&platform_id=mp&state=${randomId}&redirect_uri=${
        import.meta.env.VITE_MERCADOPAGO_REDIRECT_URL
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

  return (
    <Flex
      w={["calc(100% - 60px)", "calc(100% - 155px)"]}
      h={["calc(100% - 40px)", "calc(100% - 80px)"]}
      px={[0, 2]}
      flexDirection="column"
      justifyContent="flex-start"
      overflowY="scroll"
    >
      <Flex
        flexDirection={["column", "row"]}
        justifyContent="space-between"
        alignItems="center"
      >
        <Heading
          fontSize="25px"
          fontWeight={700}
          lineHeight="29.3px"
          color="#104DBA"
        >
          Ajustes
        </Heading>
        {user?.role === "PATIENT" && (
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
            firstName: user?.name,
            lastName: user?.name,
            email: user?.email,
            dateOfBirth: "",
            typeIdentity: "",
            numIdentity: "",
            genre: "",
            telephone: "",
            reservePrice: user?.reservePrice,
            reserveTime: user?.reserveTime,
            especialization: user?.especialization,
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form style={{ gap: 10, display: "flex", flexDirection: "column" }} >
              <Text
                fontSize="xl"
                fontWeight={700}
                lineHeight="23.44px"
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
                    <FormControl id="firstName" w={["100%", "220px"]}>
                      <FormLabel
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Nombre
                      </FormLabel>
                      <Input
                        placeholder="John"
                        _placeholder={{ color: "gray.500" }}
                        w={["100%", "220px"]}
                        {...field}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="lastName">
                  {({ field }) => (
                    <FormControl id="lastName" w={["100%", "220px"]}>
                      <FormLabel
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Apellido
                      </FormLabel>
                      <Input
                        placeholder="Doe"
                        _placeholder={{ color: "gray.500" }}
                        w={["100%", "220px"]}
                        {...field}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="dateOfBirth">
                  {({ field }) => (
                    <FormControl id="dateOfBirth" w={["100%", "220px"]}>
                      <FormLabel
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Fecha de nacimiento
                      </FormLabel>
                      <Input
                        _placeholder={{ color: "gray.500" }}
                        type="date"
                        w={["100%", "220px"]}
                        {...field}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="genre">
                  {({ field }) => (
                    <FormControl id="genre" w={["100%", "220px"]}>
                      <FormLabel
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Género
                      </FormLabel>
                      <Select
                        {...field}
                        placeholder="Selecciona una opción"
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
                <Field name="typeIdentity">
                  {({ field }) => (
                    <FormControl id="typeIdentity" w={["100%", "220px"]}>
                      <FormLabel
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Tipo documento
                      </FormLabel>
                      <Select
                        {...field}
                        placeholder="Selecciona una opción"
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
                <Field name="numIdentity">
                  {({ field }) => (
                    <FormControl id="numIdentity" w={["100%", "220px"]}>
                      <FormLabel
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Numero documento
                      </FormLabel>
                      <Input
                        placeholder="000000"
                        _placeholder={{ color: "gray.500" }}
                        w={["100%", "220px"]}
                        {...field}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="telephone">
                  {({ field }) => (
                    <FormControl id="lastName" w={["100%", "220px"]}>
                      <FormLabel
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Telefono de contacto
                      </FormLabel>
                      <Input
                        placeholder="99999999"
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
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Correo electronico
                      </FormLabel>
                      <Input
                        _placeholder={{ color: "gray.500" }}
                        w={["100%", "220px"]}
                        {...field}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="socialWork">
                  {({ field }) => (
                    <FormControl id="genre" w={["100%", "220px"]}>
                      <FormLabel
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Obra social
                      </FormLabel>
                      <Input
                        _placeholder={{ color: "gray.500" }}
                        w={["100%", "220px"]}
                        {...field}
                      />
                    </FormControl>
                  )}
                </Field>
                <Field name="numSocialWork">
                  {({ field }) => (
                    <FormControl id="numSocialWork" w={["100%", "220px"]}>
                      <FormLabel
                        fontSize="md"
                        color="#104DBA"
                        fontWeight={400}
                        lineHeight="16.24px"
                        w={["100%", "220px"]}
                      >
                        Numero socio obra social
                      </FormLabel>
                      <Input
                        placeholder="99999999"
                        _placeholder={{ color: "gray.500" }}
                        w={["100%", "220px"]}
                        {...field}
                      />
                    </FormControl>
                  )}
                </Field>
              </Flex>
              {user?.role === "DOCTOR" && (
                <Fragment>
                  <Text
                    fontSize="xl"
                    fontWeight={700}
                    lineHeight="23.44px"
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
                    <Field name="reservePrice">
                      {({ field }) => (
                        <FormControl id="reservePrice" w={["100%", "220px"]}>
                          <FormLabel
                            fontSize="md"
                            color="#104DBA"
                            fontWeight={400}
                            lineHeight="16.24px"
                            w={["100%", "220px"]}
                          >
                            Precio de consulta
                          </FormLabel>
                          <Input
                            placeholder="99"
                            _placeholder={{ color: "gray.500" }}
                            w={["100%", "220px"]}
                            {...field}
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name="reserveTime">
                      {({ field }) => (
                        <FormControl id="reserveTime" w={["100%", "220px"]}>
                          <FormLabel
                            fontSize="md"
                            color="#104DBA"
                            fontWeight={400}
                            lineHeight="16.24px"
                            w={["100%", "220px"]}
                          >
                            Tiempo de consulta
                          </FormLabel>
                          <Input
                            placeholder="99"
                            _placeholder={{ color: "gray.500" }}
                            w={["100%", "220px"]}
                            {...field}
                          />
                        </FormControl>
                      )}
                    </Field>
                    <Field name="especialization">
                      {({ field }) => (
                        <FormControl id="especialization" w={["100%", "220px"]}>
                          <FormLabel
                            fontSize="md"
                            color="#104DBA"
                            fontWeight={400}
                            lineHeight="16.24px"
                            w={["100%", "220px"]}
                          >
                            Especialización
                          </FormLabel>
                          <Input
                            placeholder="99"
                            _placeholder={{ color: "gray.500" }}
                            w={["100%", "220px"]}
                            {...field}
                          />
                        </FormControl>
                      )}
                    </Field>
                  </Flex>
                </Fragment>
              )}
              {Object.values(isEditable).includes(true) && (
                <Box w="full" textAlign="center">
                  <Button
                    bg="#205583"
                    color="#FFFFFF"
                    w={["220px", "300px"]}
                    size={["xs", "sm"]}
                    mx="auto"
                    isLoading={isSubmitting}
                    type="submit"
                  >
                    Actualizar
                  </Button>
                </Box>
              )}
            </Form>
          )}
        </Formik>
        {user?.role === "PATIENT" && (
          <Text
            fontSize="xl"
            fontWeight={700}
            lineHeight="23.44px"
            color="#104DBA"
            mt={4}
          >
            A cargo
          </Text>
        )}
        {user?.role === "PATIENT" && (
          <Accordion allowToggle={patients?.length > 0 ? true : false} mt={2}>
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
                      {patient?.name} {patient?.lastName}
                    </Text>
                  ))}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        )}
        {user?.role === "DOCTOR" && (
          <Text
            fontSize="xl"
            fontWeight={700}
            lineHeight="23.44px"
            color="#104DBA"
            mt={4}
          >
            Pago
          </Text>
        )}
        {user?.role === "DOCTOR" && user?.mercadopago_access?.access_token && (
          <Flex gap={2} alignItems="center" mt={4}>
            <FaCircleCheck color="#104DBA" />
            <Text>Tu cuenta de MercadoPago ya está vinculada.</Text>
          </Flex>
        )}
        {user?.role === "DOCTOR" && !user?.mercadopago_access?.access_token && (
          <Button
            bg="#104DBA"
            leftIcon={<SiMercadopago style={{ fontSize: "24px" }} />}
            onClick={handleLoginMp}
            color="#FFFFFF"
            w={["220px", "300px"]}
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
    </Flex>
  );
}
