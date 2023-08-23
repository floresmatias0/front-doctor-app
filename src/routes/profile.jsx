"use client";

import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  AvatarBadge,
  IconButton,
  Center,
  Grid,
  GridItem,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
  Text,
  Tooltip
} from "@chakra-ui/react"
import { SmallCloseIcon } from "@chakra-ui/icons"
import { useEffect, useState } from "react"
import { instance } from "../utils/axios"
import { getFormattedDateTime } from "../components/calendar"
import { SlClose } from "react-icons/sl"

export default function Profile() {
  const [dataBookings, setDataBookings] = useState([])

  const user = JSON.parse(localStorage.getItem("user"))

  const fetchBookings = async () => {
    try {
      if(user) {
        const bookings = await instance.get(`/calendars/all-events/${user._id}`)
        setDataBookings(bookings.data.data)
      }
    }catch(err) {
      console.log(err.message)
      throw new Error(err.message)
    }
  }

  useEffect(() => {
    fetchBookings()
      .then(response => response)
      .catch(err => err.message)

  }, [])

  return (
    <Grid
      minH="100vh"
      templateRows={['1fr 1fr', '1fr', '1fr']}
      templateColumns={['1fr', '1fr', '1fr 1fr 1fr 1fr']}
      gap={4}
      bg={useColorModeValue("gray.50", "gray.700")}
    >
      <GridItem rowSpan={2} colSpan={1}>
        <Stack
          bg={useColorModeValue("white.100", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            Mi perfil
          </Heading>
          <FormControl id="userName">
            <FormLabel>Foto</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar size="xl" src={user?.picture}>
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                  />
                </Avatar>
              </Center>
              <Center w="full">
                <Button w="full">Cambiar foto</Button>
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="nombre y apellido"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={user?.name}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Correo electronico</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={user?.email}
              disabled
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancelar
            </Button>
            <Button
              bg={"blue.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
            >
              Enviar
            </Button>
          </Stack>
        </Stack>
      </GridItem>
      <GridItem colSpan={3}>
      <TableContainer
        rounded={"xl"}
        boxShadow={"lg"}
      >
        <Table variant='simple'>
          <TableCaption>Reservas agendadas</TableCaption>
          <Thead>
            <Tr>
              <Th>Titulo</Th>
              <Th>Reunion</Th>
              <Th>Fecha</Th>
              <Th>Doctor</Th>
              <Th>Acciones</Th>
            </Tr>
          </Thead>
          <Tbody>
            {dataBookings && dataBookings?.length > 0 && dataBookings?.map(x => {
              let date = `${getFormattedDateTime(x.start.dateTime, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} de
                          ${getFormattedDateTime(x.start.dateTime, { hour: 'numeric', minute: 'numeric' })} a
                          ${getFormattedDateTime(x.end.dateTime, { hour: 'numeric', minute: 'numeric' })}hs.`

              return (
              <Tr>
                <Td>{x.summary}</Td>
                <Td><a href={x.hangoutLink}><Text color='blue'>Google meet</Text></a></Td>
                <Td>{date}</Td>
                <Td>{x.organizer.email}</Td>
                <Td>
                <Tooltip label='Cancelar turno'>
                  <Button onClick={() => console.log('hola')}>
                    <SlClose />
                  </Button>
                </Tooltip>
                </Td>
              </Tr>
            )})}
          </Tbody>
        </Table>
      </TableContainer>
      </GridItem>
    </Grid>
  );
}
