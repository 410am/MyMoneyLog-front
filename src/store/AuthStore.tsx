import { create } from "zustand";

type AuthState = {
  email: number | null; // 현재 로그인한 유저 ID
  setUserEmail: (id: number | null) => void; // userId 변경 함수
  clearEmail: () => void; // 로그아웃 시 초기화
};

export const authStore = create<AuthState>((set) => ({
  email: null,
  setUserEmail: (id) => set({ email: id }),
  clearEmail: () => set({ email: null }),
}));
