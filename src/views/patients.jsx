import {
  Flex,
  Text,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Spinner,
  Center,
  Heading,
} from "@chakra-ui/react";
import { Fragment, useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../components/context";
import { instance } from "../utils/axios";

const Patients = () => {
  const [dataBookings, setDataBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AppContext);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const patients = await instance.get(
        `/calendars/doctor-patients/${user.email}`
      );
      const { data } = patients?.data;

      setLoading(false);
      setDataBookings(data);
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      throw new Error(err.message);
    }
  }, [user]);

  useEffect(() => {
    const fetchDataPatients = async () => {
      if (user) {
        try {
          await fetchPatients();
        } catch (err) {
          console.log(err);
        }
      }
    };

    fetchDataPatients();
  }, [fetchPatients, user]);

  const headingTable = [
    {
      name: "tutor",
      detail: "",
    },
    {
      name: "telefono del tutor",
      detail: "",
    },
    {
      name: "paciente",
      detail: "",
    },
    {
      name: "n° documento",
      detail: "",
    },
    {
      name: "genero",
      detail: "",
    },
    {
      name: "fecha nacimiento",
      detail: "",
    },
    {
      name: "telefono del paciente",
      detail: "",
    },
    {
      name: "obra social",
      detail: "",
    },
    {
      name: "n° afiliado",
      detail: "",
    },
  ];

  return (
    <Flex
      w={["full", "calc(100% - 155px)"]}
      h="100%"
      justifyContent={["top", "top"]}
      flexDirection="column"
    >
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
        <Fragment>
          <Box>
            <Heading
              fontSize={["15px", "25px"]}
              fontWeight={700}
              lineHeight={["17.58px", "29.3px"]}
              color="#104DBA"
              border={["1px solid #104DBA", "none"]}
              px={[4, 0]}
              py={[0.5, 0]}
              rounded={["xl", "none"]}
              w={["130px", "auto"]}
              mb={4}
            >
              Mis pacientes
            </Heading>
            {dataBookings?.length > 0 ? (
              <TableContainer
                borderTopStartRadius="15px"
                borderTopEndRadius="15px"
                borderBottomStartRadius="15px"
                borderBottomEndRadius="15px"
                boxShadow="0px 4px 4px 0px #00000040"
                overflow="auto"
                order={5}
              >
                <Table size="md" variant="unstyled">
                  <Thead bgColor="#104DBA" boxShadow="xl" height={50}>
                    <Tr>
                      {headingTable?.map((h, idx) => (
                        <Th
                          key={idx}
                          color="#FFF"
                          fontWeight={500}
                          fontSize="16px"
                          lineHeight="18.75px"
                          px={8}
                          textAlign="center"
                        >
                          {h?.name}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                  <Tbody>
                    {dataBookings?.length > 0 &&
                      dataBookings
                        ?.map((x, idx) => {
                          return (
                            <Tr
                              key={idx}
                              fontSize="12px"
                              fontWeight={400}
                              lineHeight="14.06px"
                              textTransform="uppercase"
                              px={8}
                              textAlign="center"
                            >
                              <Td textAlign="center">{x.tutorName}</Td>
                              <Td textAlign="center">{x.tutorPhone}</Td>
                              <Td textAlign="center">{x.patientName}</Td>
                              <Td textAlign="center">{x.patientIdentityId}</Td>
                              <Td textAlign="center">{x.patientGenre}</Td>
                              <Td textAlign="center">{x.patientDateOfBirth}</Td>
                              <Td textAlign="center">{x.patientPhone}</Td>
                              <Td textAlign="center">{x.patientSocialWork}</Td>
                              <Td textAlign="center">
                                {x.patientSocialWorkId}
                              </Td>
                            </Tr>
                          );
                        })
                        .slice(0, 5)}
                  </Tbody>
                </Table>
              </TableContainer>
            ) : (
              <Text>Aun no tienes pacientes</Text>
            )}
          </Box>
        </Fragment>
      )}
    </Flex>
  );
};

export default Patients;
