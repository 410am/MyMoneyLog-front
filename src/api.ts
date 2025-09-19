// // src/features/records/api.ts
// import axios from "axios";
// import type { ListFilters } from "./hooks/useListFilters";

// export const api = axios.create({
//   baseURL: "http://localhost:8080",
//   withCredentials: true,
// });

// export type RecordItem = {
//   recordId: number;
//   categoryId?: number;
//   categoryName: string;
//   type: "INCOME" | "EXPENSE";
//   amount: number;
//   date: string;
//   memo?: string;
// };

// export type PageResp<T> = {
//   content: T[];
//   number: number;
//   totalPages: number;
//   size: number;
//   totalElements: number;
// };

// // 안전한 타입가드
// const isObj = (v: unknown): v is Record<string, unknown> =>
//   typeof v === "object" && v !== null;

// function mapRecord(r: any): RecordItem {
//   return {
//     recordId: Number(r.recordId ?? r.id),
//     categoryId:
//       typeof r.categoryId === "number" ? r.categoryId : r.category?.categoryId,
//     categoryName: String(r.categoryName ?? r.category?.name ?? ""),
//     type: r.type as "INCOME" | "EXPENSE",
//     amount: Number(r.amount),
//     date: String(r.date),
//     memo: r.memo ?? "",
//   };
// }

// function normalizePage(raw: any): PageResp<RecordItem> {
//   const body = isObj(raw) && "data" in raw ? raw.data : raw;

//   // 배열로 오는 경우
//   if (Array.isArray(body)) {
//     const content = body.map(mapRecord);
//     return {
//       content,
//       number: 0,
//       totalPages: 1,
//       size: content.length,
//       totalElements: content.length,
//     };
//   }

//   // Page로 오는 경우
//   if (isObj(body) && Array.isArray((body as any).content)) {
//     const b: any = body;
//     return {
//       content: b.content.map(mapRecord),
//       number: Number(b.number ?? 0),
//       totalPages: Number(b.totalPages ?? 1),
//       size: Number(b.size ?? b.content.length ?? 0),
//       totalElements: Number(b.totalElements ?? b.content.length ?? 0),
//     };
//   }

//   // 안전 기본값
//   return { content: [], number: 0, totalPages: 0, size: 0, totalElements: 0 };
// }

// // 요청 인터셉터 (항상 accessToken 붙이기)
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // 응답 인터셉터 (401 → refresh → 재요청)
// api.interceptors.response.use(
//   (response) => response, // 정상 응답은 그대로
//   async (error) => {
//     const originalRequest = error.config;
//     console.log("🚨 axios interceptor 실행됨", error.response?.status);
//     // accessToken 만료(401) + 재시도 안 한 요청일 경우
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true; // 무한 루프 방지

//       try {
//         // refresh API 호출 (쿠키 자동 전송됨)
//         const res = await api.post(
//           "/token/refresh",
//           {},
//           { withCredentials: true }
//         );

//         // 새 accessToken 받기
//         const newAccessToken = res.data.data.jwt;
//         localStorage.setItem("accessToken", newAccessToken);

//         // Authorization 헤더 갱신 후 재요청
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error("리프레시 실패:", refreshError);
//         // 로그인 페이지로 보내버림
//         window.location.href = "/auth/google";
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export async function fetchRecords(params: ListFilters) {
//   const res = await api.get("/record/user/1", { params });
//   return normalizePage(res.data);
// }

// export async function fetchCategories() {
//   const res = await api.get("/category/user/1");
//   return res.data.data;
// }

// src/features/records/api.ts
import axios from "axios";
import type { ListFilters } from "./hooks/useListFilters";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

export type RecordItem = {
  recordId: number;
  categoryId?: number;
  categoryName: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  date: string;
  memo?: string;
};

export type PageResp<T> = {
  content: T[];
  number: number;
  totalPages: number;
  size: number;
  totalElements: number;
};

// 안전한 타입가드
const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

function mapRecord(r: any): RecordItem {
  return {
    recordId: Number(r.recordId ?? r.id),
    categoryId:
      typeof r.categoryId === "number" ? r.categoryId : r.category?.categoryId,
    categoryName: String(r.categoryName ?? r.category?.name ?? ""),
    type: r.type as "INCOME" | "EXPENSE",
    amount: Number(r.amount),
    date: String(r.date),
    memo: r.memo ?? "",
  };
}

function normalizePage(raw: any): PageResp<RecordItem> {
  const body = isObj(raw) && "data" in raw ? raw.data : raw;

  // 배열로 오는 경우
  if (Array.isArray(body)) {
    const content = body.map(mapRecord);
    return {
      content,
      number: 0,
      totalPages: 1,
      size: content.length,
      totalElements: content.length,
    };
  }

  // Page로 오는 경우
  if (isObj(body) && Array.isArray((body as any).content)) {
    const b: any = body;
    return {
      content: b.content.map(mapRecord),
      number: Number(b.number ?? 0),
      totalPages: Number(b.totalPages ?? 1),
      size: Number(b.size ?? b.content.length ?? 0),
      totalElements: Number(b.totalElements ?? b.content.length ?? 0),
    };
  }

  // 안전 기본값
  return { content: [], number: 0, totalPages: 0, size: 0, totalElements: 0 };
}

// 요청 인터셉터 (항상 accessToken 붙이기)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 (401 → refresh → 재요청)
api.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로
  async (error) => {
    const originalRequest = error.config;
    console.log("🚨 axios interceptor 실행됨", error.response?.status);

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // refresh API 호출 (쿠키 자동 전송됨)
        const res = await api.post(
          "/auth/refresh",
          {},
          {
            withCredentials: true,
            headers: {
              "Cache-Control": "no-cache",
              Pragma: "no-cache",
            },
          }
        );

        // 백엔드 응답: { accessToken: "..." }
        console.log("🔄 새 accessToken:", res.data);
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        console.log(
          "✅ 로컬스토리지 저장 완료:",
          localStorage.getItem("accessToken")
        );

        // Authorization 헤더 갱신 후 재요청
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("리프레시 실패:", refreshError);
        // window.location.href = "/auth/google";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export async function fetchRecords(params: ListFilters) {
  const res = await api.get("/record/user/me", { params });
  return normalizePage(res.data);
}

export async function fetchCategories() {
  const res = await api.get("/category/user/me");
  return res.data.data;
}
