import { createContext, useState } from 'react';

export const AppContext = createContext(null);

export default function DoctorContext({ children }) {
    const [selected, setSelected] = useState('');

    return (
      <section className="section">
        <AppContext.Provider value={{
            setSelected,
            selected
        }}>
          {children}
        </AppContext.Provider>
      </section>
    );
}