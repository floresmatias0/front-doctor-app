/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {instance} from '../utils/axios';
import { Box } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
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
  isWithinInterval,
  setHours
} from "date-fns";
import "../styles/fcalendar.css"; // Importa tu archivo de estilos CSS

const ListCalendar = ({ doctorSelected }) => {
  console.log("🚀 ~ file: list-calendar.jsx:19 ~ ListCalendar ~ doctorSelected:", doctorSelected)
  const currentDate = new Date();
  const [currentDateState, setCurrentDateState] = useState(currentDate); // Estado para almacenar la fecha actual
  const daysInMonth = getDaysInMonth(currentDateState);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [calendarEvents, setCalendarEvents] = useState(null)
  
  console.log('calendars',calendarEvents)
    useEffect(() => {

      const fetchDataCalendar = async () => {
        try {
            const { data } = await instance.get(`/calendars?email=${doctorSelected.value}`);
        
            setCalendarEvents(data?.data?.items)
            let filters = `{ "email": "${doctorSelected.value}" }`
            const doctor = await instance.get(`/users?filters=${filters}`);
            console.log(doctor?.data?.data[0])
            setSelectedDoc(doctor?.data?.data[0])
          }catch(err) {
            throw new Error('Something went wrong to search calendar doctor')
          }
      }
        const fetchDataCalendars = async () => {
            try {
              await fetchDataCalendar();
            }catch(err){
              console.log(err)
            }
        }
      
        if(doctorSelected) {
            fetchDataCalendars();
        }
    }, [doctorSelected])

  // Función para generar los días del mes actual
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
      const dayName = format(dayDate, "EEEE"); // Obtiene el nombre del día
      const isWeekend =
        dayName === "Saturday" || dayName === "Sunday"; // Verifica si es fin de semana
  
      // Agregar la clase "empty-day" si es fin de semana
      const dayClass = isWeekend ? "empty-day" : "day";
  
      days.push(
        <div className={dayClass} key={day}>
          <span className="day-name">{dayName}</span>
          <span className="day-number">{day}</span>
        </div>
      );
    }
  
    return days;
  };
  

  // Función para cambiar al mes anterior
  const goToPrevMonth = () => {
    const newDate = subMonths(currentDateState, 1);
    if (!isBefore(newDate, currentDate) || isSameMonth(newDate, currentDate)) {
      setCurrentDateState(newDate);
    }
  };

  // Función para cambiar al mes siguiente
  const goToNextMonth = () => {
    const newDate = addMonths(currentDateState, 1);
    if (!isBefore(newDate, currentDate) || isSameMonth(newDate, currentDate)) {
      setCurrentDateState(newDate);
    }
  };
  const generateEventDivs = () => {
    const eventDivs = [];
    const startTime = setHours(currentDateState, 9); // 10 a.m.
    const endTime = setHours(currentDateState, 17); // 6 p.m.
    let currentTime = startOfDay(currentDateState);
    
    while (currentTime < endTime) {
      const eventStartTime = currentTime;
      const eventEndTime = addMinutes(currentTime, selectedDoc?.reserveTime);
  
      // Comprobar si el evento está dentro del rango de tiempo deseado (10 a.m. - 6 p.m.)
      if (eventStartTime >= startTime && eventEndTime <= endTime) {
        eventDivs.push(
          <div className="event" key={eventStartTime.toISOString()}>
            {format(eventStartTime, 'HH:mm')} - {format(eventEndTime, 'HH:mm')}
            {/* Puedes agregar más detalles del evento aquí si es necesario */}
          </div>
        );
      }
  
      currentTime = addMinutes(currentTime, 15);
    }
  
    return eventDivs;
  };

  const events = generateEventDivs();

  return (
    <Box>
      {selectedDoc && (
      <div>
        <div className='calendar__header'>
          <button onClick={goToPrevMonth}>
          <ChevronLeftIcon />
          </button>
          <span>{format(currentDateState, "MMMM yyyy")}</span>
          <button onClick={goToNextMonth}>
          <ChevronRightIcon />
          </button>
        </div>
        <div className="calendar-grid">{generateDays()}</div>
        <div className="event-container">
          {events.map(event => event)}
        </div>
      </div>
      )}
      {!selectedDoc && (
      <div>
        {/*No se pudo obtener la informacion del medico */}
      </div>
      )}
    </Box>
  );
};

export default ListCalendar;




 // const [selectedDate, setSelectedDate] = useState(null);

    // const handleDateClick = (date) => {
    //   setSelectedDate(date);
    // };

    // const fetchDataCalendar = async () => {
    //     try {
    //       const { data } = await instance.get(`/calendars?email=${doctorSelected.value}`);
    //       console.log({data})
    //       // setCalendarData(data.data)
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