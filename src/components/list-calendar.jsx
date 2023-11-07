/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import { instance } from '../utils/axios';
import { Box, Button, Flex, Spinner, Center, Text, Grid } from "@chakra-ui/react";

import { es } from 'date-fns/locale';

import { useCallback, useEffect, useState } from "react";

import {
  format,
  startOfMonth,
  startOfWeek ,
  addMonths,
  subMonths,
  getDaysInMonth,
  isBefore,
  isSameMonth,
  startOfDay, 
  addMinutes,
  setHours
} from "date-fns";
import "../styles/fcalendar.css";
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

const ListCalendar = ({ doctorSelected, onNext, isActive }) => {
  const currentDate = new Date();
  const [currentDateState, setCurrentDateState] = useState(currentDate)

  const daysInMonth = getDaysInMonth(currentDateState)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [calendarEvents, setCalendarEvents] = useState(null)
  const [daySelected, setDaySelected] = useState("")
  const [hsSelected, setHsSelected] = useState(false)
  const [loadingCalendar, setLoadingCalendar] = useState(true)
  const [mapEvents, setMapEvents] = useState([])

  const fetchDataCalendar = useCallback(async () => {
    setLoadingCalendar(true)
    setHsSelected(false)

    try {
      
        const { data } = await instance.get(`/calendars?email=${doctorSelected?.value}`)
    
        setCalendarEvents(data?.data?.items)
        let filters = `{ "email": "${doctorSelected?.value}" }`
        const doctor = await instance.get(`/users?filters=${filters}`)

        setSelectedDoc(doctor?.data?.data[0])
        setLoadingCalendar(false)

      }catch(err) {
        setLoadingCalendar(false)
        throw new Error('Something went wrong to search calendar doctor')
      }
  }, [doctorSelected])

  useEffect(() => {
    const fetchDataCalendars = async () => {
        try {
          await fetchDataCalendar();
        }catch(err){
          console.log(err)
        }
    }
    
    if(doctorSelected && isActive) {
        fetchDataCalendars()
    }
  }, [doctorSelected, isActive, fetchDataCalendar])

  const generateDays = () => {
    const days = [];
    const startOfMonthDate = startOfMonth(currentDateState);
    const startOfWeekDate = startOfWeek(startOfMonthDate); // Obtiene el primer día de la semana
  
    for (let day = 0; day < startOfWeekDate.getDay(); day++) {
      // Rellenar los días previos al primer día del mes
      days.push(
        <div className="empty-day" key={`empty-${day}`}>
          {/* Puedes agregar un espacio o un carácter vacío si lo deseas */}
        </div>
      );
    }
  
    for (let day = 1; day <= daysInMonth; day++) {

      const dayDate = new Date(
        currentDateState.getFullYear(),
        currentDateState.getMonth(),
        day
      );

      const dayName = format(dayDate, "EEEE", { locale: es }).toLowerCase(); // Obtiene el nombre del día en minúsculas
      const isWeekend = dayName === "sábado" || dayName === "domingo"; // Verifica si es fin de semana
      const beforeToday = dayDate < new Date() ; // Verifica si es menor al dia actual
      
      // Agregar la clase "empty-day" si es fin de semana
      const dayClass = isWeekend || beforeToday ? "empty-day" :  "day";

      const formattedDay = day.toString().padStart(2, '0'); // Agregar el cero delante si es necesario
  
      days.push(
        <Box className={dayClass} onClick={isWeekend || beforeToday ? null : () => setDaySelected(dayDate)} key={day}>
          <Text fontSize={["xs", "sm"]} color="#205583" textTransform="uppercase" wordBreak="break-word">{dayName}</Text>
          <Text fontSize={["xl", "2xl", "3xl"]} color="#205583" fontWeight="bold" lineHeight="normal">{formattedDay}</Text>
        </Box>
      );
    }
  
    return days;
  }
  
  const goToPrevMonth = () => {
    const newDate = subMonths(currentDateState, 1);
    if (!isBefore(newDate, currentDate) || isSameMonth(newDate, currentDate)) {
      setCurrentDateState(newDate);
    }
  }

  const goToNextMonth = () => {
    const newDate = addMonths(currentDateState, 1);
    if (!isBefore(newDate, currentDate) || isSameMonth(newDate, currentDate)) {
      setCurrentDateState(newDate);
    }
  }

  useEffect(() => {
    if (daySelected) {
      const eventDivs = [];
      const startTime = setHours(daySelected, 9); // 10 a.m.
      const endTime = setHours(daySelected, 18); // 6 p.m.
  
      let currentTime = startOfDay(daySelected);
  
      while (currentTime < endTime) {
        const eventStartTime = currentTime;
        const eventEndTime = addMinutes(currentTime, selectedDoc?.reserveTime);
  
        let emptyEvent = true; // Suponemos que inicialmente el evento está vacío y disponible
  
        // Verificar si hay un evento en el rango de tiempo actual
        const isEventAvailable = calendarEvents?.some(event => {
          const eventStartDate = new Date(event?.start?.dateTime);
          const eventEndDate = new Date(event?.end?.dateTime);
          return (
            eventStartDate <= eventStartTime && eventEndDate >= eventEndTime
          );
        });
  
        if (isEventAvailable) {
          emptyEvent = false; // Si hay un evento, marcarlo como no disponible
        }
  
        if (eventStartTime >= startTime && eventEndTime <= endTime) {

          eventDivs.push(
            <Box
              px={4}
              py={1}
              onClick={() => {
                if (emptyEvent) {
                  setHsSelected(eventStartTime);
                }
              }}
              className={emptyEvent ? `event ${new Date(hsSelected) === new Date(eventStartTime) && 'selected-event'}` : 'highlighted-event'}
              key={eventStartTime.toISOString()}
            >
              <Text lineHeight="normal" textAlign="center">{format(eventStartTime, 'HH:mm')}</Text>
              {/* Puedes agregar más detalles del evento aquí si es necesario */}
            </Box>
          );
        }
  
        currentTime = addMinutes(currentTime, 15);
      }
  
      setMapEvents(eventDivs);
    }
  }, [daySelected, currentDateState, hsSelected, selectedDoc?.reserveTime, calendarEvents]);

  const handleNextClick = () => {
    if (hsSelected) {
      onNext(hsSelected);
    }
  }

  return (
    <Flex h="100%" maxHeight="100%" flexDirection="column" px={6}>
      {loadingCalendar ? (
        <Center h='100px'>
            <Spinner />
        </Center>
      ) : (
        <Flex flex={1} flexDirection="column" justifyContent="space-between">
            <Box>
              <div className='calendar__header'>
                <button onClick={goToPrevMonth}>
                  <ChevronLeftIcon />
                </button>
                  <span>{format(currentDateState, "MMMM yyyy", { locale: es })}</span>
                <button onClick={goToNextMonth}>
                  <ChevronRightIcon />
                </button>

              </div>
              <Grid templateColumns="repeat(7, 1fr)" gap={2} my={2} overflowX="auto" w="full">
                {generateDays()}
              </Grid>
              {daySelected && (
                <Grid templateColumns={["repeat(12, 1fr)", "repeat(8, 1fr)", "repeat(8, 1fr)", "repeat(8, 1fr)", "repeat(12, 1fr)", "repeat(15, 1fr)"]} gap={2} my={2} overflowX="auto" w="full">
                  {mapEvents && mapEvents.length > 0 && mapEvents?.map(event => event)}
                </Grid>
              )}
            </Box>
            <Flex justifyContent="center" alignItems="flex-end" my={[2, 4]}>
              {hsSelected && (
                <Box>
                  <Box my={2}>
                    <Text textAlign="center" color="#205583">Dia y horario seleccionado:</Text>
                    <Text textAlign="center" color="#205583">{`${format(new Date(hsSelected), "EEEE", { locale: es }).toLowerCase()} ${new Date(hsSelected).getDate()} a las ${format(new Date(hsSelected), 'HH:mm', { locale: es })}hs`}</Text>
                  </Box>
                  <Button
                    bg="#205583" color="#FFFFFF" w={["220px","300px"]} size={["xs", "sm"]}
                    onClick={handleNextClick}
                  >
                    SIGUIENTE
                  </Button>
                </Box>
              )}
            </Flex>
        </Flex>
      )}
    </Flex>
  );
};

ListCalendar.propTypes = {
  doctorSelected: PropTypes.shape({
    value: PropTypes.string
  }),
  onNext: PropTypes.func,
  isActive: PropTypes.bool
}

export default ListCalendar;