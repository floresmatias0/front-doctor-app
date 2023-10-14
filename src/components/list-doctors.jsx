import PropTypes from 'prop-types'
import { Button, Flex } from "@chakra-ui/react"
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
                auxDoctors.push({ label: doctors[i].name, value: doctors[i].email, picture: doctors[i].picture, reservePrice: doctors[i].reservePrice })
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
            console.log(err)
          }
        }
    
        if(isActive) fetchDataDoctors();
    }, [isActive]);

    return (
      <Flex h="100%" flexDirection="column" px={6}>
        <Flex flexDirection={["column", "row"]} flexWrap={["wrap", "no-wrap"]} gap={4}>
            {doctors?.length > 0 && doctors.map((doctor, idx) => (
              <CardCustom
                key={idx}
                heading={doctor.label}
                handleSelect={() => handleDoctorsSelect(doctor)}
                name={doctor.name}
                picture={doctor.picture}
                description="Especializacion"
                avatarSize="md"
                width={["100%", "284px"]}
                isSelected={selectedDoctor.label === doctor.label}
              />
            ))}
        </Flex>
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