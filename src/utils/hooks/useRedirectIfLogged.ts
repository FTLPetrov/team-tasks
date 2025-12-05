import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useGetUser } from "../../api/controllers/userController";

export const useRedirectIfLogged = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data } = useGetUser(user?.id);

  useEffect(() => {
    if (data?.length && data[0].email == user?.email) {
      navigate("/", { replace: true });
    }
  }, [navigate, data, user?.email]);
};
