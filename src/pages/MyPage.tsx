import React, { useEffect } from "react";
import { fetchUser } from "../api";
import { authStore } from "../store/AuthStore";

// 로그아웃 시 초기화
// authStore.getState().clearAuth();

const MyPage = () => {
  // const token = localStorage.getItem("accessToken");
  // const nickname = authStore((state) => state.nickname);
  // const email = authStore((state) => state.email);
  // const userId = authStore((state) => state.userId);
  // const picture = authStore((state) => state.picture);
  const { userId, email, nickname, picture } = authStore();

  // useEffect(() => {
  //   if (!token) return;
  //   (async () => {
  //     const res = await fetchUser();
  //   })();
  // }, [token]);

  return (
    <div>
      MyPage
      <div>
        <div>{userId}</div>
        <div>{nickname}</div>
        <div>{email}</div>
        <div>{picture}</div>
      </div>
    </div>
  );
};

export default MyPage;
