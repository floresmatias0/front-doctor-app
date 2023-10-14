import { useCallback, useEffect, useState } from 'react';
import { instance } from '../utils/axios';
import { Button, Flex, Select, Text, useDisclosure, useToast } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TabsConsult from '../components/tabs';
import ListDoctors from '../components/list-doctors';
import ListCalendar from '../components/list-calendar';
import Payment from '../components/payment';
import { AlertModal } from '../components/alerts';
import { AiOutlinePlus } from 'react-icons/ai'
import FormPatient from '../components/form-patient';
import CardCustom from '../components/card-custom';
import ListSymptoms from '../components/lists-symptoms';
import Reserve from '../components/reserve';

export default function Appointment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentStatus = searchParams.get("status");

  const [user, setUser] = useState(null)
  const [patients, setPatients] = useState([])

  const initialStateTabs = {
    symptoms: false,
    doctors: true,
    days: true,
    payment: true,
    reserve: true
  }

  const [activeTab, setActiveTab] = useState(0)
  const [disableTabs, setDisableTabs] = useState(initialStateTabs)
  const [patientSelected, setPatientSelected] = useState({})
  const [symptomsSelected, setSymptomsSelected] = useState([])
  const [doctorSelected, setDoctorSelected] = useState(null)
  const [daySelected, setDaySelected] = useState(null)
  
  const toast = useToast()

  // Estado para el primer AlertModal
  const { isOpen: isOpenFirst, onOpen: onOpenFirst, onClose: onCloseFirst } = useDisclosure()
  
  // Estado para el segundo AlertModal
  const { isOpen: isOpenSecond, onOpen: onOpenSecond, onClose: onCloseSecond } = useDisclosure()

  const handleSelectPatient = (patient) => {
    setPatientSelected(patient)
    isOpenFirst && onCloseFirst()
  }

  const fetchPatients = useCallback(async () => {
    try {
      let filters = `{ "userId": "${user._id}" }`
      const { data } = await instance.get(`/patients?filters=${filters}`);
      const response = data;

      if(response.success) {
        let patients = response.data;
        let transformPatients = patients.map(patient => ({ value: patient.dni, label: patient.name }))

        return setPatients(transformPatients)
      }

      setPatients([])
    }catch(err) {
      console.log('fetch patients', err.message)
      throw new Error('Something went wrong to search patients')
    }
  }, [user])

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

  const handleNextSymptoms = (values) => {
    setSymptomsSelected(values)
    setActiveTab(1)
    setDisableTabs({
      ...disableTabs,
      doctors: false
    })
  }

  const handleNextDoctors = (values) => {
    setDoctorSelected(values)
    setActiveTab(2)
    setDisableTabs({
      ...disableTabs,
      days: false
    })
  }

  const handleNextCalendar = (values) => {
    setDaySelected(values)
    setActiveTab(3)
    setDisableTabs({
      ...disableTabs,
      payment: false
    })
  }

  useEffect(() => {
    if(paymentStatus) {
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
    }
  }, [paymentStatus, navigate, toast]);

  useEffect(() => {
    let userLogged = localStorage.getItem('user');
    if(userLogged) {
        let parseUser = JSON.parse(userLogged);
        setUser(parseUser);
    }
  }, [])

  useEffect(() => {
    const fetchDataPatients = async () => {
      try {
        await fetchPatients()
      }catch(err){
        console.log(err)
      }
    }
    
    if(!paymentStatus && user && activeTab === 0) {
      fetchDataPatients()
      onOpenFirst()
    }
    if(paymentStatus && paymentStatus === "approved"){
      setActiveTab(4)
      setDisableTabs((prevDisableTabs) => ({
        ...prevDisableTabs,
        symptoms: true,
        reserve: false
      }))
    }
  }, [user, fetchPatients, activeTab, onOpenFirst, paymentStatus]);
 
  const tabsHeading = [
    { title: "Síntomas", isDisabled: disableTabs.symptoms },
    { title: "Seleccionar doctor", isDisabled: disableTabs.doctors },
    { title: "Seleccionar fecha", isDisabled: disableTabs.days }, 
    { title: "Pagar", isDisabled: disableTabs.payment },
    { title: "Reservar", isDisabled: disableTabs.reserve } 
  ];

  const tabContents = [
    <ListSymptoms key="first" onNext={handleNextSymptoms} isActive={activeTab === 0}/>,
    <ListDoctors key="second" onNext={handleNextDoctors} isActive={activeTab === 1}/>,
    <ListCalendar key="third" doctorSelected={doctorSelected} onNext={handleNextCalendar} isActive={activeTab === 2}/>,
    <Payment key="fourth" doctorSelected={doctorSelected} patientSelected={patientSelected} selectDay={daySelected} user={user} isActive={activeTab === 3}/>,
    <Reserve key="fifth" isActive={activeTab === 4}/>
  ];

  return (
    <Flex w="100%" h="100%" px={[0, 2]} flexDirection="column">
      {/* HEADER */}
      <Flex w="100%" justifyContent="space-between" alignItems="center" flexDirection={["column", "row"]} my={2}>
        <Text color="#205583" fontSize={["md", "lg"]} fontWeight="bold">Solicitar un turno médico</Text>
        <Select
          w={["auto", "250px"]}
          h={["28px", "36px"]}
          bg="#FFFFFF"
          placeholder='Selecciona un paciente'
          value={patientSelected.value}
          onChange={(e) => {
            const selected = patients.find((patient) => patient.value === e.target.value);
            setPatientSelected(selected);
          }}
          fontSize={["sm", "md"]}
        >
          {patients.map((patient, idx) => (
            <option key={idx} value={patient.value}>{patient.label}</option>
          ))}
        </Select>
      </Flex>
      {/* CONTENT */}
      <TabsConsult
        tabsHeading={tabsHeading}
        tabContents={tabContents}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* FORMS */}
      <AlertModal
        isOpen={isOpenFirst}
        alertHeader="¿Para quien desea solicitar un turno?"
        alertBody={
          <Flex flexDirection={["column", "row"]} flexWrap={["wrap", "no-wrap"]} gap={4}>
            {patients.map((patient, idx) => (
              <CardCustom
                key={idx}
                heading={patient.label}
                handleSelect={() => handleSelectPatient(patient)}
                name={patient.label}
                description={`DNI ${patient.value}`}
                avatarSize="sm"
                width="190px"
              />
            ))}
          </Flex>
        }
        isLoading={false}
        customButtonCancel={
          <Button size={["sm", "md"]} leftIcon={<AiOutlinePlus />} onClick={() => onOpenSecond()}>Crear nuevo paciente</Button>
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