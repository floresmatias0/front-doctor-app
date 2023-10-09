import { useEffect, useState } from 'react';
import { instance } from '../utils/axios';
import { Button, Flex, Select, SimpleGrid, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SidebarMenu from '../components/sidebar-menu';
import { Box } from '@chakra-ui/react'
import TabsConsult from '../components/tabs';
import ListDoctors from '../components/list-doctors';
import ListCalendar from '../components/list-calendar';
import Payment from '../components/payment';
import { AlertModal } from '../components/alerts';
import { AiOutlinePlus } from 'react-icons/ai'
import FormPatient from '../components/form-patient';
import CardCustom from '../components/card-custom';

export default function Welcome() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentStatus = searchParams.get("status");

  const [selected, setSelected] = useState(null)
  const [activeTab, setActiveTab] = useState(0)
  const [user, setUser] = useState(null)
  const [patients, setPatients] = useState([])
  const [patientSelected, setPatientSelected] = useState({})

  const handleSelectDoctor = (doctor, index) => {
    setSelected(doctor)
    setActiveTab(index)
  }

  const toast = useToast()

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

    navigate("/");
  }, [paymentStatus, navigate]);

  useEffect(() => {
    let userLogged = localStorage.getItem('user');
    if(userLogged) {
        let parseUser = JSON.parse(userLogged);
        setUser(parseUser);
    }
  }, [])

  // Alert
  // Estado para el primer AlertModal
  const { isOpen: isOpenFirst, onOpen: onOpenFirst, onClose: onCloseFirst } = useDisclosure();
  
  // Estado para el segundo AlertModal
  const { isOpen: isOpenSecond, onOpen: onOpenSecond, onClose: onCloseSecond } = useDisclosure();

  const fetchPatients = async () => {
    try {
      let filters = `{ "userId": "${user._id}" }`
      const { data } = await instance.get(`/patients?filters=${filters}`);
      const response = data;

      if(response.success) {
        let patients = response.data;

        return setPatients(patients)
      }

      setPatients([])
    }catch(err) {
      console.log('fetch patients', err.message)
      throw new Error('Something went wrong to search patients')
    }
  }

  const createPatient = async(values, actions) => {
    try {
      await instance.post('/patients', { ...values, userId: user?._id })
      actions.setSubmitting(false)
      actions.resetForm()

      toast({
        title: "Paciente creado",
        description: "Haz agregado un nuevo paciente a tu cuenta",
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: "success"
      });

      onCloseSecond()
      await fetchPatients();
    }catch(err) {
      console.log(err.message)
      toast({
        title: "Error inesperado",
        description: "Hubo un error al intentar agregar un nuevo paciente",
        position: "top-right",
        isClosable: true,
        duration: 6000,
        status: "error"
      });
    }
  }

  const handleSelectPatient = (patient) => {
    setPatientSelected(patient)
    onCloseFirst()
  }

  useEffect(() => {
    const fetchDataPatients = async () => {
      try {
        if(user) {
          await fetchPatients()
        }
      }catch(err){
        console.log(err)
      }
    }
    
    fetchDataPatients()
    onOpenFirst()
  }, [user]);
 
  const tabsTitles = ["Seleccionar doctor", "Seleccionar fecha", "Pagar", "Reservar"];
  const tabContents = [
    <ListDoctors handleSelect={handleSelectDoctor}/>,
    <ListCalendar doctorSelected={selected}/>,
    <Payment/>,
    <Box>Contenido de la pestaña 4</Box>
  ];

  return (
    <Flex bg="#E5F2FA">
      <SidebarMenu/>
      <Box h="100vh" flex={1} py={12} pl={28} pr={10}>
        <Flex justifyContent="space-between" alignItems="center" my={2}>
          <Text color="#205583" fontSize="lg" fontWeight="bold">Solicitar un turno médico</Text>
          <Select w="250px" bg="#FFFFFF" placeholder='Selecciona un paciente' onChange={handleSelectPatient} value={patientSelected}>
            {patients.map((patient, idx) => (
              <option key={idx} value={patient}>{patient.name}</option>
            ))}
          </Select>
        </Flex>
        <TabsConsult
          tabsTitles={tabsTitles}
          tabContents={tabContents}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </Box>
      <AlertModal
        isOpen={isOpenFirst}
        alertHeader="¿Para quien desea solicitar un turno?"
        alertBody={
          <SimpleGrid templateColumns='repeat(2, 1fr)' gap={4}>
            {patients.map((patient, idx) => (
              <CardCustom
                key={idx}
                heading={patient.name}
                handleSelect={() => handleSelectPatient(patient)}
                name={patient.name}
                description={`DNI ${patient.dni}`}
                avatarSize="sm"
              />
            ))}
          </SimpleGrid>
        }
        isLoading={false}
        customButtonCancel={
          <Button leftIcon={<AiOutlinePlus />} onClick={() => onOpenSecond()}>Crear nuevo paciente</Button>
        }
      />
      <AlertModal
        onClose={() => onCloseSecond()}
        isOpen={isOpenSecond}
        alertHeader="Nuevo paciente"
        alertBody={<FormPatient handleSubmit={createPatient}/>}
        isLoading={false}
      />
    </Flex>
  );
}