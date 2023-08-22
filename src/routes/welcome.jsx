import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { instance } from '../utils/axios';
import CalendarComponent from '../components/calendar';
import AsyncSelect from 'react-select/async';

export default function Welcome() {
  const [searchParams] = useSearchParams();
  const currentParams = Object.fromEntries([...searchParams]);
  const { _valid: idUser } = currentParams;

  const [user, setUser] = useState(null);
  const [calendarData, setCalendarData] = useState(null);

  const fetchUser = async (userId) => {
    try {
      const { data } = await instance.get(`/users/${userId}`);
      const response = data;
      if(response.success) {
        localStorage.setItem('user', JSON.stringify(response.data))
        setUser(response.data)
        return response.data
      }
      return null
    }catch(err) {
      console.log('fetch users', err.message)
      throw new Error('Something went wrong to search user')
    }
  }

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
    if(idUser) {
      fetchUser(idUser)
        .then(response => response)
        .catch(err => err.message)
    }

    fetchDoctors()
      .then(response => response)
      .catch(err => err.message)

  }, [searchParams]);

  return (
    <div>
      <h1>Bienvenido {user?.name}</h1>
      <label>
        Selecciona un doctor
        <AsyncSelect cacheOptions defaultOptions loadOptions={fetchDoctors} onChange={fetchDataCalendarDoctor}/>
      </label>
      {calendarData && <CalendarComponent calendarData={calendarData}/>}
    </div>
  );
}