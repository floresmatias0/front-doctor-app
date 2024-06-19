import PropTypes from 'prop-types'
import { Button, Flex, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { instance } from "../utils/axios";
import { MdOutlineNavigateNext } from 'react-icons/md';

const ListDoctors = ({ onNext, isActive, patientSelected }) => {

    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState({});

    const fetchDoctors = async () => {
        try {
          let filters = '{ "role": "DOCTOR" }'
          const { data } = await instance.get(`/users?filters=${filters}`);
          const response = data;
    
          if(response.success) {
            let doctors = response.data;
            let auxDoctors = [];
    
            if(doctors && doctors?.length > 0) {
              for(let i = 0; i < doctors.length; i++) {
                auxDoctors.push({ 
                  label: doctors[i].name,
                  value: doctors[i].email,
                  picture: doctors[i].picture,
                  reservePrice: doctors[i].reservePrice,
                  reserveTime: doctors[i].reserveTime,
                  especialization: doctors[i].especialization
                })
              }
              setDoctors(auxDoctors)
            }
    
            setDoctors(auxDoctors)
          }
    
          return []
        }catch(err) {
          console.log('fetch doctors', err.message)
          throw new Error('Something went wrong to search doctors')
        }
    }

    const handleDoctorsSelect = (doctor) => {
      setSelectedDoctor(doctor);
    };

    const handleNextClick = () => {
      if (Object.keys(selectedDoctor).length > 0) {
        onNext(selectedDoctor);
      }
    };

    useEffect(() => {
        const fetchDataDoctors = async () => {
          try {
            await fetchDoctors();
          }catch(err){
            throw new Error(err.message)

          }
        }
    
        if(isActive) fetchDataDoctors();
    }, [isActive]);

    if(!isActive) {
      return null
    }

    console.log({doctors})
    
    return (
      <Flex h="100%" flexDirection="column" p={4} gap={5}>
        <Text color="#FFF" bg="#104DBA" borderRadius='xl' w="120px" fontSize="xs" lineHeight="14.06px" textAlign="center" py={1}>Paciente: {patientSelected && patientSelected?.label}</Text>
        <Text
          fontWeight={400}
          fontSize="lg"
          lineHeight="18.75px"
        >
          Estos son los profesionales actualmente disponibles
        </Text>
        <Flex gap={5} flexWrap="wrap">
          {doctors?.length > 0 && doctors.map((doctor, idx) => (
            <Text
              key={idx}
              onClick={() => handleDoctorsSelect(doctor)}
              borderWidth="1px"
              borderColor="#104DBA"
              color={selectedDoctor.label === doctor?.label ? "#FFF" : "#104DBA"}
              px={3}
              borderRadius="xl"
              fontSize="md"
              textTransform="capitalize"
              cursor="pointer"
              bgColor={selectedDoctor.label === doctor?.label ? "#104DBA" : "#FFF"}
              _hover={{ backgroundColor: "#104DBA", color: "#FFF" }}
            >
              {doctor?.label}
            </Text>
          ))}
        </Flex>
        <Flex flex={1} justifyContent="flex-end" alignItems="flex-end" my={[2, 4]}>
          {Object.keys(selectedDoctor).length > 0 && (
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

ListDoctors.propTypes = {
  onNext: PropTypes.func,
  isActive: PropTypes.bool
}

export default ListDoctors