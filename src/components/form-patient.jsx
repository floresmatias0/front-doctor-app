import PropTypes from "prop-types";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Button,
  Select,
  Grid,
  Textarea,
  Box,
  Spinner,
  Flex,
  Text,
  Link,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { FaTrash, FaUpload } from "react-icons/fa";
import { useEffect, useState } from "react";
import { instance, instanceUpload } from "../utils/axios";

const FormPatient = ({ handleSubmit, initialValues }) => {
  const [loading, setLoading] = useState(false);
  const [uploads, setUploads] = useState([]);

  const optionsGenres = [
    { value: "MASCULINO", label: "Masculino" },
    { value: "FEMENINO", label: "Femenino" },
    { value: "OTRO", label: "Otro" },
  ];

  const validate = (values) => {
    const errors = {};

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!values.firstName) {
      errors.firstName = "Por favor, coloque su nombre";
    }

    if (!values.lastName) {
      errors.lastName = "Por favor, coloque su apellido";
    }

    if (!emailRegex.test(values.email)) {
      errors.email = "Por favor, ingresa un email válido";
    }

    if (isNaN(values.phone) || values.phone < 0) {
      errors.phone = "número inválido";
    }
    if (!values.genre) {
      errors.genre = "Por favor, elija una opcion";
    }
    if (!values.dateOfBirth) {
      errors.birthdate = "Por favor, coloque su fecha de nacimiento";
    }

    if (!values.identityId) {
      errors.identityId = "Por favor, coloque su numero de documento";
    }

    if (!values.socialWorkId) {
      errors.socialWorkId = "Por favor, es necesario completar este dato";
    }

    return errors;
  };

  const onChangeImages = async (e) => {
    try {
      const formData = new FormData();
      const images = e.target.files;
      const files = Array.from(images);
  
      await Promise.all(
        files.map(async (file) => {
          return new Promise((resolve) => {
            formData.append("files", file);
            resolve();
          });
        })
      );
  
      setLoading(true);
      const response = await instanceUpload.post("/uploads", formData);
      const { data } = response;

      setUploads([...uploads, ...data?.data]);
      setLoading(false);
    }catch(err) {
      throw new Error(err?.message)
    }
  }

  const onDeleteImage = async (file) => {
    try {
      const filtered = uploads.filter(x => x.fileName !== file?.fileName);
      setUploads(filtered);
      await instance.post("/certificates/file/delete", { file });
    }catch(err) {
      throw new Error(err?.message)
    }
  }

  useEffect(() => {
    if(initialValues) {
      if(initialValues?.documents?.length > 0) {
        setUploads(initialValues?.documents)
      }
    }
  }, [initialValues])

  return (
    <Formik
      initialValues={{
        _id: initialValues?._id || "",
        lastName: initialValues?.lastName || "",
        firstName: initialValues?.firstName || "",
        dateOfBirth: initialValues?.dateOfBirth
          ? new Date(initialValues.dateOfBirth).toISOString().split("T")[0]
          : "",
        picture: initialValues?.picture || "",
        genre: initialValues?.genre || "",
        phone: initialValues?.phone || "",
        email: initialValues?.email || "",
        history: initialValues?.history || "",
        identityType: initialValues?.identityType || "",
        identityId: initialValues?.identityId || "",
        socialWork: initialValues?.socialWork || "",
        socialWorkId: initialValues?.socialWorkId || "",
        proceedings: initialValues?.proceedings || "",
        documents: initialValues?.documents || ""
      }}
      onSubmit={(values) => {
        handleSubmit({...values, documents: uploads})
      }}
      validate={validate}
    >
      {({values}) => (
        <Form>
          <Box maxH={["400px", "700px"]} overflowY="auto" px={2}>
            <Grid
              templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
              gap={4}
              my={2}
            >
              <Field name="firstName" colSpan={1}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.firstName && form.touched.firstName}
                  >
                    <FormLabel
                      fontSize={["xs", "sm"]}
                      fontWeight="normal"
                      color="#104DBA"
                    >
                      Nombre
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder="Ingresar dato"
                      fontSize="sm"
                      size={["sm", "md"]}
                      rounded="md"
                    />
                    <FormErrorMessage fontSize="xs">
                      {form.errors.firstName}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="lastName" colSpan={1}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.lastName && form.touched.lastName}
                  >
                    <FormLabel
                      fontSize={["xs", "sm"]}
                      fontWeight="normal"
                      color="#104DBA"
                    >
                      Apellido
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder="Ingresar dato"
                      fontSize="sm"
                      size={["sm", "md"]}
                      rounded="md"
                    />
                    <FormErrorMessage fontSize="xs">
                      {form.errors.lastName}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Grid>
            <Grid
              templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)"]}
              gap={4}
              my={2}
            >
              <Field name="dateOfBirth" colSpan={1}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.dateOfBirth && form.touched.dateOfBirth
                    }
                  >
                    <FormLabel
                      fontSize={["xs", "sm"]}
                      fontWeight="normal"
                      color="#104DBA"
                    >
                      Fecha de nacimiento
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder="Fecha de nacimiento"
                      type="date"
                      fontSize="sm"
                      size={["sm", "md"]}
                      rounded="md"
                    />
                    <FormErrorMessage fontSize="xs">
                      {form.errors.dateOfBirth}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="genre">
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.genre && form.touched.genre}
                  >
                    <FormLabel
                      fontSize={["xs", "sm"]}
                      fontWeight="normal"
                      color="#104DBA"
                    >
                      Genero
                    </FormLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione un genero"
                      fontSize="sm"
                      size={["sm", "md"]}
                      rounded="md"
                    >
                      {optionsGenres.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>

                    <FormErrorMessage fontSize="xs">
                      {form.errors.genre}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Grid>
            <Grid
              templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)"]}
              gap={4}
              my={2}
            >
              <Field name="identityType" colSpan={1}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.identityType && form.touched.identityType
                    }
                  >
                    <FormLabel
                      fontSize={["xs", "sm"]}
                      fontWeight="normal"
                      color="#104DBA"
                    >
                      Tipo de documento
                    </FormLabel>
                    <Select
                      {...field}
                      placeholder="Seleccione un tipo"
                      fontSize="sm"
                      size={["sm", "md"]}
                      rounded="md"
                    >
                      {["DNI", "CC", "CI"].map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                    <FormErrorMessage fontSize="xs">
                      {form.errors.identityType}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="identityId" colSpan={1}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.identityId && form.touched.identityId
                    }
                  >
                    <FormLabel
                      fontSize={["xs", "sm"]}
                      fontWeight="normal"
                      color="#104DBA"
                    >
                      Numero de documento
                    </FormLabel>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Ingresar dato"
                      fontSize="sm"
                      size={["sm", "md"]}
                      rounded="md"
                      maxLength={12}
                    />
                    <FormErrorMessage fontSize="xs">
                      {form.errors.identityId}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
              <Field name="phone" colSpan={1}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={form.errors.phone && form.touched.phone}
                  >
                    <FormLabel
                      fontSize={["xs", "sm"]}
                      fontWeight="normal"
                      color="#104DBA"
                    >
                      Teléfono de contacto
                    </FormLabel>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Ingresar dato"
                      fontSize="sm"
                      size={["sm", "md"]}
                      rounded="md"
                      maxLength={12}
                    />
                    <FormErrorMessage fontSize="xs">
                      {form.errors.phone}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Grid>
            <Field name="email" colSpan={1}>
              {({ field, form }) => (
                <FormControl
                  isInvalid={form.errors.email && form.touched.email}
                >
                  <FormLabel
                    fontSize={["xs", "sm"]}
                    fontWeight="normal"
                    color="#104DBA"
                  >
                    Correo electrónico
                  </FormLabel>
                  <Input
                    {...field}
                    placeholder="Ingresar dato"
                    fontSize="sm"
                    size={["sm", "md"]}
                    rounded="md"
                  />
                  <FormErrorMessage fontSize="xs">
                    {form.errors.email}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Grid
              templateColumns={["repeat(2, 1fr)", "repeat(2, 1fr)"]}
              gap={4}
              my={2}
            >
              <Field name="socialWork" colSpan={1}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.socialWork && form.touched.socialWork
                    }
                  >
                    <FormLabel
                      fontSize={["xs", "sm"]}
                      fontWeight="normal"
                      color="#104DBA"
                    >
                      Obra social
                    </FormLabel>
                    <Input
                      {...field}
                      placeholder="Ingresar dato"
                      fontSize="sm"
                      size={["sm", "md"]}
                      rounded="md"
                    />
                    <FormErrorMessage fontSize="xs">
                      {form.errors.socialWork}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Grid>
            <Field name="socialWorkId" colSpan={1}>
              {({ field, form }) => (
                <FormControl
                  isInvalid={
                    form.errors.socialWorkId && form.touched.socialWorkId
                  }
                >
                  <FormLabel
                    fontSize={["xs", "sm"]}
                    fontWeight="normal"
                    color="#104DBA"
                  >
                    Número socio obra social
                  </FormLabel>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Ingresar dato"
                    fontSize="sm"
                    size={["sm", "md"]}
                    rounded="md"
                    maxLength={20}
                  />
                  <FormErrorMessage fontSize="xs">
                    {form.errors.socialWorkId}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Grid>
              <Field name="documents" colSpan={1}>
                {({ field, form }) => (
                  <FormControl>
                    <FormLabel
                      fontSize={["xs", "sm"]}
                      fontWeight="normal"
                      color="#104DBA"
                      mt={2}
                    >
                      Estudios/Documentos
                    </FormLabel>
                    {loading && (
                      <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="sm"
                      />
                    )}
                    <Flex gap={1} flexDirection="column">
                      {uploads?.length > 0 && uploads?.map((x, idx) => (
                        <Flex key={idx} gap={2} alignItems='center'>
                          <Link href={x.downloadURL} target="_blank" fontSize="sm">{x.fileName}</Link>
                          <FaTrash size={12} onClick={() => onDeleteImage(x)}/>
                        </Flex>
                      ))}
                    </Flex>
                    <Button
                      variant="unstyled"
                      size="xs"
                      bgColor="#104DBA"
                      color="#FFF"
                      px={2}
                      fontWeight={300}
                      rightIcon={<FaUpload/>}
                      mt={2}
                    >
                      <Input
                        type="file"
                        placeholder="Cargar documentos importantes"
                        size="sm"
                        multiple
                        onChange={onChangeImages}
                        style={{ opacity: 0 }}
                        position="absolute"
                        top="0"
                        left="0"
                        w="full"
                      />
                      Subir documentos
                    </Button>
                    <FormErrorMessage fontSize="xs">
                      {form.errors.socialWorkId}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Grid>
            <Field name="proceedings" colSpan={2}>
              {({ field, form }) => (
                <FormControl
                  isInvalid={
                    form.errors.proceedings && form.touched.proceedings
                  }
                >
                  <FormLabel
                    fontSize={["xs", "sm"]}
                    fontWeight="normal"
                    color="#104DBA"
                    pt={2}
                  >
                    Antecedentes
                  </FormLabel>
                  <Textarea
                    {...field}
                    placeholder="Ingresar dato"
                    fontSize="sm"
                    size={["sm", "md"]}
                    rounded="md"
                  />
                  <FormErrorMessage fontSize="xs">
                    {form.errors.proceedings}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>
            <Button
              mt={4}
              bg="#104DBA"
              color="#FFFFFF"
              w="120px"
              size={["xs", "sm"]}
              type="submit"
              float="right"
            >
              GUARDAR
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

FormPatient.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    lastName: PropTypes.string,
    birthdate: PropTypes.string,
    picture: PropTypes.string,
    genre: PropTypes.string,
    phone: PropTypes.number,
    email: PropTypes.string,
    history: PropTypes.string,
    dni: PropTypes.number,
    socialWork: PropTypes.string,
    socialWorkId: PropTypes.number,
    proceedings: PropTypes.string,
  }),
};

export default FormPatient;
