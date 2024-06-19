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
import ListPatient from '../components/list-patients';

export default function Appointment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentStatus = searchParams.get("status");

  const { user, patients, createPatient } = useContext(AppContext)

  const initialStateTabs = {
    patient: false,
    symptoms: true,
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

  const handleNextPatient = () => {
    if(patientSelected?.value) {
      setActiveTab(1)
      setDisableTabs({
        ...disableTabs,
        symptoms: false
      })
    }
  }

  const handleNextSymptoms = (values) => {
    setSymptomsSelected(values)
    setActiveTab(2)
    setDisableTabs({
      ...disableTabs,
      doctors: false
    })
  }

  const handleNextDoctors = (values) => {
    setDoctorSelected(values)
    setActiveTab(3)
    setDisableTabs({
      ...disableTabs,
      days: false
    })
  }

  const handleNextCalendar = (values) => {
    setDaySelected(values)
    setActiveTab(4)
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
    if(paymentStatus && paymentStatus === "approved"){
      setActiveTab(5)
      setDisableTabs((prevDisableTabs) => ({
        ...prevDisableTabs,
        patient: true,
        reserve: false
      }))
    }
  }, [user, activeTab, onOpenFirst, paymentStatus]);
 
  const tabsHeading = [
    { title: "Paciente", isDisabled: disableTabs.patient },
    { title: "Síntomas", isDisabled: disableTabs.symptoms },
    { title: "Seleccionar doctor", isDisabled: disableTabs.doctors },
    { title: "Seleccionar fecha", isDisabled: disableTabs.days }, 
    { title: "Pagar", isDisabled: disableTabs.payment },
    { title: "Reservar", isDisabled: disableTabs.reserve } 
  ];

  const tabContents = [
    <ListPatient key="first" onNext={handleNextPatient} patients={patients} patientSelected={patientSelected} setPatientSelected={setPatientSelected} onOpenSecond={onOpenSecond} isActive={activeTab === 0}/>,
    <ListSymptoms key="second" onNext={handleNextSymptoms} patientSelected={patientSelected} isActive={activeTab === 1}/>,
    <ListDoctors key="third" onNext={handleNextDoctors} patientSelected={patientSelected} isActive={activeTab === 2}/>,
    <ListCalendar key="fourth" doctorSelected={doctorSelected} onNext={handleNextCalendar} isActive={activeTab === 3}/>,
    <Payment key="fifth" symptomsSelected={symptomsSelected} doctorSelected={doctorSelected} patientSelected={patientSelected} selectDay={daySelected} user={user} isActive={activeTab === 4}/>,
    <Reserved key="sixth" isActive={activeTab === 5}/>
  ];

  return (
    <Flex w={["calc(100% - 60px)", "calc(100% - 155px)"]} h="100%" flexDirection="column" justifyContent="center" alignItems="center">
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