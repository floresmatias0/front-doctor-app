import {
  Box,
  Button,
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
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { instance } from "../utils/axios";
import { TbUserUp, TbUserDown, TbUserPlus, TbUserCancel } from "react-icons/tb";
import { MdErrorOutline } from "react-icons/md";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { AlertModal } from "./alerts";

const Upgrade = () => {
  const toast = useToast();
  const {
    isOpen: isOpenUpdateUser,
    onOpen: onOpenUpdateUser,
    onClose: onCloseUpdateUser,
  } = useDisclosure();

  const [dataUsers, setDataUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userSelected, setUserSelected] = useState(null);
  const [dataToUpdate, setDataToUpdate] = useState({
    title: "",
    btnText: "",
    type: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      let users = await instance.get("/users");

      setDataUsers(users.data.data);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      throw new Error(err.message);
    }
  }, []);

  useEffect(() => {
    const fetchDataUsers = async () => {
      try {
        await fetchUsers();
      } catch (err) {
        console.log(err);
      }
    };

    fetchDataUsers();
  }, [fetchUsers]);

  const updateUser = async (id, data, type) => {
    try {
      if (type === "DELETE") {
        await instance.delete(`/users/${id}`);
      } else {
        await instance.put(`/users/${id}`, data);
      }

      await fetchUsers();

      let role =
        type === "ADMIN"
          ? "administrador"
          : type === "DOCTOR"
          ? "doctor"
          : "paciente";

      toast({
        position: "top",
        render: () => (
          <Box
            py={4}
            px={8}
            bg="white"
            borderRadius="md"
            maxW={["auto", "428px"]}
            boxShadow="2xl"
          >
            <HiOutlineBadgeCheck
              style={{ width: "36px", height: "36px", color: "#104DBA" }}
            />
            <Text
              color="#104DBA"
              fontSize="2xl"
              fontWeight={700}
              textOverflow="wrap"
              lineHeight="35.16px"
              width="75%"
            >
              {type === "DELETE"
                ? "Se elimino usuario correctamente"
                : `El usuario ahora es ${role}`}
            </Text>
          </Box>
        ),
      });
    } catch (err) {
      console.log(err.message);
      toast({
        position: "top",
        render: () => (
          <Box
            py={4}
            px={8}
            bg="white"
            borderRadius="md"
            maxW={["auto", "428px"]}
            boxShadow="2xl"
          >
            <MdErrorOutline
              style={{ width: "36px", height: "36px", color: "red" }}
            />
            <Text
              color="#104DBA"
              fontSize="2xl"
              fontWeight={700}
              textOverflow="wrap"
              lineHeight="35.16px"
              width="75%"
            >
              Hubo un error inesperado, intentelo nuevamente
            </Text>
          </Box>
        ),
      });
    }
  };

  const handleUpdate = async () => {
    let update = {};
    let type = "";

    switch (dataToUpdate?.type) {
      case "updateToPatient":
        update = {
          role: "PACIENTE",
          mercadopago_access: {},
        };
        type = "PACIENTE";
        break;
      case "updateToDoctor":
        update = { role: "DOCTOR" };
        type = "DOCTOR";
        break;
      case "updateToAdmin":
        update = { role: "ADMIN" };
        type = "ADMIN";
        break;
      case "deleteUser":
        update = {};
        type = "DELETE";
        break;
      default:
        update = {};
        type = "";
    }

    await updateUser(userSelected?._id, update, type);
    return onCloseUpdateUser();
  };

  return (
    <Flex flex={1} w="full" h="full" flexDirection="column">
      {loading ? (
        <Flex
          w="100%"
          flex={1}
          px={[2, 2, 4]}
          py={4}
          flexDirection="column"
          overflow="auto"
        >
          <Center>
            <Spinner color="#205583" />
          </Center>
        </Flex>
      ) : (
        <Flex
          w="100%"
          flex={1}
          px={[0, 2, 4]}
          py={4}
          flexDirection="column"
          overflow="auto"
        >
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th fontFamily="Roboto">Nombre</Th>
                  <Th fontFamily="Roboto">Email</Th>
                  <Th fontFamily="Roboto">Rol</Th>
                  <Th fontFamily="Roboto">Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dataUsers &&
                  dataUsers?.length > 0 &&
                  dataUsers?.map((x, idx) => {
                    return (
                      <Tr key={idx}>
                        <Td fontFamily="Roboto">{x.name}</Td>
                        <Td fontFamily="Roboto">{x.email}</Td>
                        <Td fontFamily="Roboto">{x.role}</Td>
                        <Td>
                          <Flex gap={3} cursor="pointer">
                            {x.role === "DOCTOR" ? (
                              <TbUserDown
                                size={20}
                                title="Convertir en paciente"
                                onClick={() => {
                                  setDataToUpdate({
                                    title:
                                      "¿Seguro desea convertir en paciente?",
                                    type: "updateToPatient",
                                  });
                                  setUserSelected(x);
                                  onOpenUpdateUser();
                                }}
                              />
                            ) : (
                              <TbUserUp
                                size={20}
                                title="Convertir en doctor"
                                onClick={() => {
                                  setDataToUpdate({
                                    title: "¿Seguro desea convertir en doctor?",
                                    type: "updateToDoctor",
                                  });
                                  setUserSelected(x);
                                  onOpenUpdateUser();
                                }}
                              />
                            )}
                            {x.role !== "ADMIN" && (
                              <TbUserPlus
                                size={20}
                                title="Convertir en administrador"
                                onClick={() => {
                                  setDataToUpdate({
                                    title:
                                      "¿Seguro desea convertir en administrador?",
                                    type: "updateToAdmin",
                                  });
                                  setUserSelected(x);
                                  onOpenUpdateUser();
                                }}
                              />
                            )}
                            <TbUserCancel
                              size={20}
                              title="Eliminar cuenta"
                              onClick={() => {
                                setDataToUpdate({
                                  title: "¿Seguro desea eliminar cuenta?",
                                  btnText: "",
                                  type: "deleteUser",
                                });
                                setUserSelected(x);
                                onOpenUpdateUser();
                              }}
                            />
                          </Flex>
                        </Td>
                      </Tr>
                    );
                  })}
              </Tbody>
            </Table>
          </TableContainer>
        </Flex>
      )}
      <AlertModal
        customWidth={300}
        onClose={onCloseUpdateUser}
        isOpen={isOpenUpdateUser}
        alertHeader="Actualizar usuario"
        alertBody={
          <Flex
            padding={2}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Text textAlign="center">
              Usuario seleccionado: {userSelected?.email}
            </Text>
            <Text textAlign="center">{dataToUpdate?.title} </Text>
          </Flex>
        }
        customButtonConfirm={
          <Button
            px={2}
            border="1px"
            color={"#FFF"}
            bgColor="#104DBA"
            borderRadius="xl"
            cursor="pointer"
            _hover={{
              backgroundColor: "#FFF",
              borderColor: "#104DBA",
              color: "#104DBA",
            }}
            size="sm"
            mx="auto"
            fontWeight={500}
            onClick={() => handleUpdate()}
          >
            Actualizar
          </Button>
        }
        isLoading={false}
      />
    </Flex>
  );
};

export default Upgrade;
