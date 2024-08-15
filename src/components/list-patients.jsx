import PropTypes from 'prop-types'
import { Button, Flex, Select, Text } from "@chakra-ui/react"
import { AiOutlinePlus } from 'react-icons/ai'
import { MdOutlineNavigateNext } from "react-icons/md";

const ListPatient = ({ onNext, isActive, patients, patientSelected, setPatientSelected, onOpenForm }) => {
    if(!isActive) {
      return null
    }

    return (
        <Flex h="full" flexDirection="column" justifyContent="space-between" py={[0, 4]} pt={[10, 0]} px={[0, 10]} gap={5} position={["relative","absolute"]} top="0" left="0" right="0" bottom="0">
          <Flex flexDirection="column" gap={4} mt={[0, 4]}>
            <Text
              fontWeight={400}
              fontSize="md"
              lineHeight="18.75px"
            >
              ¿Para quién es el turno?
            </Text>
            <Select
                w={["auto", "250px"]}
                h={["28px", "36px"]}
                bg="#FFFFFF"
                placeholder='Elegir paciente'
                value={patientSelected?.value}
                onChange={(e) => {
                    const selected = patients.find((patient) => parseInt(patient?.value) === parseInt(e.target.value));
                    setPatientSelected(selected);
                }}
                fontSize={["sm", "md"]}
                textTransform="capitalize"
            >
                {patients.map((patient, idx) => (
                    <option key={idx} value={patient?.value}>{patient?.label}</option>
                ))}
            </Select>
            <Button
              bg="#104DBA"
              color="#FFFFFF"
              size="xs"
              leftIcon={<AiOutlinePlus width={14} height={14} />}
              onClick={onOpenForm}
              w="180px"
            >
              <Text
                fontSize="xs"
                lineHeight="10.55px"
                fontWeight={500}
                textTransform="uppercase"
              >
                Crear nuevo paciente
              </Text>
            </Button>
          </Flex>

          <Flex justifyContent="flex-end" alignItems="flex-end" my={1}>
            {patientSelected && patientSelected?.value && (
              <Button
                bg="#104DBA"
                color="#FFFFFF"
                w="120px"
                size="xs"
                rightIcon={<MdOutlineNavigateNext style={{ width: '20px', height: '20px' }} />}
                onClick={onNext}
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
    )
}

ListPatient.propTypes = {
  onNext: PropTypes.func,
  isActive: PropTypes.bool
}

export default ListPatient