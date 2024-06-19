import PropTypes from 'prop-types'
import { Button, Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { instance } from "../utils/axios"
import { MdOutlineNavigateNext } from 'react-icons/md'

const ListSymptoms = ({ onNext, isActive, patientSelected }) => {
    const [symptoms, setSymptoms] = useState([])
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);

    const fetchSymptoms = async () => {
        try {
          const { data } = await instance.get('/symptoms');
          const response = data;
    
          if(response.success) {
            let symptoms = response.data;
    
            return setSymptoms(symptoms)
          }
    
          setSymptoms([])
        }catch(err) {
          console.log('fetch symptoms', err.message)
          throw new Error('Something went wrong to search symptoms')
        }
    }

    const handleSymptomSelect = (symptom) => {
      const isSelected = selectedSymptoms.includes(symptom);
      if (isSelected) {
        setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
      } else {
        setSelectedSymptoms([...selectedSymptoms, symptom]);
      }
    };

    const handleNextClick = () => {
      if (selectedSymptoms.length > 0) {
        onNext(selectedSymptoms);
      }
    };

    useEffect(() => {
      const fetchDataSymptoms = async () => {
          try {
              await fetchSymptoms()
          }catch(err){
            console.log(err)
          }
        }
        
        if(isActive) fetchDataSymptoms()
    }, [isActive])

    if(!isActive) {
      return null
    }
    
    return (
        <Flex h="100%" flexDirection="column" p={4} gap={5}>
            <Text color="#FFF" bg="#104DBA" borderRadius='xl' w="120px" fontSize="xs" lineHeight="14.06px" textAlign="center" py={1}>Paciente: {patientSelected && patientSelected?.label}</Text>
            <Text
              fontWeight={400}
              fontSize="lg"
              lineHeight="18.75px"
            >
              ¿Que sintomas presenta?
            </Text>
            <Flex gap={5} flexWrap="wrap">
              {symptoms?.length > 0 && symptoms.map((symptom, idx) => (
                <Text
                  key={idx}
                  onClick={() => handleSymptomSelect(symptom)}
                  borderWidth="1px"
                  borderColor="#104DBA"
                  color={selectedSymptoms.includes(symptom) ? "#FFF" : "#104DBA"}
                  px={3}
                  borderRadius="xl"
                  fontSize="md"
                  textTransform="uppercase"
                  cursor="pointer"
                  bgColor={selectedSymptoms.includes(symptom) ? "#104DBA" : "#FFF"}
                  _hover={{ backgroundColor: "#104DBA", color: "#FFF" }}
                >
                  {symptom?.name}
                </Text>
              ))}
            </Flex>
            <Flex flex={1} justifyContent="flex-end" alignItems="flex-end" my={[2, 4]}>
              {selectedSymptoms.length > 0 && (
                <Button
                  bg="#104DBA"
                  color="#FFFFFF"
                  w="120px"
                  size="xs"
                  rightIcon={<MdOutlineNavigateNext style={{ width: '20px', height: '20px' }} />}
                  onClick={handleNextClick}
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

ListSymptoms.propTypes = {
  onNext: PropTypes.func,
  isActive: PropTypes.bool
}

export default ListSymptoms