import { useNavigate } from "react-router-dom";
import { Button, Flex, Text, Box } from "@chakra-ui/react";
import { useContext } from "react";
import { AppContext } from "../components/context";

const Home = () => {
  const navigate = useNavigate()
  const { user } = useContext(AppContext)

  const titleText = user.role === 'DOCTOR' ? "Administra tus pacientes" : "Sin turnos próximos."
  const welcomeText = user.role === 'DOCTOR' ? "Estamos aquí para ayudarte a <b>brindar la mejor atención médica a tus pacientes.</b>" : "Encuentra al médico que necesitas y programa tu cita en solo unos pasos. <b>¡Tu atención pediátrica está a solo cuatro pasos de distancia!</b>"

  return (
    <Flex w={["calc(100% - 60px)", "calc(100% - 155px)"]} h="100%" justifyContent={["center", "top"]} alignItems="center" flexDirection="column">
      <Box>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style={{ width: '52px', height: '56px'}} fill="#104DBA">
          <path d="M128 0c13.3 0 24 10.7 24 24V64H296V24c0-13.3 10.7-24 24-24s24 10.7 24 24V64h40c35.3 0 64 28.7 64 64v16 48V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V192 144 128C0 92.7 28.7 64 64 64h40V24c0-13.3 10.7-24 24-24zM400 192H48V448c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V192zm-95 89l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/>
        </svg>
        <Text color="#104DBA" fontSize={["xl", "40px"]} fontWeight="bold" textAlign="left" mt={4} mb={2} lineHeight="46.88px">{titleText}</Text>
        <Box color="#474747" fontSize={["md", "xl"]} w={["auto","462px"]} mt={4} mb={6} textAlign="left" lineHeight="23.44px" style={{ lineHeight: "110%" }}>
          <div dangerouslySetInnerHTML={{__html: welcomeText }}></div>
        </Box>
        {user.role !== "DOCTOR" && (
          <Flex justifyContent="flex-start" alignItems="start" gap={4} flexDirection="column" my={2}>
            <Button bg="#104DBA" color="#FFFFFF" w="222px" size="sm" onClick={() => navigate('/turnos')} fontSize='16px' fontWeight={500}>
              SOLICITAR NUEVO TURNO
            </Button>
          </Flex>
        )}
      </Box>
    </Flex>
  )
}

export default Home