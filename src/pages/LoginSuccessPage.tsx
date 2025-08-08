// import { useEffect } from "react";

const LoginSuccessPage = () => {
  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const res = await fetch("http://localhost:8080/login/success", {
  //         credentials: "include", // ✅ 쿠키 포함 (refreshToken)
  //       });

  //       const data = await res.json();
  //       const accessToken = data.accessToken;

  //       if (accessToken) {
  //         localStorage.setItem("accessToken", accessToken);
  //         console.log("🔥 accessToken 저장됨:", accessToken);
  //       }
  //     } catch (err) {
  //       console.error("accessToken 받기 실패", err);
  //     }
  //   })();
  // }, []);

  return <div>로그인 성공! {localStorage.getItem("accessToken")}</div>;
};

export default LoginSuccessPage;
