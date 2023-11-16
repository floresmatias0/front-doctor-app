import PropTypes from 'prop-types'
import { createContext, useCallback, useEffect, useState } from 'react';
import { instance } from '../utils/axios';
import { useToast } from '@chakra-ui/react';

export const AppContext = createContext(null);

export default function DoctorContext({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [patients, setPatients] = useState([])

    const toast = useToast()

    const fetchDataUser = useCallback(async () => {
      try {
        setIsLoading(true)
        const idUser = localStorage.getItem("user")
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
          let transformPatients = patients.map(patient => ({ value: patient.dni, label: patient.name, ...patient }))
  
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
          title: "Paciente creado",
          description: "Haz agregado un nuevo paciente a tu cuenta",
          position: "top-right",
          isClosable: true,
          duration: 6000,
          status: "success"
        });
  
        onClose()
        await fetchPatients();
      }catch(err) {
        console.log(err.message)
        toast({
          title: "Error inesperado",
          description: "Hubo un error al intentar agregar un nuevo paciente",
          position: "top-right",
          isClosable: true,
          duration: 6000,
          status: "error"
        });
      }
    }

    const updatePatient = async(values, onClose) => {
      try {
        await instance.put(`/patients/${values._id}`, { ...values })
  
        toast({
          title: "Paciente actualizado",
          description: `El paciente ${values.name} se actualizo correctamente`,
          position: "top-right",
          isClosable: true,
          duration: 6000,
          status: "success"
        });
  
        onClose()
        await fetchPatients();
      }catch(err) {
        console.log(err.message)
        toast({
          title: "Error inesperado",
          description: "Hubo un error al intentar actualizar al paciente",
          position: "top-right",
          isClosable: true,
          duration: 6000,
          status: "error"
        });
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