import { Box, Button, Flex, FormControl, Input, Text, useDisclosure, useToast, SimpleGrid, Link } from "@chakra-ui/react"
import { AppContext } from "../components/context"
import { useCallback, useContext, useEffect, useState } from "react"
import { Field, Form, Formik } from "formik"
import { FaPencilAlt } from "react-icons/fa"
import { AiOutlineCloseCircle, AiOutlinePlus } from "react-icons/ai"
import { instance } from "../utils/axios"
import CardCustom from "../components/card-custom"
import { AlertModal } from "../components/alerts"
import { useSearchParams } from "react-router-dom"
import FormPatient from "../components/form-patient"
import { SiMercadopago } from "react-icons/si"
import { useNavigate } from "react-router-dom";

const initialState = {
    name: false,
    email: false,
    reservePrice: false,
    reserveTime: false,
    especialization: false
}

export default function Settings() {
    const navigate = useNavigate()
    const toast = useToast()
    const [searchParams] = useSearchParams();
  
    const currentParams = Object.fromEntries([...searchParams]);
    const { code } = currentParams;
    const { user, setUser, patients, createPatient, updatePatient } = useContext(AppContext)
    const [isEditable, setIsEditable] = useState(initialState)
    const [patientSelected, setPatientSelected] = useState(null)

    // Estado para el primer AlertModal
    const { isOpen: isOpenFirst, onOpen: onOpenFirst, onClose: onCloseFirst } = useDisclosure()
    
    // Estado para el segundo AlertModal
    const { isOpen: isOpenSecond, onOpen: onOpenSecond, onClose: onCloseSecond } = useDisclosure()

    const handleSubmit = async (values) => {
        try {
          const updatedUser = await instance.put(`/users/${user?._id}`, {
            name: values.name,
            email: values.email,
            reservePrice: values.reservePrice,
            reserveTime: values.reserveTime,
            especialization: values.especialization
          })
          setUser(updatedUser.data.data)
          setIsEditable(initialState)
          toast({
            title: "Datos actualizados",
            description: "Actualizacion de datos satisfactoria",
            position: "top-right",
            isClosable: true,
            duration: 6000,
            status: "success"
          });
        }catch(err) {
            toast({
                title: "Datos no actualizados",
                description: err.message,
                position: "top-right",
                isClosable: true,
                duration: 6000,
                status: "error"
            });
            throw new Error(err.message)
        }
    }

    const handleSelectPatient = (patient) => {
        let formattedDate = patient.birthdate

        if(patient.birthdate !== '') {
            let date = new Date(patient.birthdate);
            let year = date.getUTCFullYear();
            let month = String(date.getUTCMonth() + 1).padStart(2, '0');
            let day = String(date.getUTCDate()).padStart(2, '0');
    
            formattedDate = `${year}-${month}-${day}`;
        }

        let transformPatient = {
            ...patient,
            birthdate: formattedDate
        }

        setPatientSelected(transformPatient)
        onOpenSecond()
    }

    const connectMercadopago = useCallback(async () => {
        try {
            const body = {
                "code": code,
                "user_id": user._id
            };
    
            await instance.post('/users/mercadopago', body)
    
            toast({
                title: 'Mercado pago vinculado con exito',
                position: 'top-right',
                isClosable: true,
                duration: 6000,
                status: 'success'
            })

            setTimeout(() => {
                navigate("/settings")
            }, 2000)
        }catch(err) {
            toast({
                title: 'Error en la respuesta de api mercadopago',
                position: 'top-right',
                isClosable: true,
                duration: 6000,
                status: 'error'
            })
            throw new Error(err.message)
        }
    }, [code, user, toast])

    const handleLoginMp = () => {
        const randomId = Math.floor(Math.random() * Date.now())
        window.open(`${import.meta.env.VITE_MERCADOPAGO_OAUTH_URL}?client_id=${import.meta.env.VITE_MERCADOPAGO_CLIENT_ID}&response_type=code&platform_id=mp&state=${randomId}&redirect_uri=${import.meta.env.VITE_MERCADOPAGO_REDIRECT_URL}`, "_self");
    }

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
      
    }, [code, connectMercadopago])

    return (
        <Flex w="100%" h="100%" px={[0, 2]} flexDirection="column" justifyContent="space-between">
            <Flex w="100%" justifyContent="space-between" alignItems="center" flexDirection={["column", "row"]} my={2}>
                <Text color="#205583" fontSize={["lg", "xl"]} fontWeight="bold">Ajustes</Text>
                {user?.super && (
                    <Link color="#205583" fontSize="xs" fontWeight="bold" href="/upgrade-user">
                        Administrar usuarios
                    </Link>
                )}
            </Flex>
            <Flex bg="#FFFFFF" w={["280px", "100%"]} h="100%" borderRadius="xl" boxShadow="md" justifyContent="space-between" alignItems="center" flexDirection="column">
                <Flex flexDirection="column" justifyContent="center" alignItems="center" w="100%">
                    <Box w={["100%", "100%", "90%"]} px={[4, 4, 4, 0]} mb={2}>
                        <Text textAlign="center" fontSize={["lg","xl"]} color="#205583" my={[2, 4]} fontWeight="bold">Datos del usuario</Text>
                            <Formik
                                initialValues={{
                                    name: user?.name,
                                    email: user?.email,
                                    reservePrice: user?.reservePrice,
                                    reserveTime: user?.reserveTime,
                                    especialization: user?.especialization
                                }}
                                onSubmit={handleSubmit}
                            >
                                {({isSubmitting}) => (
                                    <Form>
                                        <Flex w="100%" justifyContent="space-around" alignItems="center" my={[2, 8]} flexWrap={["wrap"]} gap={[3, 0]}>
                                            <Box w={["100%", "auto"]}>
                                                <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Nombre</Text>
                                                {isEditable.name ? (
                                                    <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                        <Field name='name'>
                                                        {({ field }) => (
                                                            <FormControl id="name">
                                                                <Input
                                                                    placeholder="nombre y apellido"
                                                                    _placeholder={{ color: "gray.500" }}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        )}
                                                        </Field>
                                                        <AiOutlineCloseCircle style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, name: false})}/>
                                                    </Flex>
                                                ) : (
                                                    <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                        <Text fontSize={["sm", "lg"]} color="#205583">{user?.name}</Text>
                                                        <FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, name: true})}/>
                                                    </Flex>
                                                )}
                                            </Box>
                                            <Box w={["100%", "auto"]}>
                                                <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Correo electrónico</Text>
                                                {isEditable.email ? (
                                                    <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                        <Field name='email'>
                                                        {({ field }) => (
                                                            <FormControl id="email">
                                                                <Input
                                                                    placeholder="Correo electrónico"
                                                                    _placeholder={{ color: "gray.500" }}
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                        )}
                                                        </Field>
                                                        <AiOutlineCloseCircle style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, email: false})}/>
                                                    </Flex>
                                                ) : (
                                                    <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                        <Text fontSize={["sm", "lg"]} color="#205583">{user?.email}</Text>
                                                        <FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, email: true})}/>
                                                    </Flex>
                                                )}
                                            </Box>
                                            {user?.role === 'DOCTOR' && (
                                                <>
                                                    <Box w={["100%", "auto"]}>
                                                        <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Precio de consulta</Text>
                                                        {isEditable.reservePrice ? (
                                                            <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                                <Field name='reservePrice'>
                                                                {({ field }) => (
                                                                    <FormControl id="reservePrice">
                                                                        <Input
                                                                            placeholder="500"
                                                                            _placeholder={{ color: "gray.500" }}
                                                                            type="number"
                                                                            {...field}
                                                                            maxW={["auto", "150px"]}
                                                                        />
                                                                    </FormControl>
                                                                )}
                                                                </Field>
                                                                <AiOutlineCloseCircle style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, reservePrice: false})}/>
                                                            </Flex>
                                                        ) : (
                                                            <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                                <Text fontSize={["sm", "lg"]} color="#205583">{user?.reservePrice}</Text>
                                                                <FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, reservePrice: true})}/>
                                                            </Flex>
                                                        )}
                                                    </Box>
                                                    <Box w={["100%", "auto"]}>
                                                        <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Tiempo de consulta</Text>
                                                        {isEditable.reserveTime ? (
                                                            <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                                <Field name='reserveTime'>
                                                                {({ field }) => (
                                                                    <FormControl id="reserveTime">
                                                                        <Input
                                                                            placeholder="15"
                                                                            _placeholder={{ color: "gray.500" }}
                                                                            type="number"
                                                                            {...field}
                                                                            maxW={["auto", "150px"]}
                                                                        />
                                                                    </FormControl>
                                                                )}
                                                                </Field>
                                                                <AiOutlineCloseCircle style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, reserveTime: false})}/>
                                                            </Flex>
                                                        ) : (
                                                            <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                                <Text fontSize={["sm", "lg"]} color="#205583">{user?.reserveTime}</Text>
                                                                <FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, reserveTime: true})}/>
                                                            </Flex>
                                                        )}
                                                    </Box>
                                                    <Box w={["100%", "auto"]}>
                                                        <Text fontSize={["sm", "lg"]} color="#205583" fontWeight="bold">Especialización</Text>
                                                        {isEditable.especialization ? (
                                                            <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                                <Field name='especialization'>
                                                                {({ field }) => (
                                                                    <FormControl id="especialization">
                                                                        <Input
                                                                            placeholder="Pediatría"
                                                                            _placeholder={{ color: "gray.500" }}
                                                                            type="text"
                                                                            {...field}
                                                                            maxW={["auto", "150px"]}
                                                                        />
                                                                    </FormControl>
                                                                )}
                                                                </Field>
                                                                <AiOutlineCloseCircle style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, especialization: false})}/>
                                                            </Flex>
                                                        ) : (
                                                            <Flex alignItems="center" justifyContent="space-between" gap={2}>
                                                                <Text fontSize={["sm", "lg"]} color="#205583">{user?.especialization}</Text>
                                                                <FaPencilAlt style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, especialization: true})}/>
                                                            </Flex>
                                                        )}
                                                    </Box>
                                                </>
                                            )}
                                        </Flex>
                                        {Object.values(isEditable).includes(true) && (
                                            <Box w="full" textAlign="center">
                                                <Button
                                                    bg="#205583"
                                                    color="#FFFFFF"
                                                    w={["220px","300px"]}
                                                    size={["xs", "sm"]}
                                                    mx="auto"
                                                    isLoading={isSubmitting}
                                                    type='submit'
                                                >
                                                    Actualizar
                                                </Button>
                                            </Box>
                                        )}
                                    </Form>
                                )}
                            </Formik>
                    </Box>
                </Flex>
                <Box bgColor="#E5F2FA"  gap={2} py={4} h="auto" w="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center" borderBottomRadius="xl">
                    <SimpleGrid columns={[1, 2, 3]} spacingX='40px' spacingY='10px' overflow="auto">
                        {patients.length > 0 && patients.map((patient, idx) => (
                            <CardCustom
                                key={idx}
                                heading={patient.label}
                                handleSelect={() => handleSelectPatient(patient)}
                                name={patient.label}
                                description={`DNI ${patient.value}`}
                                avatarSize="sm"
                                width="100%"
                                height="100%"
                            />
                        ))}
                    </SimpleGrid>
                    <Box w="full" textAlign="center">
                        <Button 
                            leftIcon={<AiOutlinePlus/>}
                            onClick={() => onOpenFirst()}
                            bg="#205583"
                            color="#FFFFFF"
                            w={["220px","300px"]}
                            size={["xs", "sm"]}
                        >
                            Crear nuevo paciente
                        </Button>
                    </Box>
                    <Box>
                        {user?.role === "DOCTOR" && user?.mercadopago_access?.access_token && (
                            <Button
                                bg="#205583"
                                size={["xs", "sm"]}
                                color="#FFFFFF"
                                w={["220px","300px"]}
                                leftIcon={<SiMercadopago style={{ fontSize: "24px" }}/>}
                                isDisabled
                            >
                                Conectado
                            </Button>
                        )}
                        {user?.role === "DOCTOR" && !user?.mercadopago_access?.access_token && (
                            <Button
                                bg="#205583"
                                leftIcon={<SiMercadopago style={{ fontSize: "24px" }}/>}
                                onClick={handleLoginMp}
                                color="#FFFFFF"
                                w={["220px","300px"]}
                                size={["xs", "sm"]}
                            >
                                Vincular
                            </Button>
                        )}
                    </Box>
                </Box>
            </Flex>
            <AlertModal
              onClose={() => onCloseFirst()}
              isOpen={isOpenFirst}
              alertHeader="Nuevo paciente"
              alertBody={<FormPatient handleSubmit={(values) => createPatient(values, onCloseFirst)}/>}
              isLoading={false}
            />
            <AlertModal
              onClose={() => onCloseSecond()}
              isOpen={isOpenSecond}
              alertHeader="Editar paciente"
              alertBody={<FormPatient initialValues={patientSelected} handleSubmit={(values) => updatePatient(values, onCloseSecond)}/>}
              isLoading={false}
            />
        </Flex>
    )
}