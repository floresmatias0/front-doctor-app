import { Box, Center, Flex, Spinner, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, useToast } from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { instance } from "../utils/axios"
import { TbUserUp, TbUserDown, TbUserPlus, TbUserCancel } from "react-icons/tb"
import { MdErrorOutline } from "react-icons/md"
import { HiOutlineBadgeCheck } from "react-icons/hi"

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

    const updateUser = async (id, data, type) => {
        try {
            if(type === "DELETE") {
                await instance.delete(`/users/${id}`);
            }else {
                await instance.put(`/users/${id}`, data);
            }

            await fetchUsers();

            let role = type === "ADMIN" ? "administrador" : type === "DOCTOR" ? "doctor" : "paciente";

            toast({
                position: "top",
                render: () => (
                    <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto","428px"]} boxShadow="2xl">
                        <HiOutlineBadgeCheck  style={{ width: "36px", height: "36px", color:"#104DBA" }}/>
                        <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">{type === "DELETE" ? "Se elimino usuario correctamente" : `El usuario ahora es ${role}`}</Text>
                    </Box>
                )
            })
        }catch(err) {
            console.log(err.message)
            toast({
                position: "top",
                render: () => (
                    <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto","428px"]} boxShadow="2xl">
                        <MdErrorOutline  style={{ width: "36px", height: "36px", color:"red" }}/>
                        <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">Hubo un error inesperado, intentelo nuevamente</Text>
                    </Box>
                )
            })
        }
    }

    return (
        <Flex flex={1} w="full" h="full" flexDirection="column">
            {loading ? 
                (
                    <Flex w="100%" flex={1} px={[2, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <Center>
                            <Spinner color="#205583"/>
                        </Center>
                    </Flex>
                ) : (
                    <Flex w="100%" flex={1} px={[0, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <TableContainer>
                            <Table size='sm'>
                                <Thead>
                                    <Tr>
                                        <Th fontFamily="Roboto">Nombre</Th>
                                        <Th fontFamily="Roboto">Email</Th>
                                        <Th fontFamily="Roboto">Rol</Th>
                                        <Th fontFamily="Roboto">Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        dataUsers &&
                                        dataUsers?.length > 0 &&
                                        dataUsers?.map((x, idx) => {
                                            return (
                                                <Tr key={idx}>
                                                    <Td fontFamily="Roboto">{x.name}</Td>
                                                    <Td fontFamily="Roboto">{x.email}</Td>
                                                    <Td fontFamily="Roboto">{x.role}</Td>
                                                    <Td>
                                                        <Flex gap={3}>
                                                            {x.role === "DOCTOR" ? <TbUserDown size={20} title="Convertir en paciente" onClick={() => updateUser(x?._id, {role: "PACIENTE", mercadopago_access: {}}, "PACIENTE")}/> : <TbUserUp size={20} title="Convertir en doctor" onClick={() => updateUser(x?._id, {role: "DOCTOR"}, "DOCTOR")}/> }
                                                            {x.role !== "ADMIN" && <TbUserPlus size={20} title="Convertir en administrador" onClick={() => updateUser(x?._id, {role: "ADMIN"}, "ADMIN")}/>}
                                                            <TbUserCancel size={20} title="Eliminar cuenta" onClick={() => updateUser(x?._id, {}, "DELETE")}/>
                                                        </Flex>
                                                    </Td>
                                                </Tr>
                                            );
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Flex>
                )
            }
        </Flex>
    )
}

export default Upgrade