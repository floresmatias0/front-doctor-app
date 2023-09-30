import { Avatar, Box, Card, CardHeader, Flex, Heading, SimpleGrid, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { instance } from "../utils/axios";

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
              <Card
                key={idx}
                onClick={() => handleSelect(doctor, 1)}
                cursor="pointer"
                _hover={{ bg: '#ebedf0' }}
                _active={{
                  bg: '#dddfe2',
                  transform: 'scale(0.98)',
                  borderColor: '#bec3c9',
                }}
              >
                  <CardHeader>
                      <Flex spacing='4'>
                          <Flex flex='1' gap='4' alignItems='center'>
                              <Avatar name={doctor.label} src={doctor.picture}/>

                              <Box>
                                  <Heading size='sm' textTransform="uppercase" color="#205583" fontSize="sm">{doctor.label}</Heading>
                                  <Text color="#205583" fontSize="xs">Especialización</Text>
                              </Box>
                          </Flex>
                      </Flex>
                  </CardHeader>
              </Card>
            ))}
        </SimpleGrid>  
    )
}

export default ListDoctors