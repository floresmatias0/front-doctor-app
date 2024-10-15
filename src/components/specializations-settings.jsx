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
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { instance } from "../utils/axios";
import { MdCancel, MdErrorOutline } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { Formik, Form, Field } from "formik";
import { AiOutlinePlus } from "react-icons/ai";
import { AlertModal } from "./alerts";

const SpecializationsSettings = () => {
    const toast = useToast();
    const { isOpen, onOpen: onOpenForm, onClose } = useDisclosure();
    const [dataSpecializations, setDataSpecializations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchSpecializations = useCallback(async () => {
        try {
            setLoading(true);
            let specializations = await instance.get('/specializations');
            setDataSpecializations(specializations.data.data);
            setLoading(false);
        } catch (err) {
            console.log(err.message);
            setLoading(false);
            throw new Error(err.message);
        }
    }, []);

    useEffect(() => {
        const fetchDataSpecializations = async () => {
            try {
                await fetchSpecializations();
            } catch (err) {
                console.log(err);
            }
        };
        fetchDataSpecializations();
    }, [fetchSpecializations]);

    const updateSpecialization = async (id, name = null, isDelete = false) => {
        try {
            if (isDelete) {
                await instance.delete(`/specializations/${id}`);
            } else {
                await instance.post(`/specializations`, { name });
            }
            await fetchSpecializations();
            toast({
                position: "top",
                render: () => (
                    <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto", "428px"]} boxShadow="2xl">
                        <HiOutlineBadgeCheck style={{ width: "36px", height: "36px", color: "#104DBA" }} />
                        <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">
                            Especialización {name ? 'creada' : 'eliminada'} con éxito
                        </Text>
                    </Box>
                )
            });
        } catch (err) {
            console.log(err.message);
            toast({
                position: "top",
                render: () => (
                    <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto", "428px"]} boxShadow="2xl">
                        <MdErrorOutline style={{ width: "36px", height: "36px", color: "red" }} />
                        <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">
                            Hubo un error inesperado, inténtelo nuevamente
                        </Text>
                    </Box>
                )
            });
        }
    };
    
    const handleDeleteSpecialization = (id) => {
        updateSpecialization(id, null, true);
    };
    

    const handleSubmit = async (values) => {
        await updateSpecialization(null, values.name);
        onClose();
    };

    const validate = (values) => {
        const errors = {};
        if (!values.name) {
            errors.name = "Por favor, coloque su nombre";
        }
        return errors;
    };

    return (
        <Flex flex={1} w="full" h="full" flexDirection="column">
            {loading ? (
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
                            w="215px"
                            my={4}
                        >
                            <Text
                                fontSize="xs"
                                lineHeight="10.55px"
                                fontWeight={500}
                                textTransform="uppercase"
                            >
                                Agregar especialización
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
                                {dataSpecializations && dataSpecializations.length > 0 && dataSpecializations.map((x, idx) => (
                                    <Tr key={idx}>
                                        <Td fontFamily="Roboto">{x.name}</Td>
                                        <Td>
                                            <Flex gap={3}>
                                            <MdCancel size={20} title="Eliminar especialización" onClick={() => handleDeleteSpecialization(x?._id)} />

                                            </Flex>
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </TableContainer>
                    {/* FORMS */}
                    <AlertModal
                        onClose={() => onClose()}
                        isOpen={isOpen}
                        alertHeader="Nueva especialización"
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
            )}
        </Flex>
    );
};

export default SpecializationsSettings;
