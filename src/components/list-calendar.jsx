/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'
import { instance } from '../utils/axios';
import { Box, Button, Flex, Spinner, Center  } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

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

const ListCalendar = ({ doctorSelected, onNext, isActive }) => {
  const currentDate = new Date();
  const [currentDateState, setCurrentDateState] = useState(currentDate)
  console.log("🚀 ~ file: list-calendar.jsx:29 ~ ListCalendar ~ currentDateState:", currentDateState)
  const daysInMonth = getDaysInMonth(currentDateState)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [calendarEvents, setCalendarEvents] = useState(null)
  const [daySelected, setDaySelected] = useState("")
  const [horaSelected, setHoraSelected] = useState(false)
  const [loadingCalendar, setLoadingCalendar] = useState(true)
  const [mapEvents, setMapEvents] =useState([])
  const fetchDataCalendar = useCallback(async () => {
    setLoadingCalendar(true);
    setHoraSelected(false)
    try {
      
        const { data } = await instance.get(`/calendars?email=${doctorSelected?.value}`);
    
        setCalendarEvents(data?.data?.items)
        let filters = `{ "email": "${doctorSelected?.value}" }`
        const doctor = await instance.get(`/users?filters=${filters}`);
        setSelectedDoc(doctor?.data?.data[0]);
        setLoadingCalendar(false);
      }catch(err) {
        setLoadingCalendar(false);
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
        fetchDataCalendars();
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
      
      // Agregar la clase "empty-day" si es fin de semana
      const dayClass = isWeekend ? "empty-day" :  "day";
  
      days.push(
        <div className={dayClass} onClick={() => setDaySelected(dayDate)} key={day}>
          <span className="day-text">{dayName}</span>
          <span className="day-number">{day}</span>
        </div>
      );
    }
  
    return days;
  };
  
  const goToPrevMonth = () => {
    const newDate = subMonths(currentDateState, 1);
    if (!isBefore(newDate, currentDate) || isSameMonth(newDate, currentDate)) {
      setCurrentDateState(newDate);
    }
  };

  const goToNextMonth = () => {
    const newDate = addMonths(currentDateState, 1);
    if (!isBefore(newDate, currentDate) || isSameMonth(newDate, currentDate)) {
      setCurrentDateState(newDate);
    }
  };


  useEffect( () => {
    const eventDivs = [];
    const startTime = setHours(currentDateState, 9); // 10 a.m.
    const endTime = setHours(currentDateState, 18); // 6 p.m.
    const mapDocEvents = calendarEvents?.map(event => event?.start?.dateTime && format(new Date(event?.start?.dateTime), 'HH:mm',  { locale: es }))
    console.log("🚀 ~ file: list-calendar.jsx:127 ~ useEffect ~ mapDocEvents:", mapDocEvents)
    let currentTime = startOfDay(currentDateState);
    
    while (currentTime < endTime) {
      const eventStartTime = currentTime;
      const eventEndTime = addMinutes(currentTime, selectedDoc?.reserveTime);
      let emptyEvent = false; // calcular eventos vacios
      let hor = format(eventStartTime, 'HH:mm',  { locale: es })
      let fecha1 = format(new Date(horaSelected), 'HH:mm',  { locale: es });
      console.log("🚀 ~ file: list-calendar.jsx:137 ~ useEffect ~ fecha1:", fecha1)
      let fecha2 = format(new Date(eventStartTime), 'HH:mm',  { locale: es });
      console.log("🚀 ~ file: list-calendar.jsx:139 ~ useEffect ~ fecha2:", fecha2)
      // Comprobar si el evento está dentro del rango de tiempo deseado (10 a.m. - 6 p.m.)
      if (eventStartTime >= startTime && eventEndTime <= endTime) {
        eventDivs.push(
          <div onClick={()=>setHoraSelected(eventStartTime)} className={mapDocEvents?.includes(hor) ?  'highlighted-event' :  fecha1 === fecha2 ? 'event-active' : "event"} key={eventStartTime.toISOString()}>
            {format(eventStartTime, 'HH:mm')}
            {/* Puedes agregar más detalles del evento aquí si es necesario */}
          </div>
        );
      }

    
      if (emptyEvent) {
        eventDivs.push(
          <div className="empty-event" key={eventStartTime.toISOString()}>
            {format(eventStartTime, 'HH:mm',  { locale: es })}
          </div>
        );
      }
  
      currentTime = addMinutes(currentTime, 15);
    }
    console.log(eventDivs)
    setMapEvents(eventDivs);
  }, [currentDateState, selectedDoc?.reserveTime, calendarEvents, horaSelected])


  const handleNextClick = () => {
    if (horaSelected) {
      onNext(horaSelected);
    }
  }

  return (

    <Flex h="100%" flexDirection="column" px={6}>
      <Box>
        {loadingCalendar && (
        <Center  h='100px' >
            <Spinner />
        </Center>
        )}
        {selectedDoc && (
          <div>
            <div className='calendar__header'>
              <button onClick={goToPrevMonth}>
                <ChevronLeftIcon />
              </button>
                <span>{format(currentDateState, "MMMM yyyy", { locale: es })}</span>
              <button onClick={goToNextMonth}>
                <ChevronRightIcon />
              </button>

            </div>
            <div className="calendar-grid">{generateDays()}</div>
            {daySelected && (
              <div className="event-container">
                {mapEvents && mapEvents.length > 0 && mapEvents?.map(event => event)}
              </div>
            )}
          </div>
        )}
        {!selectedDoc && (
        <div>
          {/*No se pudo obtener la informacion del medico */}
        </div>
        )}
      </Box>
      <Flex flex={1} justifyContent="center" alignItems="flex-end" my={[2, 4]}>
        {horaSelected && (
          <Button
            bg="#205583" color="#FFFFFF" w={["220px","300px"]} size={["xs", "sm"]}
            onClick={handleNextClick}
          >
            SIGUIENTE
          </Button>
        )}
      </Flex>
      {/* <pre>{JSON.stringify(calendarEvents, null, 2)}</pre> */}
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