import '../App.css'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import axios from 'axios';
import { useEffect } from "react";
import { gapi, loadGapiInsideDOM } from 'gapi-script';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'

function Login() {
  // const [gapi, setGapi] = useState(null)

  const newLogin = async () => {
    window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google/`, "_self")
  }

  const connectToGapi = async () => {
    let options = {
      'method': 'GET',
      'url': 'http://localhost:3030/calendars',
      'headers': {
        'Content-Type': 'application/json'
      }
    }
    return await axios.request(options)
  }

  // useEffect(() => {
  //   connectToGapi()
  // }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Doctor App</h1>
      <div className="card">
        <button onClick={newLogin} className='btn-social-medial'>
          <FontAwesomeIcon icon={faGoogle} />
          <span>Iniciar sesion con google</span>
        </button>
      </div>
    </>
  )
}

export default Login
