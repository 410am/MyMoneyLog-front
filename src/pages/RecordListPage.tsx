// src/features/records/pages/RecordListPage.tsx
import { useEffect, useState } from "react";
import { useListFilters } from "../hooks/useListFilters";
import {
  fetchCategories,
  fetchRecords,
  type PageResp,
  type RecordItem,
} from "../api";
import FilterBar from "../components/FilterBar";
import { authStore } from "../store/AuthStore";

import { ConfirmModal } from "../components/ConfirmModal";
import Category from "./Category";
import Record from "./Record";

export type CategoryOption = { categoryId: number; categoryName: string };

export default function RecordListPage() {
  const { filters, update, toPage } = useListFilters();
  const [data, setData] = useState<PageResp<RecordItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // const email = authStore((state) => state.email);
  const userId = authStore((state) => state.userId);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetchRecords(filters);
        if (!cancel) setData(res);
      } catch (e: any) {
        if (!cancel) setErr(e?.message ?? "failed");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchRecords(filters);
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  const list = data?.content ?? [];

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetchCategories();
        if (!cancel) {
          const uniq: CategoryOption[] = Array.from(
            new Map<number, CategoryOption>(
              res.map((c: CategoryOption) => [
                c.categoryId,
                {
                  categoryId: Number(c.categoryId),
                  categoryName: c.categoryName,
                },
              ])
            ).values()
          );
          setCategoryList(uniq);
        }
      } catch (e: any) {
        if (!cancel) setErr(e?.message ?? "failed");
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [userId]);

  const [categoryList, setCategoryList] = useState<CategoryOption[]>([]);

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      <ConfirmModal
        triggerLabel="카테고리 수정"
        title="카테고리"
        component={<Category />}
        cancelLabel="취소"
      />

      <FilterBar value={filters} onChange={update} categories={categoryList} />

      <ConfirmModal
        triggerLabel="기록 추가"
        title="기록 추가"
        component={<Record onCreated={fetchData} />}
        cancelLabel="취소"
      />

      {loading && <div>불러오는 중…</div>}
      {err && <div className="text-red-500">에러: {err}</div>}

      {list.length > 0 && (
        <>
          <ul className="divide-y rounded-lg border bg-white">
            {list.map((r) => (
              <li key={r.recordId} className="p-4 flex justify-between">
                <div>
                  <div className="text-xs text-gray-500">
                    {r.date} · {r.categoryName}
                  </div>
                  {r.memo && <div className="text-sm">{r.memo}</div>}
                </div>
                <div
                  className={
                    r.type === "EXPENSE"
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {r.type === "EXPENSE" ? "-" : "+"}
                  {Number(r.amount).toLocaleString("ko-KR")}원
                </div>
              </li>
            ))}
          </ul>

          <div className="flex justify-center items-center gap-3 py-3">
            <button
              className="px-3 py-1 border rounded disabled:opacity-40"
              onClick={() => toPage((data!.number ?? 0) - 1)}
              disabled={!data || data.number <= 0}
            >
              이전
            </button>
            <span className="text-sm">
              {(data?.number ?? 0) + 1} / {data?.totalPages ?? 1}
            </span>
            <button
              className="px-3 py-1 border rounded disabled:opacity-40"
              onClick={() => toPage((data!.number ?? 0) + 1)}
              disabled={!data || data.number + 1 >= data.totalPages}
            >
              다음
            </button>
          </div>
        </>
      )}

      {!loading && !err && list.length === 0 && (
        <div className="text-center text-gray-500 py-10">기록이 없어요.</div>
      )}

      {/* 개발 중 확인용 */}
      {/* <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}
