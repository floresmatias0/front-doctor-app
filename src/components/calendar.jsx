import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from "@fullcalendar/core/locales/es"; // Importa el idioma español
import { instance } from "../utils/axios";

import '../styles/calendar.css';

export default function CalendarComponent({ calendarData }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        let userLogged = localStorage.getItem('user');
        if(userLogged) {
            let parseUser = JSON.parse(userLogged);
            setUser(parseUser);
        }
    }, []);

    useEffect(() => {
        if (calendarData && calendarData.items && calendarData.items.length > 0) {
            let events = [];

            calendarData.items.forEach((event) => {
                if (event.start && event.start.dateTime) {
                    events.push({
                        id: event.id,
                        title: event.summary ?? "",
                        start: new Date(event.start.dateTime).toISOString(),
                        end: new Date(event.end.dateTime).toISOString(),
                    });
                }
            });

            setEvents(events)
        }
    }, [calendarData]);

    const handleEventSelect = (info) => {
        setSelectedEvent(info.event);
    };

    const handleDateSelect = async (selectInfo) => {
        console.log({selectInfo})
          
        return await instance.post('/calendars/create-event', {
            doctorEmail: 'floresmatias0@gmail.com',
            patientEmail: user?.email,
            title: 'Evento de prueba',
            startDateTime: selectInfo.startStr,
            endDateTime: selectInfo.endStr
        });
    };
      
    return (
        <div>
            <h2>Calendario de Eventos</h2>

            <div style={{ height: 600, width: 800 }}>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'timeGridDay'
                    }}
                    initialView='timeGridDay'
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    weekends={false}
                    locales={[esLocale]}
                    locale="es"
                    events={events}
                    eventContent={({ event }) => (
                        <div>
                            <p>{event.title}</p>
                        </div>
                    )}
                    eventClick={handleEventSelect}
                    select={handleDateSelect}
                    validRange={{
                        start: new Date(),
                    }}
                    slotMinTime={"10:00:00"}
                    slotMaxTime={"23:00:00"}
                />
            </div>

            {selectedEvent && (
                <div>
                    <h2>Evento Seleccionado</h2>
                    <p>{selectedEvent.title}</p>
                </div>
            )}
        </div>
    );
}
