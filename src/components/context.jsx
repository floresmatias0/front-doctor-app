import PropTypes from 'prop-types'
import { createContext, useCallback, useEffect, useState } from 'react';
import { instance } from '../utils/axios';

export const AppContext = createContext(null);

export default function DoctorContext({ children }) {
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

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
      fetchDataUsers();
    }, [fetchDataUser])
    
    console.log({user})

    return (
      <section className="section">
        <AppContext.Provider value={{
            user,
            isLoading,
            setIsLoading
        }}>
          {children}
        </AppContext.Provider>
      </section>
    )
}

DoctorContext.propTypes = {
  children: PropTypes.any
}