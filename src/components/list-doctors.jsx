import { Avatar, Box, Card, CardHeader, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { instance } from "../utils/axios";
import CardCustom from "./card-custom";

const ListDoctors = ({handleSelect}) => {
    const [doctors, setDoctors] = useState([]);

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
                auxDoctors.push({ label: doctors[i].name, value: doctors[i].email, picture: doctors[i].picture })
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

    useEffect(() => {
        const fetchDataDoctors = async () => {
          try {
            await fetchDoctors();
          }catch(err){
            console.log(err)
          }
        }
    
        fetchDataDoctors();
    }, []);

    return (
        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(250px, 1fr))'>
            {doctors?.length > 0 && doctors.map((doctor, idx) => (
              <CardCustom
                key={idx}
                heading={doctor.label}
                handleSelect={() => handleSelect(doctor, 1)}
                name={doctor.name}
                picture={doctor.picture}
                description="Especializacion"
                avatarSize="md"
              />
            ))}
        </SimpleGrid>  
    )
}

export default ListDoctors