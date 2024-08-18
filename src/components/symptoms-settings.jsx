import { 
    Box,
    Center,
    Flex,
    Spinner,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useDisclosure,
    useToast,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Button,
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { instance } from "../utils/axios"
import { MdCancel, MdErrorOutline } from "react-icons/md"
import { HiOutlineBadgeCheck } from "react-icons/hi"
import { Formik, Form, Field } from "formik";
import { AiOutlinePlus } from "react-icons/ai"
import { AlertModal } from "./alerts";


const SymptomsSettings = () => {
    const toast = useToast()
    const { isOpen, onOpen: onOpenForm, onClose } = useDisclosure();

    const [dataSymptoms, setDataSymptoms] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchSymptoms = useCallback(async () => {
        try {
            setLoading(true)
            let symptoms = await instance.get('/symptoms')

            setDataSymptoms(symptoms.data.data)
            setLoading(false)
        } catch (err) {
            console.log(err.message)
            setLoading(false)
            throw new Error(err.message)
        }
    }, [])

    useEffect(() => {
        const fetchDataSymptoms = async () => {
            try {
                await fetchSymptoms();
            } catch (err) {
                console.log(err);
            }
        };

        fetchDataSymptoms();
    }, [fetchSymptoms])

    const updateSymptom = async (id, name = null) => {
        try {
            if(name) {
                await instance.post(`/symptoms`, { name });
            }else {
                await instance.delete(`/symptoms/${id}`);
            }


            await fetchSymptoms();

            toast({
                position: "top",
                render: () => (
                    <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto", "428px"]} boxShadow="2xl">
                        <HiOutlineBadgeCheck style={{ width: "36px", height: "36px", color: "#104DBA" }} />
                        <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">Sintoma {name ? 'creado' : 'eliminado'} con exito</Text>
                    </Box>
                )
            })
        } catch (err) {
            console.log(err.message)
            toast({
                position: "top",
                render: () => (
                    <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto", "428px"]} boxShadow="2xl">
                        <MdErrorOutline style={{ width: "36px", height: "36px", color: "red" }} />
                        <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">Hubo un error inesperado, intentelo nuevamente</Text>
                    </Box>
                )
            })
        }
    }

    const handleSubmit = async (values) => {
        await updateSymptom(null, values.name);
        onClose()
    }

    const validate = (values) => {
        const errors = {};

        if (!values.name) {
            errors.name = "Por favor, coloque su nombre";
        }

        return errors;
    };

    return (
        <Flex flex={1} w="full" h="full" flexDirection="column">
            {loading ?
                (
                    <Flex w="100%" flex={1} px={[2, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <Center>
                            <Spinner color="#205583" />
                        </Center>
                    </Flex>
                ) : (
                    <Flex w="100%" flex={1} px={[0, 2, 4]} py={4} flexDirection="column" overflow="auto">
                        <Flex justifyContent="flex-end">
                            <Button
                                bg="#104DBA"
                                color="#FFFFFF"
                                size="xs"
                                leftIcon={<AiOutlinePlus width={14} height={14} />}
                                onClick={onOpenForm}
                                w="180px"
                                my={4}
                            >
                                <Text
                                    fontSize="xs"
                                    lineHeight="10.55px"
                                    fontWeight={500}
                                    textTransform="uppercase"
                                >
                                    Crear nuevo sintoma
                                </Text>
                            </Button>
                        </Flex>
                        <TableContainer>
                            <Table size='sm'>
                                <Thead>
                                    <Tr>
                                        <Th fontFamily="Roboto">Nombre</Th>
                                        <Th fontFamily="Roboto">Acciones</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {
                                        dataSymptoms &&
                                        dataSymptoms?.length > 0 &&
                                        dataSymptoms?.map((x, idx) => {
                                            return (
                                                <Tr key={idx}>
                                                    <Td fontFamily="Roboto">{x.name}</Td>
                                                    <Td>
                                                        <Flex gap={3}>
                                                            <MdCancel size={20} title="Eliminar sintoma" onClick={() => updateSymptom(x?._id, "DELETE")} />
                                                        </Flex>
                                                    </Td>
                                                </Tr>
                                            );
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </TableContainer>
                        {/* FORMS */}
                        <AlertModal
                            onClose={() => onClose()}
                            isOpen={isOpen}
                            alertHeader="Nuevo sintoma"
                            customWidth="calc(100% - 50px)"
                            alertBody={
                                <Formik
                                    initialValues={{ name: "" }}
                                    onSubmit={(values) => handleSubmit(values)}
                                    validate={validate}
                                >
                                    {() => (
                                        <Form>
                                            <Field name="name" colSpan={1}>
                                                {({ field, form }) => (
                                                    <FormControl
                                                        isInvalid={form.errors.name && form.touched.name}
                                                        px={4}
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
                                                            {form.errors.name}
                                                        </FormErrorMessage>
                                                    </FormControl>
                                                )}
                                            </Field>
                                            <Button
                                                bg="#104DBA"
                                                color="#FFFFFF"
                                                w="120px"
                                                size={["xs", "sm"]}
                                                type="submit"
                                                float="right"
                                                mt={4}
                                                mx={4}
                                            >
                                                CREAR
                                            </Button>
                                        </Form>
                                    )}
                                </Formik>
                            }
                            isLoading={false}
                        />
                    </Flex>
                )
            }
        </Flex>
    )
}

export default SymptomsSettings