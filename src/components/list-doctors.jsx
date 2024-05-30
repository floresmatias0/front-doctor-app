import PropTypes from 'prop-types'
import { Button, Flex, SimpleGrid } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { instance } from "../utils/axios";
import CardCustom from "./card-custom";

const ListDoctors = ({ onNext, isActive }) => {

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
    
    return (
      <Flex h="100%" flexDirection="column" px={6}>
        <SimpleGrid flex={1} columns={[1, 2, 3, 4]} spacingX='40px' spacingY='10px' templateRows={[Array(Math.round(doctors?.length)).fill('96px').join(' '), Array(Math.round(doctors?.length / 4)).fill('96px').join(' ')]}>
            {doctors?.length > 0 && doctors.map((doctor, idx) => (
              <CardCustom
                key={idx}
                heading={doctor?.label}
                handleSelect={() => handleDoctorsSelect(doctor)}
                name={doctor?.name}
                picture={doctor?.picture}
                description={doctor?.especialization}
                avatarSize="md"
                width="100%"
                height="100%"
                isSelected={selectedDoctor.label === doctor?.label}
              />
            ))}
        </SimpleGrid>
        <Flex flex={1} justifyContent="center" alignItems="flex-end" my={[2, 4]}>
        {Object.keys(selectedDoctor).length > 0 && (
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

ListDoctors.propTypes = {
  onNext: PropTypes.func,
  isActive: PropTypes.bool
}

export default ListDoctors