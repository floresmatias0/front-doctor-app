import { Box, Button, Flex, FormControl, Input, Text, useDisclosure, useToast } from "@chakra-ui/react"
import { AppContext } from "../components/context"
import { useCallback, useContext, useEffect, useState } from "react"
import { Field, Form, Formik } from "formik"
import { FaPenAlt } from "react-icons/fa"
import { AiOutlineCloseCircle, AiOutlinePlus } from "react-icons/ai"
import { instance } from "../utils/axios"
import CardCustom from "../components/card-custom"
import { AlertModal } from "../components/alerts"
import { useSearchParams } from "react-router-dom"
import FormPatient from "../components/form-patient"
import axios from 'axios'
import { SiMercadopago } from "react-icons/si"

const initialState = {
    name: false,
    email: false,
    reservePrice: false,
    reserveTime: false
}

export default function Settings() {
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
            reservePrice: values.reservePrice,
            reserveTime: values.reserveTime
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
        //TO REFRESH TOKEN, BUT THE TOKEN LASTS 180 DAYS
        // const body = JSON.stringify({
        //   "client_secret": import.meta.env.VITE_MERCADOPAGO_CLIENT_SECRET,
        //   "client_id": import.meta.env.VITE_MERCADOPAGO_CLIENT_ID,
        //   "grant_type": "refresh_token",
        //   "code": code,
        //   "redirect_uri": `${import.meta.env.VITE_MERCADOPAGO_REDIRECT_URL}`,
        //   "refresh_token": user?.mercadopago_access?.refresh_token
        // });
    
        try {
          const body = JSON.stringify({
            "client_secret": import.meta.env.VITE_MERCADOPAGO_CLIENT_SECRET,
            "client_id": import.meta.env.VITE_MERCADOPAGO_CLIENT_ID,
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": `${import.meta.env.VITE_MERCADOPAGO_REDIRECT_URL}`
          });
    
          const response = await axios.post(import.meta.env.VITE_MERCADOPAGO_OAUTH_TOKEN_URL, body)
    
          await instance.post('/users/mercadopago', {
            user_id: user?._id,
            mercadopago_access: response.data
          })
    
          return response.data;
        }catch(err) {
          console.log("connectMercadopago", err.message)
          throw new Error(err.message)
        }
    }, [code, user])

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
                    console.log("fetchDataMP", err.message);
                }
            };
    
            fetchDataMP();
        }
      
    }, [code, connectMercadopago])

    return (
        <Flex w="100%" h="100%" px={[0, 2]} flexDirection="column">
            <Flex w="100%" justifyContent="space-between" alignItems="center" flexDirection={["column", "row"]} my={2}>
                <Text color="#205583" fontSize={["md", "lg"]} fontWeight="bold">Ajustes</Text>
            </Flex>
            <Box bg="#FFFFFF" w={["280px", "100%"]} h="100%" borderRadius="xl" boxShadow="md">
                <Flex flexDirection="column" justifyContent="center" alignItems="center">
                    <Box w={["100%", "100%", "90%"]} px={[4, 4, 4, 0]} mb={2}>
                        <Text textAlign="center" fontSize={["lg","xl"]} color="#205583" my={[2, 4]} fontWeight="bold">Datos del usuario</Text>
                            <Formik
                                initialValues={{
                                    name: user?.name,
                                    email: user?.email,
                                    reservePrice: user?.reservePrice,
                                    reserveTime: user?.reserveTime
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
                                                        <FaPenAlt style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, name: true})}/>
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
                                                        <FaPenAlt style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, email: true})}/>
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
                                                                <FaPenAlt style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, reservePrice: true})}/>
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
                                                                <FaPenAlt style={{ cursor: 'pointer' }} onClick={() => setIsEditable({...isEditable, reserveTime: true})}/>
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
                <Box bgColor="#E5F2FA"  gap={2} h="237px" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Flex flexWrap="wrap" gap={4} my={4} justifyContent="center" alignItems="center" overflow={["auto", "none"]}>
                        {patients.length > 0 && patients.map((patient, idx) => (
                            <CardCustom
                                key={idx}
                                heading={patient.label}
                                handleSelect={() => handleSelectPatient(patient)}
                                name={patient.label}
                                description={`DNI ${patient.value}`}
                                avatarSize="sm"
                                width="190px"
                            />
                        ))}
                    </Flex>
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
            </Box>
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