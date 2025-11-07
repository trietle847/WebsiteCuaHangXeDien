import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AuthSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      (async () => {
        await login(token); 
        navigate("/");
      })();
    } else {
      navigate("/login");
    }
  }, []);

  return <div>Đang đăng nhập...</div>;
}
