import { useState, useEffect } from 'react';
import { Box, Button, Text, Grid, Flex } from '@chakra-ui/react';
import { format, getDaysInMonth, addMinutes, setHours, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from 'react-icons/md';

const CustomCalendar = ({ currentDateState, setDaySelected, calendarEvents, selectedDoc, daySelected }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [mapEvents, setMapEvents] = useState({});
  const daysPerPage = 7;

  const generateDays = () => {
    const days = [];
    const today = new Date();
    const currentMonth = currentDateState.getMonth();
    const currentYear = currentDateState.getFullYear();
    const daysInCurrentMonth = getDaysInMonth(currentDateState);

    const startDay = today.getMonth() === currentMonth && today.getFullYear() === currentYear ? today.getDate() : 1;

    // Generar los días restantes del mes actual
    for (let day = startDay; day <= daysInCurrentMonth; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    // Generar los días de los próximos dos meses
    for (let monthOffset = 1; monthOffset <= 2; monthOffset++) {
      const nextMonthDate = new Date(currentYear, currentMonth + monthOffset, 1);
      const daysInNextMonth = getDaysInMonth(nextMonthDate);
      const nextMonth = nextMonthDate.getMonth();
      const nextYear = nextMonthDate.getFullYear();

      for (let day = 1; day <= daysInNextMonth; day++) {
        days.push(new Date(nextYear, nextMonth, day));
      }
    }

    return days;
  };

  const generateEventsForDay = (day) => {
    const eventDivs = [];
    const startTime = setHours(day, selectedDoc?.reserveTimeFrom || 9); // 9 a.m.
    const endTime = setHours(day, selectedDoc?.reserveTimeUntil || 18); // 6 p.m.

    let currentTime = startOfDay(day);

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
          <Button
            my={1}
            px={1}
            onClick={() => {
              if (emptyEvent) {
                setDaySelected(eventStartTime);
              }
            }}
            border="1px"
            borderColor={emptyEvent ? "#104DBA" : "#EEE"}
            bgColor="#FFF"
            borderRadius="xl"
            key={eventStartTime.toISOString()}
            cursor="pointer"
            _active={{ backgroundColor: "#104DBA" }}
            size="xs"
            mx="auto"
            fontWeight={400}
            isDisabled={!emptyEvent}
          >
            <Text lineHeight="normal" textAlign="center" fontSize={["9px", "sm"]}>{format(eventStartTime, 'HH:mm')}</Text>
          </Button>
        );
      }

      currentTime = addMinutes(currentTime, 15);
    }

    return eventDivs;
  };

  useEffect(() => {
    const days = generateDays();
    const events = {};
    days.forEach(day => {
      events[day.toISOString()] = generateEventsForDay(day);
    });
    setMapEvents(events);
  }, [currentDateState, selectedDoc?.reserveTime, calendarEvents]);

  const days = generateDays();
  const totalPages = Math.ceil(days.length / daysPerPage);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const currentDays = days.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  return (
    <Flex justifyContent="space-between" mt={4} alignItems="flex-start">
        <Button onClick={handlePreviousPage} isDisabled={currentPage === 0} rounded="full" size="xs" p={0} bg="#104DBA" color="#FFF" _active={{ bgColor: "#104DBA" }} _hover={{ bgColor: "#104DBA40" }}>
            <MdOutlineNavigateBefore
                style={{ width: "18px", height: "18px" }}
            />
        </Button>
        <Grid templateColumns="repeat(7, 1fr)" my={2} overflow="auto" w="full" maxH={["300px","200px","200px","200px","200px", "200px"]}>
          {currentDays.map(day => {
            const dayName = format(day, "EEEE", { locale: es });
            const dayDate = format(day, "dd", { locale: es });
            const monthName = format(day, "LLL", { locale: es });

            return (
              <Box key={day.toISOString()} textAlign="center">
                <Text fontSize={["xs", "lg"]} fontWeight={500} lineHeight="20px" color="#000" textTransform="uppercase" textAlign="center">{dayName?.slice(0, 3)}</Text>
                <Flex justifyContent="center" gap={1}>
                  <Text fontSize={["9px", "xs"]}>{dayDate}</Text>
                  <Text fontSize={["9px", "xs"]} textTransform="uppercase">{monthName}</Text>
                </Flex>
                {mapEvents[day.toISOString()]}
              </Box>
            )}
          )}
        </Grid>
        <Button onClick={handleNextPage} isDisabled={currentPage === totalPages - 1} rounded="full" size="xs" p={0} bg="#104DBA" color="#FFF" _active={{ bgColor: "#104DBA" }}  _hover={{ bgColor: "#104DBA40" }}>
            <MdOutlineNavigateNext
                style={{ width: "18px", height: "18px" }}
            />
        </Button>
    </Flex>
  );
};

export default CustomCalendar;
