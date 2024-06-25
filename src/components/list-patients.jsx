import PropTypes from 'prop-types'
import { Button, Flex, Select, Text } from "@chakra-ui/react"
import { AiOutlinePlus } from 'react-icons/ai'
import { MdOutlineNavigateNext } from "react-icons/md";

const ListPatient = ({ onNext, isActive, patients, patientSelected, setPatientSelected, onOpenSecond }) => {
    if(!isActive) {
      return null
    }

    return (
        <Flex h="100%" flex={1} flexDirection="column" py={4} px={10} gap={5}>
          <Flex flex={1} flexDirection="column" gap={4}>
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
                placeholder='Eligir paciente'
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
              onClick={onOpenSecond}
              w={["auto", "180px"]}
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