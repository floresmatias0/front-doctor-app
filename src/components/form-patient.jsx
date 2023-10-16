import PropTypes from 'prop-types'
import { FormControl, FormErrorMessage, FormLabel, Input, Button, Select, Grid, Textarea, Box } from "@chakra-ui/react"
import { Formik, Form, Field } from 'formik';
import '../styles/form-patient.css'

const FormPatient = ({handleSubmit}) => {

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
  
      return errors;
    };

    return (
        <Formik
          initialValues={{ 
            name: '',
            lastName: '',
            birthdate: '',
            picture: '',
            genre: '',
            phone: '',
            email: '',
            history: '',
            dni: '',
            socialWork: '',
            proceedings: ''
         }}
          onSubmit={handleSubmit}
          validate={validate}
        >
          {() => (
            <Form>
              <Box maxH={["400px", "700px"]} overflowY="auto">
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
                            <Input {...field} placeholder='99999999' fontSize="sm" size={["sm", "md"]} rounded="md"/>
                            <FormErrorMessage fontSize="xs">{form.errors.dni}</FormErrorMessage>
                        </FormControl>
                    )}
                  </Field>
                  <Field name='phone' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.phone && form.touched.phone}>
                            <FormLabel fontSize="sm" fontWeight="normal">Teléfono de contacto</FormLabel>
                            <Input {...field} placeholder='1122334455' fontSize="sm" size={["sm", "md"]} rounded="md"/>
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
                  <Field name='socialWork' colSpan={1}>
                    {({ field, form }) => (
                        <FormControl isInvalid={form.errors.socialWork && form.touched.socialWork}>
                            <FormLabel fontSize="sm" fontWeight="normal">Obra social</FormLabel>
                            <Input {...field} placeholder='OSECAC' fontSize="sm" size={["sm", "md"]} rounded="md"/>
                            <FormErrorMessage fontSize="xs">{form.errors.socialWork}</FormErrorMessage>
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
  handleSubmit: PropTypes.func
}

export default FormPatient