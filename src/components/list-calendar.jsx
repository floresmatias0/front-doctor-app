import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { instance } from "../utils/axios";


const ListCalendar = ({doctorSelected}) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateClick = (date) => {
      setSelectedDate(date);
    };

    const fetchDataCalendar = async () => {
        try {
          const { data } = await instance.get(`/calendars?email=${doctorSelected.value}`);
          console.log({data})
          setCalendarData(data.data)
        //   let filters = `{ "email": "${doctorSelected.value}" }`
        //   const doctor = await instance.get(`/users?filters=${filters}`);
        //   setDoctorData(doctor?.data?.data[0])
        }catch(err) {
          throw new Error('Something went wrong to search calendar doctor')
        }
    }

    useEffect(() => {
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

    return (
        <Box>
            <Text>Calendario</Text>

        </Box>
    )
}

export default ListCalendar