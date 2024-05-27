import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const currentParams = Object.fromEntries([...searchParams]);
  const { _valid: idUser } = currentParams;
  
  useEffect(() => {
    if (idUser) {
      localStorage.setItem("user", idUser);
      return navigate("/inicio")
    }

    navigate("/iniciar-sesion")
  }, [idUser, navigate]);

  return null;
}
