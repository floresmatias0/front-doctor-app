import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { instance } from "../utils/axios";

export default function VerifyMP() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"))

  const fetchUser = async () => {
    try {
      const { data } = await instance.get(`/users/${user?._id}`);
      const response = data;
      if (response.success) {
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(response.data));
        return navigate("/profile");
      }
      return navigate("/profile");
    } catch (err) {
      console.log("fetch users", err.message);
      navigate("/profile");
    }
  };

  useEffect(() => {
    if (user) {
      fetchUser()
        .then((response) => response)
        .catch((err) => err.message);
    }
  }, []);

  return null;
}
