import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const currentParams = Object.fromEntries([...searchParams]);
  const { token, bookingId, email } = currentParams;

  useEffect(() => {
    const handleVerification = async () => {
      try {
        if (token) {
          let existToken = localStorage.getItem("authToken");
          if(existToken) {
            localStorage?.removeItem("user");
            localStorage?.removeItem("authToken");
          }
          localStorage.setItem("authToken", token);

          if (bookingId && email) {
            return navigate(`/confirm-appointment?bookingId=${bookingId}&email=${email}`);
          } else {
            return navigate("/inicio");
          }
        } else {
          let token = localStorage.getItem("authToken");

          if(token) {
            if (bookingId && email) {
              return navigate(`/confirm-appointment?bookingId=${bookingId}&email=${email}`);
            }
            return navigate("/inicio");
          }
          return navigate("/iniciar-sesion");
        }
      } catch (error) {
        console.error('Error verificando el token:', error);
        return navigate("/iniciar-sesion");
      }
    };

    handleVerification();
  }, [token, navigate, bookingId, email]);

  return null;
}
