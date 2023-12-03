import { Box, Button, Center, Flex, Spinner, Text, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { instance } from "../utils/axios"
import { TbUserUp, TbUserDown } from "react-icons/tb"

const Upgrade = () => {
    const toast = useToast()
    
    const [dataUsers, setDataUsers] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true)
            let users = await instance.get('/users')

            setDataUsers(users.data.data)
            setLoading(false)
        }catch(err) {
          console.log(err.message)
          setLoading(false)
          throw new Error(err.message)
        }
    }, [])
    
    useEffect(() => {
        const fetchDataUsers = async () => {
            try {
                await fetchUsers();
            } catch (err) {
                console.log(err);
            }
        };
    
        fetchDataUsers();
    }, [fetchUsers])

    const updateUser = async (id, access) => {
        try {
            await instance.put(`/users/${id}`, {
                super: access
            })

            await fetchUsers()

            return toast({
                title: "Usuario modificado con exito",
                description: `Ahora el usuario ${access ? '' : 'no'} tiene permiso de administrador`,
                position: "top-right",
                isClosable: true,
                duration: 6000,
                status: "success"
            });
        }catch(err) {
            console.log(err.message)
            return toast({
                title: "Ocurrio un error inesperado",
                description: err.message,
                position: "top-right",
                isClosable: true,
                duration: 6000,
                status: "error"
            });
        }
    }

    return (
        <Flex w={["280px", "100%"]} h="100%" flexDirection="column">
            <Text color="#205583" fontSize={["md", "lg"]} fontWeight="bold">Todos los usuarios</Text>

            {loading ? 
                (
                    <Flex w="100%" flex={1} bg="#FCFEFF" borderRadius="xl" boxShadow="md" px={[2, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <Center>
                            <Spinner color="#205583"/>
                        </Center>
                    </Flex>
                ) : (
                    <Flex w="100%" flex={1} bg="#FCFEFF" borderRadius="xl" boxShadow="md" px={[0, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <Flex justifyContent="space-between" display={["none", "none", "none", "none", "flex"]}>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Nombre</Box>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Correo</Box>
                            <Box flex="1" fontWeight="bold" fontSize={["sm", "md"]} textAlign="center" color="#205583">Acciones</Box>
                        </Flex>
                        {
                            dataUsers &&
                            dataUsers?.length > 0 &&
                            dataUsers?.map((x, idx) => {
                                return (
                                    <Flex
                                        key={idx}
                                        display={["block", "flex"]}
                                        flexDirection={["column", "column", "column", "column", "row"]}
                                        alignItems="center"
                                        my={2}
                                    >
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" fontWeight="normal" maxWidth="auto">
                                            <Text fontSize={["sm", "md"]} color="#205583" textAlign="center">{x.name}</Text>
                                        </Box>
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" fontWeight="normal" maxWidth="auto">
                                            <Text fontSize={["sm", "md"]} color="#205583" textAlign="center">{x.email}</Text>
                                        </Box>
                                        <Box flex="1" display={["block", "flex"]} justifyContent="center" maxWidth="auto" textAlign="center">
                                            {x?.super ? <Button size="xs" leftIcon={<TbUserDown />} onClick={() => updateUser(x?._id, false)}>Sacar permisos</Button> : <Button size="xs" leftIcon={<TbUserUp title="Acceso superusuario"/>} onClick={() => updateUser(x?._id, true)}>Convertir en admin</Button>}
                                        </Box>
                                    </Flex>
                                );
                            })
                        }
                    </Flex>
                )
            }
        </Flex>
    )
}

export default Upgrade