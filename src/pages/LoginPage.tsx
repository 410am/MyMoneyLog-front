// import {
//   GoogleLogin as GoogleLoginButton,
//   GoogleOAuthProvider,
// } from "@react-oauth/google";
// import axios from "axios";

// const LoginPage = () => {
//   const sendIdToken = async (idToken: string) => {
//     try {
//       console.log(idToken);
//       const res = await axios.post("http://localhost:8080/auth/google", {
//         idToken,
//       });

//       // ✅ 받은 JWT 저장
//       const jwt = res.data.data.jwt;
//       localStorage.setItem("accessToken", jwt);
//       const token = localStorage.getItem("accessToken");
//       console.log("🔥 res.data 전체:", res.data);
//       console.log("🔥 token:", token);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const GoogleLogin = () => {
//     return (
//       <GoogleLoginButton
//         onSuccess={(credentialResponse) => {
//           if (credentialResponse.credential) {
//             sendIdToken(credentialResponse.credential);
//           }
//         }}
//       />
//     );
//   };
//   return (
//     <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
//       <GoogleLogin />
//     </GoogleOAuthProvider>
//   );
// };

// export default LoginPage;

// import { useEffect } from "react";

import {
  GoogleLogin as GoogleLoginButton,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import axios from "axios";

const LoginPage = () => {
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

      const accessToken = res.data.accessToken;
      localStorage.setItem("accessToken", accessToken);
      console.log("🔥 accessToken 저장됨:", accessToken);
      window.location.href = "/login/success";
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };
  window.location.href = "/login/success";

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

export default LoginPage;
