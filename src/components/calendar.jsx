import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from '@fullcalendar/timegrid';
import esLocale from "@fullcalendar/core/locales/es";
import { instance } from "../utils/axios";

import '../styles/calendar.css';
import { Box, useDisclosure, useToast } from "@chakra-ui/react";
import { TransitionExample } from "./alerts";
import { initMercadoPago } from "@mercadopago/sdk-react";

export const getFormattedDateTime = (dateTimeStr, options) => {
    const dateTime = new Date(dateTimeStr);
    return dateTime.toLocaleString('es', options);
}

export default function CalendarComponent({ calendarData, selectedDoctor }) {
    const [user, setUser] = useState(null)
    const [events, setEvents] = useState([])
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [preferenceId, setPreferenceId] = useState(null)

    const toast = useToast()
    const calendarRef = useRef(null);

    initMercadoPago("APP_USR-c5b986a0-6449-40f2-9960-87844a45305e", {locale: 'es-AR'});

    useEffect(() => {
        let userLogged = localStorage.getItem('user');
        if(userLogged) {
            let parseUser = JSON.parse(userLogged);
            setUser(parseUser);
        }
    }, [])

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
    }, [calendarData])
    
    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleDateSelect = (selectInfo) => {

        if(selectInfo?.view?.type === "dayGridMonth") {
            return calendarRef.current.getApi().changeView('timeGridDay', new Date(selectInfo.start));
        }

        const selectedDate = selectInfo.start

        if(new Date(selectedDate) <= new Date()) {
            return toast({
                title: 'Fecha no disponible',
                position: 'top-right',
                isClosable: true,
                duration: 6000,
                status: 'warning'
            })
        }

        const isDateOccupied = events.some(event => {
            const eventStart = new Date(event.start)
            const eventEnd = new Date(event.end)
    
            return (
                selectedDate >= eventStart && selectedDate < eventEnd ||
                selectedDate <= eventStart && selectedDate >= eventStart.setMinutes(eventStart.getMinutes() - 15)
            );
        });

        if (isDateOccupied) {
            return toast({
                title: 'Fecha no disponible',
                position: 'top-right',
                isClosable: true,
                duration: 6000,
                status: 'warning'
            })
        }

        onOpen();
        return setSelectedEvent(selectInfo);
    };

    const handleClose = () => {
        onClose()
        setPreferenceId(null)
    };

    const confirmReserve = async () => {
        try {
            setConfirmLoading(true)
            const payment = await instance.post('/payments/create', {
                user_email: selectedDoctor.value,
                patient_email: user?.email,
                startDateTime: selectedEvent.startStr,
                endDateTime: selectedEvent.endStr,
                unit_price: 500
            });
            const { id } = payment.data.data;

            setPreferenceId(id)
            setConfirmLoading(false)
        }catch(err) {
            console.log(err.message)
        }
    }
    
    const alertBody = selectedEvent
        ? `Para reservar el día
        ${getFormattedDateTime(
            selectedEvent.startStr,
            { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
        )} de
        ${getFormattedDateTime(
            selectedEvent.startStr,
            { hour: 'numeric', minute: 'numeric' }
        )} a
        ${getFormattedDateTime(
            selectedEvent.endStr,
            { hour: 'numeric', minute: 'numeric' }
        )}hs.
        Tienes que abonarlo
        ¿Quieres continuar?`
        : '';

    const handleControlEventDate = (e) => {
        if(user?.email === selectedDoctor?.value) {
            return e.title
        }

        return 'Turno reservado'
    }

    const shouldApplyAvailableClass = (slotInfo) => {
        const currentDateTime = new Date();
        const slotDateTime = slotInfo.date;

        return slotDateTime === currentDateTime && slotDateTime.getHours() < currentDateTime.getHours();
    };

    return (
        <Box w="100%">
            <Box maxW="480px" mx="auto">
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: '',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    initialView='dayGridMonth'
                    allDaySlot={false}
                    selectable={true}
                    weekends={false}
                    locales={[esLocale]}
                    locale="es"
                    events={events}
                    eventContent={handleControlEventDate}
                    select={handleDateSelect}
                    validRange={{
                        start: new Date()
                    }}
                    slotMinTime="10:00:00"
                    slotMaxTime="19:00:00"
                    slotDuration="00:15:00"
                    slotLabelInterval={{ hours: 1 }}
                    views={{
                        timeGridDay: {
                            dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' },
                            slotLabelContent: (slotInfo) => {
                                const hour = slotInfo.date.getHours();
                                return `${hour}hs`;
                            }
                        },
                        timeGridWeek: {
                            slotLabelContent: (slotInfo) => {
                                const hour = slotInfo.date.getHours();
                                return `${hour}hs`;
                            }
                        },
                    }}
                    slotLaneClassNames={(slotInfo) => {
                        if(slotInfo?.view?.type === "timeGridDay") {
                            return shouldApplyAvailableClass(slotInfo) ? 'available-slot' : '';
                        }
                    }}
                />
            </Box>
            
            <TransitionExample
                onClose={handleClose}
                isOpen={isOpen}
                onConfirm={confirmReserve}
                alertHeader="Reserva"
                alertBody={alertBody}
                textButtonCancel="CANCELAR"
                textButtonConfirm="ACEPTAR"
                isLoading={confirmLoading}
                preferenceId={preferenceId}
                onConfirmPay={confirmReserve}
            />
        </Box>
    );
}