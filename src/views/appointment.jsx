import { useContext, useEffect, useState } from "react";
import {
  Button,
  Flex,
  Text,
  useDisclosure,
  useToast,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TabsConsult from "../components/tabs";
import ListDoctors from "../components/list-doctors";
import { AlertModal } from "../components/alerts";
import FormPatient from "../components/form-patient";
import ListSymptoms from "../components/lists-symptoms";
import { AppContext } from "../components/context";
import ListPatient from "../components/list-patients";
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { MdOutlineErrorOutline } from "react-icons/md";

const StatusMessage = ({ text, status = "approved", backAction }) => {
  return (
    <Flex
      flex={1}
      justifyContent="center"
      alignItems="flex-start"
      flexDirection="column"
      px={[4, 20]}
      mt={[4, 0]}
      h="full"
    >
      {status === "approved" ? (
        <HiOutlineBadgeCheck
          style={{ width: "36px", height: "36px", color: "#104DBA" }}
        />
      ) : (
        <MdOutlineErrorOutline
          style={{ width: "36px", height: "36px", color: "red" }}
        />
      )}
      <Text
        color="#104DBA"
        fontSize={["26px", "2xl"]}
        fontWeight={700}
        textOverflow="wrap"
        lineHeight={["30.47px", "35.16px"]}
        my={[4, 2]}
      >
        {text}
      </Text>
      <Flex justifyContent="flex-end" w="full">
        <Button
          bg="#104DBA"
          color="#FFFFFF"
          w="222px"
          size={["xs", "sm"]}
          onClick={backAction}
          fontSize="16px"
          fontWeight={500}
          mx={["auto", 0]}
        >
          SOLICITAR NUEVO TURNO
        </Button>
      </Flex>
    </Flex>
  );
};

export default function Appointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentStatus = searchParams.get("status");

  const { user, patients, createPatient } = useContext(AppContext);

  const initialStateTabs = {
    patient: false,
    filter: true,
    symptoms: true,
    reserve: true,
  };

  const [slider, setSlider] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [disableTabs, setDisableTabs] = useState(initialStateTabs);
  const [patientSelected, setPatientSelected] = useState({});
  const [symptomsSelected, setSymptomsSelected] = useState([]);
  const [doctorSelected, setDoctorSelected] = useState({});
  const [daySelected, setDaySelected] = useState("");
  const [messageStatus, setMessageStatus] = useState("");

  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleNextPatient = () => {
    if (patientSelected?.value) {
      setActiveTab(1);
      slider?.slickNext();
      setDisableTabs({
        ...disableTabs,
        filter: false,
      });
    }
  };

  const handleBackPatient = () => {
    setActiveTab(0);
    slider?.slickPrev();
    setDisableTabs({
      ...disableTabs,
      patient: false,
      filter: true,
    });
  };

  const handleNextSymptoms = (values) => {
    setSymptomsSelected(values);
    setActiveTab(2);
    slider?.slickNext();
    setDisableTabs({
      ...disableTabs,
      symptoms: false,
    });
  };

  const handleTryAgain = () => {
    setPatientSelected({});
    setSymptomsSelected([]);
    setDoctorSelected({});
    setDaySelected("");
    setMessageStatus("");
    setActiveTab(0);
    slider?.slickGoTo(0);
    setDisableTabs(initialStateTabs);
    const cleanUrl = window.location.origin + window.location.pathname;
    window.location.href = cleanUrl;
  };

  useEffect(() => {
    if (paymentStatus) {
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
        rejected: {
          title: "No pudimos procesar tu pago",
          description:
            "No pudimos procesar tu pago. Por favor, inténtalo nuevamente.",
          status: "error",
        },
        failed: {
          title: "Pago fallido",
          description: "Tu pago ha fallado. Por favor, inténtalo nuevamente.",
          status: "error",
        },
      };

      const paymentStatusMessage = paymentStatusMessages?.[paymentStatus];

      if (paymentStatusMessage) {
        setMessageStatus(paymentStatusMessage.description);
        setActiveTab(3);
        slider?.slickGoTo(3);
        setDisableTabs((prevDisableTabs) => ({
          ...prevDisableTabs,
          reserve: false,
        }));
      }
    }
  }, [paymentStatus, navigate, toast]);

  const tabsHeading = [
    { title: "Paciente", isDisabled: disableTabs.patient },
    { title: "Filtro", isDisabled: disableTabs.filter },
    { title: "Selección turno", isDisabled: disableTabs.symptoms },
    { title: "Confirmación", isDisabled: disableTabs.reserve },
  ];

  const tabContents = [
    <ListPatient
      key="first"
      onNext={handleNextPatient}
      patients={patients}
      patientSelected={patientSelected}
      setPatientSelected={setPatientSelected}
      onOpenForm={onOpen}
      isActive={activeTab === 0}
    />,
    <ListDoctors
      key="second"
      onBack={handleBackPatient}
      patientSelected={patientSelected}
      isActive={activeTab === 1}
      onNext={handleNextSymptoms}
      setDoctorSelected={setDoctorSelected}
      doctorSelected={doctorSelected}
      daySelected={daySelected}
      setDaySelected={setDaySelected}
    />,
    <ListSymptoms
      key="third"
      onNext={handleNextSymptoms}
      patientSelected={patientSelected}
      isActive={activeTab === 2}
      doctorSelected={doctorSelected}
      daySelected={daySelected}
      user={user}
    />,
    <StatusMessage
      key="fourth"
      text={messageStatus}
      status={paymentStatus}
      backAction={handleTryAgain}
    />,
  ];

  return (
    <Flex
      w={["full", "calc(100% - 155px)"]}
      h="full"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Box maxW={["full", "1240px", "full"]} h="full">
        {/* CONTENT */}
        <Flex
          alignContent="center"
          flex={1}
          flexDirection="column"
          gap={[2, 5]}
          mt={0}
        >
          <Heading
            fontSize={["15px", "25px"]}
            fontWeight={700}
            lineHeight={["17.58px", "29.3px"]}
            color="#104DBA"
            border={["1px solid #104DBA", "none"]}
            px={[4, 0]}
            py={[0.5, 0]}
            rounded={["xl", "none"]}
            w={["120px", "auto"]}
          >
            Nuevo turno
          </Heading>
          <TabsConsult
            tabsHeading={tabsHeading}
            tabContents={tabContents}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            slider={slider}
            setSlider={setSlider}
          />
        </Flex>
        {/* FORMS */}
        <AlertModal
          onClose={() => onClose()}
          isOpen={isOpen}
          alertHeader="Nuevo paciente"
          customWidth="calc(100% - 50px)"
          alertBody={
            <FormPatient
              handleSubmit={(values) => createPatient(values, onClose)}
            />
          }
          isLoading={false}
        />
      </Box>
    </Flex>
  );
}
