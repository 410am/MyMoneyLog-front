import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import { authStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import mmlLogo from "../assets/icons/icon-192.png";
import googleLogo from "../assets/icons/google-color.png";

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
        },
      );

      const accessToken = res.data.data?.jwt;

      authStore.getState().setAuth(res.data.data);

      localStorage.setItem("accessToken", accessToken);

      navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
    }
  };

  function LoginInner() {
    return (
      <div className="absolute opacity-0">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              sendIdToken(credentialResponse.credential);
            }
          }}
          onError={() => {
            console.error("Google 로그인 실패");
          }}
          width="288" // 72*4 = 288px
          size="large"
          shape="pill"
        />
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <div>
        <div className="bg-[radial-gradient(circle_at_center,_#B469FF_0%,_#8555C1_50%)] w-full h-screen flex justify-center items-center text-slate-50">
          <div className="h-3/4 w-2/5">
            <div className="grid justify-items-center h-fit ">
              <img className="w-24 h-24" src={mmlLogo} alt="mmlLogo" />
              <div className="text-4xl [text-shadow:6px_8px_4px_rgba(0,0,0,0.25)] font-bold ">
                My Money Log
              </div>
            </div>
            <div className="bg-slate-300/20 shadow-lg w-5/6 border border-slate-200/30 rounded-[48px] px-24 py-14 mt-10 h-2/3 mx-auto grid-rows-4 justify-items-center [text-shadow:2px_2px_4px_rgba(0,0,0,0.25)]">
              <div className="grid-rows-2 justify-items-center pb-5">
                <div className="font-bold text-xl pb-2">로그인</div>
                <div>구글 계정으로 간편하게 시작하기</div>
              </div>
              <div className="mb-10 relative flex justify-center items-center">
                <LoginInner />
                <button
                  type="button"
                  className="w-72 h-14 rounded-[30px] bg-slate-50 text-slate-900 font-bold text-base
                   flex items-center justify-center gap-3
                   shadow-sm hover:-translate-y-[1px] hover:shadow-md transition"
                >
                  <img className="w-6 h-6" src={googleLogo} alt="googleLogo" />
                  Google로 계속하기
                </button>
              </div>
              <div className="mb-8 grid grid-cols-3 justify-items-center">
                <div className="border-t border-slate-50 mt-3 opacity-60 w-24" />
                <div className="mx-6">or</div>
                <div className="border-t border-slate-50 mt-3 opacity-60 w-24" />
              </div>
              <div>
                <div className="text-sm mb-2.5">아직 회원이 아니신가요?</div>
                <div className="mb-10 relative flex justify-center items-center">
                  <LoginInner />
                  <div className="font-bold text-md ">Google로 가입하기</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
