import PropTypes from 'prop-types'
import { createContext, useCallback, useEffect, useState } from 'react';
import { instance } from '../utils/axios';
import { Box, Text, useToast } from '@chakra-ui/react';
import { HiOutlineBadgeCheck } from 'react-icons/hi';
import { MdErrorOutline } from 'react-icons/md';
import { jwtDecode } from "jwt-decode";

export const AppContext = createContext(null);

export default function DoctorContext({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [patients, setPatients] = useState([])

    const toast = useToast()

    const fetchDataUser = useCallback(async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem("authToken");

        const {id} = jwtDecode(token)

        const idUser = id;

        const userData = await instance.get(`/users/${idUser}`)

        setUser(userData.data.data)
        setIsLoading(false)
      }catch(err) {
        setIsLoading(false)
        console.log(err.message)
        throw new Error(err.message)
      }
    }, [])

    useEffect(() => {
      const fetchDataUsers = async () => {
        try {
          await fetchDataUser();
        } catch (err) {
          console.log(err);
        }
      };

      fetchDataUsers()
    }, [fetchDataUser])
    
    const fetchPatients = useCallback(async () => {
      try {
        let filters = `{ "userId": "${user._id}" }`
        const { data } = await instance.get(`/patients?filters=${filters}`);

        const response = data;
  
        if(response.success) {
          let patients = response.data;
          let transformPatients = patients.map(patient => ({ value: patient?.identityId, label: patient?.firstName || patient?.lastName ? `${patient?.firstName} ${patient?.lastName}`: patient?.name, ...patient }))
  
          return setPatients(transformPatients)
        }
  
        setPatients([])
      }catch(err) {
        console.log('fetch patients', err.message)
        throw new Error('Something went wrong to search patients')
      }
    }, [user])

    useEffect(() => {
      const fetchDataPatients = async () => {
        try {
          if(user) {
            await fetchPatients()
          }
        }catch(err){
          console.log(err)
        }
      }
      
      fetchDataPatients()
    }, [user, fetchPatients])

    const createPatient = async(values, onClose) => {
      try {
        await instance.post('/patients', { ...values, userId: user?._id })
  
        toast({
          position: "top",
          render: () => (
              <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto","428px"]} boxShadow="2xl">
                  <HiOutlineBadgeCheck  style={{ width: "36px", height: "36px", color:"#104DBA" }}/>
                  <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">El paciente ha sido registrado exitosamente.</Text>
              </Box>
          )
        })
  
        onClose()
        await fetchPatients();
      }catch(err) {
        console.log(err.message)
        toast({
          position: "top",
          render: () => (
              <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto","428px"]} boxShadow="2xl">
                  <MdErrorOutline  style={{ width: "36px", height: "36px", color:"red" }}/>
                  <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">El paciente no se pudo registrar.</Text>
              </Box>
          )
        })
      }
    }

    const updatePatient = async(values, onClose) => {
      try {
        await instance.put(`/patients/${values._id}`, { ...values })
  
        toast({
          position: "top",
          render: () => (
              <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto","428px"]} boxShadow="2xl">
                  <HiOutlineBadgeCheck  style={{ width: "36px", height: "36px", color:"#104DBA" }}/>
                  <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">El paciente se ha actualizado exitosamente.</Text>
              </Box>
          )
        })
  
        onClose()
        await fetchPatients();
      }catch(err) {
        console.log(err.message)
        toast({
          position: "top",
          render: () => (
              <Box py={4} px={8} bg='white' borderRadius="md" maxW={["auto","428px"]} boxShadow="2xl">
                  <MdErrorOutline  style={{ width: "36px", height: "36px", color:"red" }}/>
                  <Text color="#104DBA" fontSize="2xl" fontWeight={700} textOverflow="wrap" lineHeight="35.16px" width="75%">El paciente no se pudo actualizar con exito.</Text>
              </Box>
          )
        })
      }
    }

    return (
      <section className="section">
        <AppContext.Provider value={{
            user,
            setUser,
            isLoading,
            setIsLoading,
            patients,
            setPatients,
            fetchPatients,
            createPatient,
            updatePatient
        }}>
          {children}
        </AppContext.Provider>
      </section>
    )
}

DoctorContext.propTypes = {
  children: PropTypes.any
}