import { useContext, useEffect, useState } from 'react';
import { Button, Flex, Select, Text, useDisclosure, useToast, SimpleGrid, Box, Heading } from '@chakra-ui/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import TabsConsult from '../components/tabs';
import ListDoctors from '../components/list-doctors';
// import ListCalendar from '../components/list-calendar';
import Payment from '../components/payment';
import { AlertModal } from '../components/alerts';
import { AiOutlinePlus } from 'react-icons/ai'
import FormPatient from '../components/form-patient';
import CardCustom from '../components/card-custom';
import ListSymptoms from '../components/lists-symptoms';
import { AppContext } from '../components/context';
// import Reserved from '../components/reserved';
import ListPatient from '../components/list-patients';
import { HiOutlineBadgeCheck } from 'react-icons/hi';

const StatusMessage = ({text}) => {
  <Flex flex={1} justifyContent="center" alignItems="center" flexDirection="column">
    <HiOutlineBadgeCheck  style={{ width: "36px", height: "36px", color:"#104DBA" }}/>
    <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px">{text}</Text>
  </Flex>
}

export default function Appointment() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const paymentStatus = searchParams.get("status");

  const { user, patients, createPatient } = useContext(AppContext)

  const initialStateTabs = {
    patient: false,
    filter: true,
    symptoms: true,
    reserve: true
  }

  const [activeTab, setActiveTab] = useState(0)
  const [disableTabs, setDisableTabs] = useState(initialStateTabs)
  const [patientSelected, setPatientSelected] = useState({})
  const [symptomsSelected, setSymptomsSelected] = useState([])
  const [doctorSelected, setDoctorSelected] = useState({})
  const [daySelected, setDaySelected] = useState("")
  const [messageStatus, setMessageStatus] = useState("")
  
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
        filter: false
      })
    }
  }

  const handleBackPatient = () => {
    setActiveTab(0)
    setDisableTabs({
      ...disableTabs,
      patient: false,
      filter: true
    })
  }

  const handleNextSymptoms = (values) => {
    setSymptomsSelected(values)
    setActiveTab(2)
    setDisableTabs({
      ...disableTabs,
      symptoms: false
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
        setMessageStatus(paymentStatusMessage.description)
        setActiveTab(3)
        setDisableTabs((prevDisableTabs) => ({
          ...prevDisableTabs,
          reserve: false
        }))
      }
    }
  }, [paymentStatus, navigate, toast]);
 
  const tabsHeading = [
    { title: "Paciente", isDisabled: disableTabs.patient },
    { title: "Filtro", isDisabled: disableTabs.filter },
    { title: "Selección turno", isDisabled: disableTabs.symptoms },
    { title: "Confirmación", isDisabled: disableTabs.reserve }
  ];

  const tabContents = [
    <ListPatient key="first" onNext={handleNextPatient} patients={patients} patientSelected={patientSelected} setPatientSelected={setPatientSelected} onOpenSecond={onOpenSecond} isActive={activeTab === 0}/>,
    <ListDoctors key="second" onBack={handleBackPatient} patientSelected={patientSelected} isActive={activeTab === 1} onNext={handleNextSymptoms} setDoctorSelected={setDoctorSelected} doctorSelected={doctorSelected} daySelected={daySelected} setDaySelected={setDaySelected}/>,
    <ListSymptoms key="third" onNext={handleNextSymptoms} patientSelected={patientSelected} isActive={activeTab === 2} doctorSelected={doctorSelected} daySelected={daySelected} user={user}/>,
    <StatusMessage key="fourth" isActive={activeTab === 3} text={messageStatus}/>
  ];

  return (
    <Flex w={["calc(100% - 60px)", "calc(100% - 155px)"]} h="100%" flexDirection="column" justifyContent="center" alignItems="center">
      <Box maxW={["full", "1240px", "full"]}>
        {/* CONTENT */}
        <Box alignContent="center">
          <Heading
            fontSize="2xl"
            color="#104DBA"
            lineHeight="29.3px"
            mb={6}
          >
            Nuevo turno
          </Heading>
          <TabsConsult
            tabsHeading={tabsHeading}
            tabContents={tabContents}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </Box>
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
      </Box>
    </Flex>
  );
}