import { FormControl, FormErrorMessage, FormLabel, Input, Button, Select, Grid, useToast } from "@chakra-ui/react"
import { Formik, Form, Field } from 'formik';

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
        errors.name = "Por favor, coloque su nombre completo";
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
            birthdate: '',
            picture: '',
            genre: '',
            phone: '',
            email: '',
            history: '',
            dni: ''
         }}
          onSubmit={handleSubmit}
          validate={validate}
        >
          {(props) => (
            <Form>
              <Grid templateColumns='repeat(2, 1fr)' gap={4} my={2}>
                <Field name='name' colSpan={1}>
                  {({ field, form }) => (
                      <FormControl isInvalid={form.errors.name && form.touched.name}>
                          <FormLabel fontSize="sm">Nombre Completo</FormLabel>
                          <Input {...field} placeholder='John Doe' fontSize="sm" size="sm"/>
                          <FormErrorMessage fontSize="xs">{form.errors.name}</FormErrorMessage>
                      </FormControl>
                  )}
                </Field>
                <Field name='birthdate' colSpan={1}>
                  {({ field, form }) => (
                      <FormControl isInvalid={form.errors.birthdate && form.touched.birthdate}>
                          <FormLabel fontSize="sm">Fecha de nacimiento</FormLabel>
                          <Input {...field} placeholder='Fecha de nacimiento' type='date' fontSize="sm" size="sm"/>
                          <FormErrorMessage fontSize="xs">{form.errors.birthdate}</FormErrorMessage>
                      </FormControl>
                  )}
                </Field>
              </Grid>
              <Grid templateColumns='repeat(2, 1fr)' gap={4} my={2}>
                <Field name='genre'>
                  {({ field, form }) => (
                      <FormControl isInvalid={form.errors.genre && form.touched.genre}>
                          <FormLabel fontSize="sm">Genero</FormLabel>
                          <Select
                              {...field}
                              placeholder="Selecciona una opción"
                              fontSize="sm"
                              size="sm"
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
                <Field name='dni' colSpan={1}>
                  {({ field, form }) => (
                      <FormControl isInvalid={form.errors.dni && form.touched.dni}>
                          <FormLabel fontSize="sm">DNI</FormLabel>
                          <Input {...field} placeholder='99999999' fontSize="sm" size="sm"/>
                          <FormErrorMessage fontSize="xs">{form.errors.dni}</FormErrorMessage>
                      </FormControl>
                  )}
                </Field>
              </Grid>
              <Grid templateColumns='repeat(2, 1fr)' gap={4} my={2}>
                <Field name='phone' colSpan={1}>
                  {({ field, form }) => (
                      <FormControl isInvalid={form.errors.phone && form.touched.phone}>
                          <FormLabel fontSize="sm">Telefono</FormLabel>
                          <Input {...field} placeholder='1122334455' fontSize="sm" size="sm"/>
                          <FormErrorMessage fontSize="xs">{form.errors.phone}</FormErrorMessage>
                      </FormControl>
                  )}
                </Field>
                <Field name='email' colSpan={1}>
                  {({ field, form }) => (
                      <FormControl isInvalid={form.errors.email && form.touched.email}>
                          <FormLabel fontSize="sm">Email</FormLabel>
                          <Input {...field} placeholder='johndoe@gmail.com' fontSize="sm" size="sm"/>
                          <FormErrorMessage fontSize="xs">{form.errors.email}</FormErrorMessage>
                      </FormControl>
                  )}
                </Field>
              </Grid>
              <Button
                mt={4}
                colorScheme='teal'
                isLoading={props.isSubmitting}
                type='submit'
              >
                Crear
              </Button>
            </Form>
          )}
        </Formik>
    )
}

export default FormPatient