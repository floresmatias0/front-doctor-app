import PropTypes from 'prop-types'
import { Button, Flex, SimpleGrid, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import CardCustom from "./card-custom"
import { instance } from "../utils/axios"

const ListSymptoms = ({ onNext, isActive }) => {
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
        <Flex h="100%" flexDirection="column" px={4}>
            <Text color="#205583" my={[1, 4]} fontSize={["sm", "lg"]}>Indique cuál o cuáles son los síntomas actuales del paciente</Text>
            <SimpleGrid flex={1} columns={[1, 2, 3, 4]} spacingX='40px' spacingY='10px' templateRows={[Array(Math.round(symptoms?.length)).fill('80px').join(' '), Array(Math.round(symptoms?.length / 4)).fill('80px').join(' ')]}>
                {symptoms?.length > 0 && symptoms.map((symptom, idx) => (
                  <CardCustom
                      key={idx}
                      heading={symptom.name}
                      handleSelect={() => handleSymptomSelect(symptom)}
                      name={symptom.name}
                      picture=""
                      description=""
                      avatarSize="md"
                      width="100%"
                      height="100%"
                      headingAlign="center"
                      isSelected={selectedSymptoms.includes(symptom)}
                  />
                ))}
            </SimpleGrid>
            <Flex flex={1} justifyContent="center" alignItems="flex-end" my={[2, 4]}>
              {selectedSymptoms.length > 0 && (
                <Button
                  bg="#205583" color="#FFFFFF" w={["220px","300px"]} size={["xs", "sm"]}
                  onClick={handleNextClick}
                >
                  SIGUIENTE
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