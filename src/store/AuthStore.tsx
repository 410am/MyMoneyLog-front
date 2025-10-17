// import { create } from "zustand";

// type AuthState = {
//   userId: number | null;
//   email: string | null; // 현재 로그인한 유저 email
//   nickname: string | null;
//   picture: string | null;
//   setUserId: (id: number | null) => void;
//   clearId: () => void;
//   setUserEmail: (email: string | null) => void; // email 변경 함수
//   clearEmail: () => void; // 로그아웃 시 초기화
//   setNickname: (nickname: string | null) => void;
//   clearNickname: () => void;
//   setPicture: (picture: string | null) => void;
//   clearPicture: () => void;
// };

// export const authStore = create<AuthState>((set) => ({
//   userId: null,
//   email: null,
//   nickname: null,
//   picture: null,
//   setUserId: (id) => set({ userId: id }),
//   clearId: () => set({ userId: null }),
//   setUserEmail: (email) => set({ email: email }),
//   clearEmail: () => set({ email: null }),
//   setNickname: (nickname) => set({ nickname: nickname }),
//   clearNickname: () => set({ nickname: null }),
//   setPicture: (picture) => set({ picture: picture }),
//   clearPicture: () => set({ picture: null }),
// }));

import { create } from "zustand";
import { persist } from "zustand/middleware";

type userAuthState = {
  userId: number | null;
  email: string | null;
  nickname: string | null;
  picture: string | null;
  setAuth: (user: Partial<userAuthState>) => void;
  clearAuth: () => void;
};

export const authStore = create<userAuthState>()(
  persist(
    (set) => ({
      userId: null,
      email: null,
      nickname: null,
      picture: null,

      // 상태 업데이트
      setAuth: (user) => set(user),

      // 초기화
      clearAuth: () =>
        set({ userId: null, email: null, nickname: null, picture: null }),
    }),
    {
      name: "user-auth-storage", // localStorage 키 이름
      // getStorage: () => localStorage, // 기본값이라 안 적어도 됨
    }
  )
);
