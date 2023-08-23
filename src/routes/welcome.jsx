import { useEffect, useState } from 'react';
import { instance } from '../utils/axios';
import CalendarComponent from '../components/calendar';
import AsyncSelect from 'react-select/async';
import { Grid, GridItem } from '@chakra-ui/react';

export default function Welcome() {
  const [calendarData, setCalendarData] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
 
  const fetchDoctors = async () => {
    try {
      const { data } = await instance.get(`/users?filters={"role":"DOCTOR"}`);
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
      setSelectedDoctor(selectedOption)
      try {
        const { data } = await instance.get(`/calendars?email=${selectedOption.value}`);
        setCalendarData(data.data)
      }catch(err) {
        console.log('fetch data calendar doctor', err.message)
        throw new Error('Something went wrong to search calendar doctor')
      }
    }
  }

  useEffect(() => {
    fetchDoctors()
      .then(response => response)
      .catch(err => err.message)

  }, []);

  return (
    <Grid
      minH="100vh"
      templateRows={['1fr 1fr', '1fr', '1fr']}
      templateColumns={['1fr', '1fr', '1fr 1fr 1fr 1fr']}
      gap={4}
    >
      <GridItem rowSpan={2} colSpan={1}>
          <label>
            Doctores disponibles
            <AsyncSelect cacheOptions defaultOptions loadOptions={fetchDoctors} onChange={fetchDataCalendarDoctor}/>
          </label>
      </GridItem>
      <GridItem colSpan={3}>
        {calendarData && <CalendarComponent calendarData={calendarData} selectedDoctor={selectedDoctor} fetchDataCalendarDoctor={fetchDataCalendarDoctor} />}
      </GridItem>
    </Grid>
  );
}
