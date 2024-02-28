import { useContext, useEffect, useState } from 'react';
import { Button, Flex, Select, Text, useDisclosure, useToast, SimpleGrid } from '@chakra-ui/react';
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
import { AppContext } from '../components/context';
import Reserved from '../components/reserved';

export default function Appointment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentStatus = searchParams.get("status");

  const { user, patients, createPatient } = useContext(AppContext)

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
    if(!paymentStatus && user && activeTab === 0) {
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
  }, [user, activeTab, onOpenFirst, paymentStatus]);
 
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
    <Payment key="fourth" symptomsSelected={symptomsSelected} doctorSelected={doctorSelected} patientSelected={patientSelected} selectDay={daySelected} user={user} isActive={activeTab === 3}/>,
    <Reserved key="fifth" isActive={activeTab === 4}/>
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
            const selected = patients.find((patient) => parseInt(patient.value) === parseInt(e.target.value));
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
          <SimpleGrid flex={1} columns={[1, 2]} spacingX='40px' spacingY='10px'>
            {patients.map((patient, idx) => (
              <CardCustom
                key={idx}
                heading={patient.label}
                handleSelect={() => handleSelectPatient(patient)}
                name={patient.label}
                description={`DNI ${patient.value}`}
                avatarSize="sm"
                width="100%"
                height="100%"
              />
            ))}
          </SimpleGrid>
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
        alertBody={<FormPatient handleSubmit={(values) => createPatient(values, onCloseSecond)}/>}
        isLoading={false}
      />
    </Flex>
  );
}