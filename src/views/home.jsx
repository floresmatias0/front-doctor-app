import { useNavigate } from "react-router-dom";
import { Button, Flex, Text } from "@chakra-ui/react"
import { useContext } from "react";
import { AppContext } from "../components/context";

const Home = () => {
  const navigate = useNavigate()
  const { user } = useContext(AppContext)

  const titleText = user.role === 'DOCTOR' ? "Administra tus pacientes" : "Solicitar un turno médico"
  const welcomeText = user.role === 'DOCTOR' ? "Estamos aquí para ayudarte a <b>brindar la mejor atención médica a tus pacientes.</b>" : "Encuentra al médico que necesitas y programa tu cita en solo unos pasos. <b>¡Tu atención pediátrica está a solo cuatro pasos de distancia!</b>"

  return (
    <Flex w="100%" h="100%" justifyContent={["center", "top"]} alignItems="center" flexDirection="column">
      <Text color="#205583" fontSize={["xl", "2xl"]} fontWeight="bold" my={2}>{titleText}</Text>
      <Text color="#205583" fontSize={["md", "xl"]} w={["auto","462px"]} my={2} textAlign="center" style={{ lineHeight: "110%" }}>
        <div dangerouslySetInnerHTML={{__html: welcomeText }}></div>
      </Text>
      {user.role !== "DOCTOR" && <Flex justifyContent="center" alignItems="center" gap={4} flexDirection="column" my={2}>
        <Button bg="#205583" color="#FFFFFF" w={["220px","300px"]} size={["sm", "md"]} onClick={() => navigate('/appointment')}>
          SOLICITAR NUEVO TURNO
        </Button>
      </Flex>}
    </Flex>
  )
}

export default Home