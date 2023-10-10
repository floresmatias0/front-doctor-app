import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { instance } from "../utils/axios";
import { initMercadoPago } from "@mercadopago/sdk-react";

const Payment = ({doctorSelected, user, patient, selectDay}) => {
    initMercadoPago(import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY, {locale: 'es-AR'});


    // const handleDateClick = (date) => {
    //   setSelectedDate(date);
    // };

    // const fetchDataCalendar = async () => {
    //     try {
    //       const { data } = await instance.get(`/calendars?email=${doctorSelected.value}`);
    //       console.log({data})
    //       setCalendarData(data.data)
    //     //   let filters = `{ "email": "${doctorSelected.value}" }`
    //     //   const doctor = await instance.get(`/users?filters=${filters}`);
    //     //   setDoctorData(doctor?.data?.data[0])
    //     }catch(err) {
    //       throw new Error('Something went wrong to search calendar doctor')
    //     }
    // }

    // useEffect(() => {
    //     const fetchDataCalendars = async () => {
    //         try {
    //           await fetchDataCalendar();
    //         }catch(err){
    //           console.log(err)
    //         }
    //     }
      
    //     if(doctorSelected) {
    //         fetchDataCalendars();
    //     }
    // }, [doctorSelected])

    const fecha = new Date(selectDay); // Reemplaza con tu fecha
    const day = fecha.getDate();
    const month = fecha.getMonth() + 1; // Nota: getMonth() devuelve el mes de 0 a 11, así que sumamos 1 para obtener el mes real.
    const year = fecha.getFullYear();

    return (
        <Box>
            <Box bgColor="#E5F2FA" py={10} px={0}>
                <Text textAlign="center" fontSize="lg" color="#205583" my={2}>Detalles del turno médico de {patient?.name}</Text>
                <Flex w="100%" justifyContent="space-around" alignItems="center" my={8}>
                    <Box>
                        <Text fontSize="lg" color="#205583" fontWeight="bold">Doctor</Text>
                        <Text fontSize="lg" color="#205583">{doctorSelected?.label}</Text>
                    </Box>
                    <Box>
                        <Text fontSize="lg" color="#205583" fontWeight="bold">Especializacion</Text>
                        <Text fontSize="lg" color="#205583">Especializacion</Text>
                    </Box>
                    <Box>
                        <Text fontSize="lg" color="#205583" fontWeight="bold">Dia</Text>
                        <Text fontSize="lg" color="#205583">{`${day}/${month}/${year}`}</Text>
                    </Box>
                    <Box>
                        <Text fontSize="lg" color="#205583" fontWeight="bold">Hora</Text>
                        <Text fontSize="lg" color="#205583">{new Date(selectDay).getHours()}</Text>
                    </Box>
                </Flex>
            </Box>
        </Box>
    )
}

export default Payment