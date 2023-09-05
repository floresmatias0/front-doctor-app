import { useEffect, useState } from 'react';
import { instance } from '../utils/axios';
import CalendarComponent from '../components/calendar';
import AsyncSelect from 'react-select/async';
import { Grid, GridItem } from '@chakra-ui/react';

export default function Welcome() {
  const [calendarData, setCalendarData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [selected, setSelected] = useState(null);
  
  const fetchDoctors = async () => {
    try {
      let filters = '{ "role": "DOCTOR" }'
      const { data } = await instance.get(`/users?filters=${filters}`);
      const response = data;

      if(response.success) {
        let doctors = response.data;
        let auxDoctors = [];

        if(doctors && doctors?.length > 0) {
          for(let i = 0; i < doctors.length; i++) {
            auxDoctors.push({ label: doctors[i].name, value: doctors[i].email })
          }
          return auxDoctors
        }

        return auxDoctors
      }

      return []
    }catch(err) {
      console.log('fetch doctors', err.message)
      throw new Error('Something went wrong to search doctors')
    }
  }

  const fetchDataCalendarDoctor = async (selectedOption) => {
    if (selectedOption) {
      setSelected(selectedOption)
      try {
        const { data } = await instance.get(`/calendars?email=${selectedOption.value}`);
        setCalendarData(data.data)
        let filters = `{ "email": "${selectedOption.value}" }`
        const doctor = await instance.get(`/users?filters=${filters}`);
        setDoctorData(doctor?.data?.data[0])
      }catch(err) {
        console.log('fetch data calendar doctor', err.message)
        throw new Error('Something went wrong to search calendar doctor')
      }
    }
  }

  useEffect(() => {
    const fetchDataDoctors = async () => {
      try {
        await fetchDoctors();
      }catch(err){
        console.log(err)
      }
    }

    fetchDataDoctors();
  }, []);

  return (
    <Grid
      minH="100vh"
      templateRows='repeat(1, 1fr)'
      templateColumns='repeat(5, 1fr)'
      gap={4}
    >
      <GridItem rowSpan={1} colSpan={{ base: 5, lg: 1 }}>
          <label>
            Doctores disponibles
            <AsyncSelect cacheOptions defaultOptions loadOptions={fetchDoctors} onChange={fetchDataCalendarDoctor}/>
          </label>
      </GridItem>
      <GridItem colSpan={{ base: 5, lg: 4 }}>
        {calendarData && <CalendarComponent calendarData={calendarData} selectedDoctor={selected} fetchDataCalendarDoctor={fetchDataCalendarDoctor} doctorData={doctorData}/>}
      </GridItem>
    </Grid>
  );
}