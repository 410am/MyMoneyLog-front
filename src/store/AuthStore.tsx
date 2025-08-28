import { create } from "zustand";

type AuthState = {
  userId: number | null;
  email: number | null; // 현재 로그인한 유저 email
  setUserId: (id: number | null) => void;
  clearId: () => void;
  setUserEmail: (email: number | null) => void; // email 변경 함수
  clearEmail: () => void; // 로그아웃 시 초기화
};

export const authStore = create<AuthState>((set) => ({
  userId: null,
  email: null,
  setUserId: (id) => set({ userId: id }),
  clearId: () => set({ userId: null }),
  setUserEmail: (email) => set({ email: email }),
  clearEmail: () => set({ email: null }),
}));
