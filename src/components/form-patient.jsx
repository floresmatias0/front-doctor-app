import PropTypes from 'prop-types'
import { FormControl, FormErrorMessage, FormLabel, Input, Button, Select, Grid, Textarea, Box } from "@chakra-ui/react"
import { Formik, Form, Field } from 'formik';
import '../styles/form-patient.css'

const FormPatient = ({handleSubmit, initialValues}) => {

    const optionsGenres = [
        { value: 'male', label: 'Masculino' },
        { value: 'female', label: 'Femenino' },
        { value: 'other', label: 'Otro' },
    ];

    const validate = (values) => {
      const errors = {};
  
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
      if (!values.name) {
        errors.name = "Por favor, coloque su nombre";
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
      if (!values.birthdate) {
        errors.birthdate = "Por favor, coloque su fecha de nacimiento";
      }

      if (!values.dni) {
        errors.dni = "Por favor, coloque su DNI";
      }

      if (!values.socialWorkId) {
        errors.socialWorkId = "Por favor, es necesario completar este dato";
      }
  
      return errors;
    };

    return (
        <Formik
          initialValues={{ 
            _id: initialValues?._id || '',
            name: initialValues?.name || '',
            lastName: initialValues?.lastName || '',
            birthdate: initialValues?.birthdate || '',
            picture: initialValues?.picture || '',
            genre: initialValues?.genre || '',
            phone: initialValues?.phone || '',
            email: initialValues?.email || '',
            history: initialValues?.history || '',
            dni: initialValues?.dni || '',
            socialWork: initialValues?.socialWork || '',
            socialWorkId: initialValues?.socialWorkId || '',
            proceedings: initialValues?.proceedings || ''
         }}
          onSubmit={handleSubmit}
          validate={validate}
        >
          {() => (
            <Form>
              <Box maxH={["400px", "700px"]} overflowY="auto" px={2}>
                <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={4} my={2}>
                  <Field name='name' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.name && form.touched.name}>
                            <FormLabel fontSize="sm" fontWeight="normal">Nombre</FormLabel>
                            <Input {...field} placeholder='John' fontSize="sm" size={["sm", "md"]} rounded="md"/>
                            <FormErrorMessage fontSize="xs">{form.errors.name}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                  <Field name='lastName' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.lastName && form.touched.lastName}>
                            <FormLabel fontSize="sm" fontWeight="normal">Apellido</FormLabel>
                            <Input {...field} placeholder='Doe' fontSize="sm" size={["sm", "md"]} rounded="md"/>
                            <FormErrorMessage fontSize="xs">{form.errors.lastName}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                  <Field name='birthdate' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.birthdate && form.touched.birthdate}>
                            <FormLabel fontSize="sm" fontWeight="normal">Fecha de nacimiento</FormLabel>
                            <Input {...field} placeholder='Fecha de nacimiento' type='date' fontSize="sm" size={["sm", "md"]} rounded="md"/>
                            <FormErrorMessage fontSize="xs">{form.errors.birthdate}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                  <Field name='genre'>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.genre && form.touched.genre}>
                            <FormLabel fontSize="sm" fontWeight="normal">Genero</FormLabel>
                            <Select
                                {...field}
                                placeholder="Selecciona una opción"
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

                            <FormErrorMessage fontSize="xs">{form.errors.genre}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                </Grid>
                <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={4} my={2}>
                  <Field name='dni' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.dni && form.touched.dni}>
                            <FormLabel fontSize="sm" fontWeight="normal">DNI</FormLabel>
                            <Input {...field} type="number" placeholder='99999999' fontSize="sm" size={["sm", "md"]} rounded="md" maxLength={12}/>
                            <FormErrorMessage fontSize="xs">{form.errors.dni}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                  <Field name='phone' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.phone && form.touched.phone}>
                            <FormLabel fontSize="sm" fontWeight="normal">Teléfono de contacto</FormLabel>
                            <Input {...field} type="number" placeholder='01122334455' fontSize="sm" size={["sm", "md"]} rounded="md" maxLength={12}/>
                            <FormErrorMessage fontSize="xs">{form.errors.phone}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                  <Field name='email' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.email && form.touched.email}>
                            <FormLabel fontSize="sm" fontWeight="normal">Correo electrónico</FormLabel>
                            <Input {...field} placeholder='johndoe@gmail.com' fontSize="sm" size={["sm", "md"]} rounded="md"/>
                            <FormErrorMessage fontSize="xs">{form.errors.email}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                </Grid>
                <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={4} my={2}>
                  <Field name='socialWork' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.socialWork && form.touched.socialWork}>
                            <FormLabel fontSize="sm" fontWeight="normal">Obra social</FormLabel>
                            <Input {...field} placeholder='OSECAC' fontSize="sm" size={["sm", "md"]} rounded="md"/>
                            <FormErrorMessage fontSize="xs">{form.errors.socialWork}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                  <Field name='socialWorkId' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.socialWorkId && form.touched.socialWorkId}>
                            <FormLabel fontSize="sm" fontWeight="normal">N.º Obra social</FormLabel>
                            <Input {...field} type="number" placeholder='000000' fontSize="sm" size={["sm", "md"]} rounded="md" maxLength={20}/>
                            <FormErrorMessage fontSize="xs">{form.errors.socialWorkId}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                </Grid>
                <Field name='proceedings' colSpan={2}>
                  {({ field, form }) => (
                      <FormControl isInvalid={form.errors.proceedings && form.touched.proceedings}>
                          <FormLabel fontSize="sm" fontWeight="normal">Antecedentes</FormLabel>
                          <Textarea {...field}  placeholder='Gripe...' fontSize="sm" size={["sm", "md"]} rounded="md"/>
                          <FormErrorMessage fontSize="xs">{form.errors.proceedings}</FormErrorMessage>
                      </FormControl>
                  )}
                </Field>
                <Button
                  mt={4}
                  bg="#205583" color="#FFFFFF" w="120px" size={["xs", "sm"]}
                  type='submit'
                >
                  GUARDAR
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
    )
}

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
    proceedings: PropTypes.string
  })
}

export default FormPatient