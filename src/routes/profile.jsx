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
import { useEffect, useState } from "react"
import { instance } from "../utils/axios"
import { getFormattedDateTime } from "../components/calendar"
import { SlClose } from "react-icons/sl"
import { SiMercadopago } from "react-icons/si"
import { useSearchParams } from "react-router-dom"
import axios from 'axios'

export default function Profile() {
  const [searchParams] = useSearchParams();
  
  const currentParams = Object.fromEntries([...searchParams]);
  const { code } = currentParams;

  const [dataBookings, setDataBookings] = useState([])

  const user = JSON.parse(localStorage.getItem("user"))

  const fetchBookings = async () => {
    try {
      const bookings = await instance.get(`/calendars/all-events/${user._id}`)
      setDataBookings(bookings.data.data)
    }catch(err) {
      console.log(err.message)
      throw new Error(err.message)
    }
  }

  useEffect(() => {
      const fetchDataBookings = async () => {
        if (user) {
          try {
            await fetchBookings();
          } catch (err) {
            console.log(err);
          }
        }
      };
    
      fetchDataBookings();
  }, [])

  const connectMercadopago = async () => {
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

      const response = await axios.post(import.meta.env.VITE_MERCADOPAGO_OAUTH_TOKEN, body)

      await instance.post('/users/mercadopago', {
        user_id: user?._id,
        mercadopago_access: response.data
      })

      return response.data;
    }catch(err) {
      console.log(err.message)
      throw new Error(err.message)
    }
  }

  useEffect(() => {
    if (code) {
      const fetchDataMP = async () => {
        try {
          await connectMercadopago();
        } catch (err) {
          console.log(err);
        }
      };

      fetchDataMP();
    }
  
  }, [])

  useEffect(() => {
    if(!user?.mercadopago_access) {
      const updateDataUser = async () => {
        try {
          const { data } = await instance.get(`/users/${user?._id}`);
          const response = data;
          if (response.success) {
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(response.data));
          }
        }catch(err) {
          console.log(err);
        }
      }
      updateDataUser();
    }
  }, [])

  const handleLoginMp = () => {
    const randomId = Math.floor(Math.random() * Date.now())
    window.open(`${import.meta.env.VITE_MERCADOPAGO_AUTH_ACCESS_URL}?client_id=${import.meta.env.VITE_MERCADOPAGO_CLIENT_ID}&response_type=code&platform_id=mp&state=${randomId}&redirect_uri=${import.meta.env.VITE_MERCADOPAGO_REDIRECT_URL}`, "_self");
  }

  const handleDeleteEvent = async (bookingId, userEmail) => {
    try {
      await instance.delete(`/calendars/${bookingId}?email=${userEmail}`)
    }catch(err) {
      console.log(err.message)
    }
  }

  const statuses = {
    'confirmed': 'CONFIRMADO',
    'deleted': 'CANCELADO'
  }

  return (
    <Grid
      minH="100vh"
      templateRows='repeat(2, 1fr)'
      templateColumns='repeat(5, 1fr)'
      gap={4}
      bg={useColorModeValue("gray.50", "gray.700")}
    >
      <GridItem rowSpan={{ base: 1, xl: 2 }} colSpan={{ base: 5, xl: 1 }}>
        <Stack
          bg={useColorModeValue("white.100", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }} textAlign="center">
            Mi perfil
          </Heading>
          <FormControl id="userName">
            <Center>
              <Avatar size="xl" src={user?.picture}/>
            </Center>
          </FormControl>
          <FormControl id="userName">
            <FormLabel>Nombre</FormLabel>
            <Input
              placeholder="nombre y apellido"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={user?.name}
              disabled
            />
          </FormControl>
          <FormControl id="email">
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
            {user?.role === "DOCTOR" && user?.mercadopago_access?.access_token && (
              <Button
                bg={"green.400"}
                color={"white"}
                w="full"
              >
                MP conectado
              </Button>
            )}
            {user?.role === "DOCTOR" && !user?.mercadopago_access?.access_token && (
              <Button
                colorScheme='yellow'
                w="full"
                leftIcon={<SiMercadopago/>}
                onClick={handleLoginMp}
              >
                Vincular
              </Button>
            )}
          </Stack>
        </Stack>
      </GridItem>
      <GridItem colSpan={{ base: 5, xl: 4 }}>
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
                <Th>Estado</Th>
                <Th>Doctor</Th>
                <Th>Acciones</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                dataBookings &&
                dataBookings?.length > 0 &&
                dataBookings?.map(x => {
                  let now = new Date()
                  let bookingStart = new Date(x.start.dateTime);
                  let isBookingPassed = now > bookingStart || x.status === 'deleted';

                  let date = `${getFormattedDateTime(x.start.dateTime, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} de
                            ${getFormattedDateTime(x.start.dateTime, { hour: 'numeric', minute: 'numeric' })} a
                            ${getFormattedDateTime(x.end.dateTime, { hour: 'numeric', minute: 'numeric' })}hs.`

                return (
                <Tr>
                  <Td>{x.summary}</Td>
                  <Td><a href={x.hangoutLink}><Text color='blue'>Google meet</Text></a></Td>
                  <Td>{date}</Td>
                  <Td>{statuses[x.status]}</Td>
                  <Td>{x.organizer.email}</Td>
                  <Td>
                  <Tooltip label={x.status === 'deleted' ? 'Cancelado': now > bookingStart ? 'Expiro' : 'Cancelar turno'}>
                    <Button onClick={() => handleDeleteEvent(x._id, x.organizer.email)} isDisabled={isBookingPassed}>
                      <SlClose />
                    </Button>
                  </Tooltip>
                  </Td>
                </Tr>
              )}).reverse()}
            </Tbody>
          </Table>
        </TableContainer>
      </GridItem>
    </Grid>
  );
}
