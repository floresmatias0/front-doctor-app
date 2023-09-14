import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { instance } from "../utils/axios";

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const currentParams = Object.fromEntries([...searchParams]);
  const { _valid: idUser } = currentParams;

  const fetchUser = async (userId) => {
    try {
      const { data } = await instance.get(`/users/${userId}`);
      const response = data;
      if (response.success) {
        localStorage.setItem("user", JSON.stringify(response.data));
        return navigate("/");
      }
      return navigate("/login");
    } catch (err) {
      console.log("fetch users", err.message);
      navigate("/login");
      throw new Error("Something went wrong to search user");
    }
  };

  useEffect(() => {
    if (idUser) {
      fetchUser(idUser)
        .then((response) => response)
        .catch((err) => err.message);
    }
  }, [searchParams]);

  return null;
}
