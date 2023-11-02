import { useNavigate } from "react-router-dom";
import { Button, Flex, Text } from "@chakra-ui/react"

const Home = () => {
  const navigate = useNavigate()

  return (
    <Flex w="100%" h="100%" justifyContent={["center", "top"]} alignItems="center" flexDirection="column">
      <Text color="#205583" fontSize={["xl", "2xl"]} fontWeight="bold" my={2}>Solicitar un turno médico</Text>
      <Text color="#205583" fontSize={["md", "xl"]} w={["auto","462px"]} my={2} textAlign="center" style={{ lineHeight: "110%" }}>
        Encuentra al médico que necesitas y programa tu cita en solo unos pasos. <b>¡Tu atención pediátrica está a solo cuatro pasos de distancia!</b>
      </Text>
      <Flex justifyContent="center" alignItems="center" gap={4} flexDirection="column" my={2}>
        <Button bg="#205583" color="#FFFFFF" w={["220px","300px"]} size={["sm", "md"]} onClick={() => navigate('/appointment')}>
          SOLICITAR NUEVO TURNO
        </Button>
        {/* <Button bg="#FFFFFF" color="#205583" w={["220px","300px"]} size={["sm", "md"]} isDisabled>
          MODIFICAR TURNO EXISTENTE
        </Button> */}
      </Flex>
    </Flex>
  )
}

export default Home