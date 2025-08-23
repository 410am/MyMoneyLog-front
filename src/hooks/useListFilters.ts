// src/features/records/hooks/useListFilters.ts
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export type ListFilters = {
  categoryId?: string;
  type?: "INCOME" | "EXPENSE";
  from?: string; // 'YYYY-MM-DD'
  to?: string; // 'YYYY-MM-DD'
  search?: string;
  sort?: "date_desc" | "date_asc" | "amount_desc" | "amount_asc";
  page?: number;
  size?: number;
};

const SORTS = ["date_desc", "date_asc", "amount_desc", "amount_asc"] as const;
type SortUnion = (typeof SORTS)[number];

export function useListFilters() {
  const [sp, setSp] = useSearchParams();

  const filters: ListFilters = useMemo(() => {
    // type 안전 파싱
    const t = sp.get("type");
    const type: ListFilters["type"] =
      t === "INCOME" || t === "EXPENSE" ? t : undefined;

    // sort 안전 파싱 (허용 목록에 없으면 기본값)
    const s = sp.get("sort");
    const sort: SortUnion = (SORTS as readonly string[]).includes(s || "")
      ? (s as SortUnion)
      : "date_desc";

    // 숫자 파싱 (NaN 방어)
    const pageVal = Number(sp.get("page"));
    const page = Number.isFinite(pageVal) && pageVal >= 0 ? pageVal : 0;

    const sizeVal = Number(sp.get("size"));
    const size = Number.isFinite(sizeVal) && sizeVal > 0 ? sizeVal : 20;

    return {
      categoryId: sp.get("categoryId") || undefined,
      type,
      from: sp.get("from") || undefined,
      to: sp.get("to") || undefined,
      search: sp.get("search") || undefined,
      sort,
      page,
      size,
    };
  }, [sp]);

  // 필터 변경 시 page는 0으로 리셋
  const update = (patch: Partial<ListFilters>) => {
    const next = new URLSearchParams(sp);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    if (!("page" in patch)) next.set("page", "0");
    setSp(next);
  };

  const toPage = (n: number) => {
    const next = new URLSearchParams(sp);
    next.set("page", String(n));
    setSp(next);
  };

  return { filters, update, toPage };
}
