import { useState, useContext, useEffect } from 'react';
import {
    Box,
    Button,
    Flex,
    Text,
    Input,
    Heading,
    TabPanel,
    TabPanels,
    Tabs,
    Center,
    Spinner,
    Image,
    Divider,
    useToast
} from '@chakra-ui/react';
import { AppContext } from "../components/context";
import DoctorCalendar from "../components/doctor-calendar"; // Importamos el nuevo componente
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { MdOutlineErrorOutline, MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";
import { FaMoneyBill } from "react-icons/fa";
import { IoMdCalendar } from "react-icons/io";
import { instance } from "../utils/axios"; // Asegúrate de importar la instancia correcta para las solicitudes
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { renderStars } from '../components/rating-stars'; // Asegúrate de importar esta función para mostrar estrellas

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

const CreateTurn = () => {
    const { user } = useContext(AppContext);
    const toast = useToast();

    const initialStateTabs = {
        details: false,
        calendar: true,
        confirmation: true,
        success: true,
    };

    const [activeTab, setActiveTab] = useState(0);
    const [disableTabs, setDisableTabs] = useState(initialStateTabs);
    const [tutorName, setTutorName] = useState('');
    const [patientName, setPatientName] = useState('');
    const [tutorEmail, setTutorEmail] = useState('');
    const [daySelected, setDaySelected] = useState("");
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loadingCalendar, setLoadingCalendar] = useState(true);
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [messageStatus, setMessageStatus] = useState("");
    const [doctorData, setDoctorData] = useState(null); // Nuevo estado para los datos del médico

    const handleInputChange = () => {
        if (tutorName && patientName && tutorEmail) {
            setIsFormComplete(true);
        } else {
            setIsFormComplete(false);
        }
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const normalizeName = (name) => {
        return name.replace(/\b\w/g, char => char.toUpperCase()).trim();
    };

    const handleNextDetails = () => {
        if (isFormComplete) {
            if (!validateEmail(tutorEmail)) {
                toast({
                    title: "Correo electrónico inválido",
                    description: "Por favor, ingrese un correo electrónico válido.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            setTutorName(normalizeName(tutorName));
            setPatientName(normalizeName(patientName));

            setActiveTab(1);
            setDisableTabs({
                ...disableTabs,
                calendar: false,
            });
            fetchCalendarEvents();
            fetchDoctorData(); // Cargar datos del médico seleccionado
        }
    };

    const handleBackDetails = () => {
        setActiveTab(0);
        setDisableTabs({
            details: false,
            calendar: true,
            confirmation: true,
            success: true,
        });
    };

    const handleNextCalendar = () => {
        setActiveTab(2);
        setDisableTabs({
            ...disableTabs,
            confirmation: false,
        });
    };

    const handleBackCalendar = () => {
        setActiveTab(1);
        setDisableTabs({
            details: true,
            calendar: false,
            confirmation: true,
            success: true,
        });
    };

    const handleNextConfirmation = () => {
        setActiveTab(3);
        setDisableTabs({
            ...disableTabs,
            success: false,
        });
    };

    const handleTryAgain = () => {
        setTutorName('');
        setPatientName('');
        setTutorEmail('');
        setDaySelected("");
        setMessageStatus("");
        setActiveTab(0);
        setDisableTabs(initialStateTabs);
    };

    const fetchCalendarEvents = async () => {
        setLoadingCalendar(true);
        try {
            const { data } = await instance.get(`/calendars?email=${user.email}`);
            console.log("Fetched events:", data?.data?.items); // Logueamos los eventos obtenidos
            setCalendarEvents(data?.data?.items);
            setLoadingCalendar(false);
        } catch (err) {
            console.error("Error fetching calendar events:", err);
            setLoadingCalendar(false);
        }
    };

    const fetchAverageRating = async (doctorId) => {
        try {
            const response = await instance.get(`/rating/${doctorId}`);
            if (response.data.success) {
                return response.data.averageRating;
            }
            return 0;
        } catch (error) {
            console.error('Error fetching average rating:', error);
            return 0;
        }
    };

    const fetchDoctorData = async () => {
        try {
            const { data } = await instance.get(`/users?email=${user.email}`);
            if (data.success) {
                const doctor = data.data[0]; // Asumimos que el doctor es el primer resultado
                const averageRating = await fetchAverageRating(doctor._id);
                setDoctorData({ ...doctor, averageRating });
            }
        } catch (err) {
            console.error("Error fetching doctor data:", err);
        }
    };

    const fechaFormateada = daySelected ? format(new Date(daySelected), "d  MMMM yyyy, HH:mm 'Hs.'", { locale: es }) : null;

    return (
        <Flex
            w={["full", "calc(100% - 155px)"]}
            h="full"
            flexDirection="column"
            justifyContent="flex-start" // Alineamos hacia el inicio
            alignItems="flex-start" // Alineamos hacia el inicio
            px={[4, 8]} // Añadimos padding para ajustar
            mt={[4, 8]} // Añadimos margin-top para ajustar
        >
            <Box maxW={["full", "1240px", "full"]} h="full">
                <Tabs
                    isFitted
                    w={["full", "full", "full", "662px"]}
                    h={["full", "auto"]}
                    minH={["full", "full", "full", "full", "368px", "468px"]}
                    overflowY="auto"
                    overflowX="auto"
                    bg="#FFF"
                    position="relative"
                    variant="unstyled"
                    index={activeTab}
                    display="flex"
                    flexDirection="column"
                >
                    <TabPanels flex={1} display="flex" position="relative">
                        <TabPanel
                            overflowY="auto"
                            h="full"
                            w="full"
                            px={0}
                            py={0}
                        >
                            <Flex
                                flex={1}
                                flexDirection="column"
                                gap={[2, 5]}
                                mt={0}
                                p={[4, 6]}
                            >
                                <Heading
                                    fontSize={["15px", "25px"]}
                                    fontWeight={700}
                                    lineHeight={["17.58px", "29.3px"]}
                                    color="#104DBA"
                                    px={[4, 0]}
                                    py={[0.5, 0]}
                                    w={["120px", "auto"]}
                                >
                                    Agendar turno
                                </Heading>
                                <Text
                                    fontSize="md"
                                    color="gray.500"
                                    mb={6}
                                >
                                    Completa los campos para agendar un turno
                                </Text>
                                <Box
                                    boxShadow="lg"
                                    p={[4, 6]}
                                    bg="white"
                                    borderRadius="md"
                                    w="full"
                                >
                                    <Flex flexDirection="column" gap={4}>
                                        <Flex flexDirection="column">
                                            <Text mb={2} fontWeight={600}>Nombre de tutor</Text>
                                            <Input placeholder="Nombre de tutor" value={tutorName} onChange={(e) => { setTutorName(e.target.value); handleInputChange(); }} />
                                        </Flex>
                                        <Flex flexDirection="column">
                                            <Text mb={2} fontWeight={600}>Nombre de paciente</Text>
                                            <Input placeholder="Nombre de paciente" value={patientName} onChange={(e) => { setPatientName(e.target.value); handleInputChange(); }} />
                                        </Flex>
                                        <Flex flexDirection="column">
                                            <Text mb={2} fontWeight={600}>Mail del tutor</Text>
                                            <Input placeholder="Mail del tutor" value={tutorEmail} onChange={(e) => { setTutorEmail(e.target.value); handleInputChange(); }} />
                                        </Flex>
                                    </Flex>
                                </Box>
                                <Flex justifyContent="flex-end" mt={4}>
                                    <Button
                                        bg="#104DBA"
                                        color="#FFFFFF"
                                        w="120px"
                                        size="sm"
                                        onClick={handleNextDetails}
                                        isDisabled={!isFormComplete}
                                    >
                                        Ver calendario
                                    </Button>
                                </Flex>
                            </Flex>
                        </TabPanel>
                        <TabPanel
                            overflowY="auto"
                            h="full"
                            w="full"
                            px={0}
                            py={0}
                        >
                            <Flex
                                flexDirection="column"
                                gap={[2, 5]}
                                mt={0}
                            >
                                <Heading
                                    fontSize={["15px", "25px"]}
                                    fontWeight={700}
                                    lineHeight={["17.58px", "29.3px"]}
                                    color="#104DBA"
                                    px={[4, 0]}
                                    py={[0.5, 0]}
                                    w={["120px", "auto"]}
                                >
                                    Selecciona un horario
                                </Heading>
                                <Text
                                    fontSize="md"
                                    color="gray.500"
                                    mb={6}
                                >
                                    Elige un horario disponible para la consulta.
                                </Text>
                                <Box
                                    boxShadow="lg"
                                    p={[4, 6]}
                                    bg="white"
                                    borderRadius="md"
                                    w="full"
                                >
                                    {loadingCalendar ? (
                                        <Center h="100px">
                                            <Spinner />
                                        </Center>
                                    ) : (
                                        <DoctorCalendar
                                            currentDateState={new Date()}
                                            daySelected={daySelected}
                                            setDaySelected={setDaySelected}
                                            calendarEvents={calendarEvents}
                                            reserveTime={user.reserveTime}
                                            reserveTimeFrom={user.reserveTimeFrom}
                                            reserveTimeUntil={user.reserveTimeUntil}
                                            reserveTimeFrom2={user.reserveTimeFrom2}
                                            reserveTimeUntil2={user.reserveTimeUntil2}
                                        />
                                    )}
                                </Box>
                                <Flex justifyContent="space-between" mt={4}>
                                    <Button
                                        bg="#104DBA"
                                        color="#FFFFFF"
                                        w="120px"
                                        size="xs"
                                        leftIcon={<MdOutlineNavigateBefore style={{ width: "20px", height: "20px" }} />}
                                        onClick={handleBackDetails}
                                    >
                                        <Text
                                            fontSize="xs"
                                            lineHeight="16px"
                                            fontWeight={500}
                                            textTransform="uppercase"
                                        >
                                            Anterior
                                        </Text>
                                    </Button>
                                    {daySelected && (
                                        <Button
                                            bg="#104DBA"
                                            color="#FFFFFF"
                                            w="120px"
                                            size="xs"
                                            rightIcon={<MdOutlineNavigateNext style={{ width: "20px", height: "20px" }} />}
                                            onClick={handleNextCalendar}
                                        >
                                            <Text
                                                fontSize="xs"
                                                lineHeight="16px"
                                                fontWeight={500}
                                                textTransform="uppercase"
                                            >
                                                Continuar
                                            </Text>
                                        </Button>
                                    )}
                                </Flex>
                            </Flex>
                        </TabPanel>
                        <TabPanel
                            overflowY="auto"
                            h="full"
                            w="full"
                            px={0}
                            py={0}
                        >
                            <Flex
                                flexDirection="column"
                                gap={[2, 5]}
                                mt={0}
                                p={[4, 6]}
                                maxW="500px"  // Hacer la tarjeta aún más angosta
                                mx="auto"     // Centrar la tarjeta
                            >
                                <Heading
                                    fontSize={["15px", "25px"]}
                                    fontWeight={700}
                                    lineHeight={["17.58px", "29.3px"]}
                                    color="#104DBA"
                                    px={[4, 0]}
                                    py={[0.5, 0]}
                                    w={["120px", "auto"]}
                                >
                                    Confirmar turno
                                </Heading>
                                <Text
                                    fontSize="md"
                                    color="gray.500"
                                    mb={6}
                                >
                                    Revise los detalles del turno y confirme la reserva.
                                </Text>
                                <Box
                                    boxShadow="lg"
                                    p={[4, 6]}
                                    bg="white"
                                    borderRadius="md"
                                    w="full"
                                >
                                    <Text fontWeight={600} fontSize={25} mb={2}>
                                        Tutor: {tutorName}
                                    </Text>
                                    <Text fontWeight={400} mb={2}>
                                        Paciente: {patientName}
                                    </Text>
                                    <Text fontWeight={400} mb={2}>
                                        Mail: {tutorEmail}
                                    </Text>
                                    <Divider />
                                    <Text fontWeight={600} mt={4} mb={2}>Información del turno</Text>
                                    <Box
                                        w="full"
                                        p={4}
                                    >
                                        <Flex
                                            w="full"
                                            h="auto"
                                            justifyContent="space-around"
                                            p={2}
                                            mx="auto"
                                            gap={2}
                                        >
                                            <Image
                                                rounded="full"
                                                src={user.picture}
                                                w="80px"  // Agrandar la foto del médico
                                                h="80px"  // Agrandar la foto del médico
                                            />
                                            <Flex flexDirection="column" justifyContent="space-between">
                                                <Box>
                                                    <Text
                                                        fontSize="sm"
                                                        textTransform="capitalize"
                                                        fontWeight={700}
                                                        lineHeight="19.69px"
                                                    >
                                                        Dr/Dra. {user.name}
                                                    </Text>
                                                    <Text fontSize="xs" fontWeight={400} lineHeight="16.88px">
                                                        {doctorData?.especialization?.join(", ")}
                                                    </Text>
                                                    <Flex alignItems="center" gap={1}>
                                                        {renderStars(doctorData?.averageRating)}
                                                        <Text fontSize="xs" fontWeight={300} lineHeight="14.06px" ml={2}>
                                                            ({doctorData?.averageRating?.toFixed(1)})
                                                        </Text>
                                                    </Flex>
                                                    <Flex alignItems="center" gap={1}>
                                                        <IoMdCalendar style={{ color: "#AAAAAA" }} />
                                                        <Text fontSize="xs" lineHeight="14.06px">{fechaFormateada}</Text>
                                                    </Flex>
                                                    <Flex alignItems="center" gap={1}>
                                                        <FaMoneyBill
                                                            style={{
                                                                width: "16px",
                                                                height: "16px",
                                                                color: "gray",
                                                            }}
                                                        />
                                                        <Text fontSize="xs" fontWeight={300} lineHeight="14.06px">
                                                            Valor de la consulta: ${user.reservePrice}
                                                        </Text>
                                                    </Flex>
                                                </Box>
                                            </Flex>
                                        </Flex>
                                    </Box>
                                </Box>
                                <Flex justifyContent="space-between" mt={4}>
                                    <Button
                                        bg="#104DBA"
                                        color="#FFFFFF"
                                        w="120px"
                                        size="xs"
                                        leftIcon={<MdOutlineNavigateBefore style={{ width: "20px", height: "20px" }} />}
                                        onClick={handleBackCalendar}
                                    >
                                        <Text
                                            fontSize="xs"
                                            lineHeight="16px"
                                            fontWeight={500}
                                            textTransform="uppercase"
                                        >
                                            Anterior
                                        </Text>
                                    </Button>
                                    <Button
                                        bg="#104DBA"
                                        color="#FFFFFF"
                                        w="auto"  // Aumentar el ancho del botón para acomodar el texto
                                        size="xs"
                                        rightIcon={<MdOutlineNavigateNext style={{ width: "20px", height: "20px" }} />}
                                        onClick={handleNextConfirmation}
                                    >
                                        <Text
                                            fontSize="xs"
                                            lineHeight="16px"
                                            fontWeight={500}
                                            textTransform="uppercase"
                                        >
                                            Reservar e informar al paciente
                                        </Text>
                                    </Button>
                                </Flex>
                            </Flex>
                        </TabPanel>
                        <TabPanel
                            overflowY="auto"
                            h="full"
                            w="full"
                            px={0}
                            py={0}
                        >
                            <StatusMessage
                                text="Su solicitud ha sido enviada exitosamente."
                                status="approved"
                                backAction={handleTryAgain}
                            />
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
        </Flex>
    );
};

export default CreateTurn;

