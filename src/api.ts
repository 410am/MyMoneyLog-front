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

export async function fetchRecords(params: ListFilters) {
  const res = await api.get("/record/user/1", { params });
  return normalizePage(res.data);
}

export async function fetchCategories() {
  const res = await api.get("/category/user/1");
  return res.data.data;
}
