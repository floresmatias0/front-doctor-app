import { useEffect, useState } from 'react';
import { instance } from '../utils/axios';
import CalendarComponent from '../components/calendar';
import AsyncSelect from 'react-select/async';
import { Grid, GridItem, useToast } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Welcome() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentStatus = searchParams.get("status");

  const [calendarData, setCalendarData] = useState(null);
  const [doctorData, setDoctorData] = useState(null);
  const [selected, setSelected] = useState(null);
  
  const toast = useToast()

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

  useEffect(() => {
    const paymentStatusMessages = {
      approved: {
        title: "Reserva creada",
        description: "Tu reserva ha sido creada exitosamente.",
        status: "success",
      },
      pending: {
        title: "Pago pendiente",
        description: "Tu pago está pendiente de confirmación.",
        status: "info",
      },
      failed: {
        title: "Pago fallido",
        description: "Tu pago ha fallado. Por favor, inténtalo nuevamente.",
        status: "error",
      },
    };
    
    const paymentStatusMessage = paymentStatusMessages[paymentStatus];
    
    if (paymentStatusMessage) {
      toast({
        title: paymentStatusMessage.title,
        description: paymentStatusMessage.description,
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: paymentStatusMessage.status
      });
    }
    
    // Después de mostrar el toast, puedes redirigir al usuario a otra página si es necesario.
    // Por ejemplo, para evitar que el usuario vea el estado del pago en la URL después de mostrar el toast.
    navigate("/"); // Cambia la ruta según tus necesidades.
}, [paymentStatus, navigate]);

  return (
    <Grid
      templateRows='repeat(1, 1fr)'
      templateColumns='repeat(5, 1fr)'
      gap={4}
    >
      <GridItem rowSpan={1} colSpan={{ base: 5, lg: 2 }}>
          <label>
            Doctores disponibles
            <AsyncSelect cacheOptions defaultOptions loadOptions={fetchDoctors} onChange={fetchDataCalendarDoctor}/>
          </label>
      </GridItem>
      <GridItem colSpan={{ base: 5, lg: 3 }}>
        {calendarData && <CalendarComponent paymentStatus={paymentStatus} calendarData={calendarData} selectedDoctor={selected} doctorData={doctorData}/>}
      </GridItem>
    </Grid>
  );
}