import { useEffect, useState } from 'react';
import { instance } from '../utils/axios';
import CalendarComponent from '../components/calendar';
import AsyncSelect from 'react-select/async';
import { Flex, Grid, GridItem, useToast } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SidebarMenu from '../components/sidebar-menu';
import { Box } from '@chakra-ui/react'
import TabsConsult from '../components/tabs';
import ListDoctors from '../components/list-doctors';
import ListCalendar from '../components/list-calendar';

export default function Welcome() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentStatus = searchParams.get("status");

  const [calendarData, setCalendarData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [selected, setSelected] = useState(null);
  
  const toast = useToast()

  useEffect(() => {
    const paymentStatusMessages = {
      approved: {
        title: "Reserva creada",
        description: "Tu reserva ha sido creada exitosamente.",
        status: "success",
      },
      pending: {
        title: "Pago pendiente",
        description: "Tu pago está pendiente de confirmación.",
        status: "info",
      },
      failed: {
        title: "Pago fallido",
        description: "Tu pago ha fallado. Por favor, inténtalo nuevamente.",
        status: "error",
      },
    };
    
    const paymentStatusMessage = paymentStatusMessages[paymentStatus];
    
    if (paymentStatusMessage) {
      toast({
        title: paymentStatusMessage.title,
        description: paymentStatusMessage.description,
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: paymentStatusMessage.status
      });
    }

    navigate("/");
  }, [paymentStatus, navigate]);

  const tabsTitles = ["Seleccionar doctor", "Seleccionar fecha", "Pagar", "Reservar"];
  const tabContents = [
    <ListDoctors handleSelect={setSelected}/>,
    <ListCalendar doctorSelected={selected}/>,
    <Box>Contenido de la pestaña 3</Box>,
    <Box>Contenido de la pestaña 4</Box>
  ];

  return (
    <Flex bg="#E5F2FA">
      <SidebarMenu/>
      <Box h="100vh" flex={1} py={12} pl={28} pr={10}>
        <TabsConsult tabsTitles={tabsTitles} tabContents={tabContents} />
      </Box>
    </Flex>
    // <Grid
    //   templateRows='repeat(1, 1fr)'
    //   templateColumns='repeat(5, 1fr)'
    //   gap={4}
    // >
    //   <GridItem rowSpan={1} colSpan={{ base: 5, lg: 2 }}>
    //       <label>
    //         Doctores disponibles
    //         <AsyncSelect cacheOptions defaultOptions loadOptions={fetchDoctors} onChange={fetchDataCalendarDoctor}/>
    //       </label>
    //   </GridItem>
    //   <GridItem colSpan={{ base: 5, lg: 3 }}>
    //     {calendarData && <CalendarComponent paymentStatus={paymentStatus} calendarData={calendarData} selectedDoctor={selected} doctorData={doctorData}/>}
    //   </GridItem>
    // </Grid>
  );
}