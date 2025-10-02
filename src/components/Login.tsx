import {
  GoogleLogin as GoogleLoginButton,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import axios from "axios";
import { UserAuthStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const sendIdToken = async (idToken: string) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/auth/google",
        {
          idToken,
        },
        {
          withCredentials: true, // refreshToken이 쿠키로 오는 경우 필요
        }
      );

      const accessToken = res.data.data?.jwt;

      UserAuthStore.getState().setAuth(res.data.data);

      localStorage.setItem("accessToken", accessToken);

      navigate("/login/success");
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <GoogleLoginButton
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            sendIdToken(credentialResponse.credential);
          }
        }}
        onError={() => {
          console.error("Google 로그인 실패");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default Login;
