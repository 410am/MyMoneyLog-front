// src/features/records/components/FilterBar.tsx
import { useEffect, useMemo, useState } from "react";
import type { CategoryOption } from "../pages/RecordListPage";

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

type Props = {
  value: ListFilters;
  onChange: (patch: Partial<ListFilters>) => void;
  categories?: CategoryOption[]; // 옵션: 카테고리 드롭다운 값
  className?: string;
  showCategory?: boolean; // 기본 true
};

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export default function FilterBar({
  value,
  onChange,
  categories = [],
  className,
  showCategory = true,
}: Props) {
  // 검색어는 디바운스 처리 (타자 칠 때마다 리퀘 안 나가게)
  const [searchInput, setSearchInput] = useState(value.search ?? "");
  const debouncedSearch = useDebounced(searchInput, 300);

  // 외부 value가 바뀌면 입력창도 동기화
  useEffect(() => {
    setSearchInput(value.search ?? "");
  }, [value.search]);

  // 디바운스된 검색어를 필터로 반영
  useEffect(() => {
    if ((value.search ?? "") !== debouncedSearch) {
      onChange({ search: debouncedSearch || undefined });
    }
  }, [debouncedSearch]);

  const sizes = useMemo(() => [10, 20, 50], []);

  const resetFilters = () => {
    setSearchInput("");
    onChange({
      categoryId: undefined,
      type: undefined,
      from: undefined,
      to: undefined,
      search: undefined,
      sort: "date_desc",
      size: value.size ?? 20, // size는 유지하거나 기본값 유지
    });
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-6 gap-2 ${className ?? ""}`}>
      {/* 카테고리 */}
      {showCategory && (
        <label className="col-span-2 sm:col-span-2">
          <span className="sr-only">카테고리</span>
          <select
            className="w-full border rounded-lg px-3 py-2"
            value={value.categoryId ?? ""}
            onChange={(e) =>
              onChange({ categoryId: e.target.value || undefined })
            }
          >
            <option value="">전체 카테고리</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* 타입 */}
      <label
        className={`${
          showCategory ? "col-span-1" : "col-span-2"
        } sm:col-span-1`}
      >
        <span className="sr-only">구분</span>
        <select
          className="w-full border rounded-lg px-3 py-2"
          value={value.type ?? ""}
          onChange={(e) =>
            onChange({
              type: (e.target.value || undefined) as ListFilters["type"],
            })
          }
        >
          <option value="">전체</option>
          <option value="EXPENSE">지출</option>
          <option value="INCOME">수입</option>
        </select>
      </label>

      {/* 시작일 */}
      <label className="col-span-1 sm:col-span-1">
        <span className="sr-only">시작일</span>
        <input
          type="date"
          className="w-full border rounded-lg px-3 py-2"
          value={value.from ?? ""}
          onChange={(e) => onChange({ from: e.target.value || undefined })}
        />
      </label>

      {/* 종료일 */}
      <label className="col-span-1 sm:col-span-1">
        <span className="sr-only">종료일</span>
        <input
          type="date"
          className="w-full border rounded-lg px-3 py-2"
          value={value.to ?? ""}
          onChange={(e) => onChange({ to: e.target.value || undefined })}
        />
      </label>

      {/* 정렬 */}
      <label className="col-span-1 sm:col-span-1">
        <span className="sr-only">정렬</span>
        <select
          className="w-full border rounded-lg px-3 py-2"
          value={value.sort ?? "date_desc"}
          onChange={(e) =>
            onChange({ sort: e.target.value as ListFilters["sort"] })
          }
        >
          <option value="date_desc">날짜↑</option>
          <option value="date_asc">날짜↓</option>
          <option value="amount_desc">금액↑</option>
          <option value="amount_asc">금액↓</option>
        </select>
      </label>

      {/* 페이지 크기 */}
      <label className="col-span-1 sm:col-span-1">
        <span className="sr-only">페이지 크기</span>
        <select
          className="w-full border rounded-lg px-3 py-2"
          value={value.size ?? 20}
          onChange={(e) => onChange({ size: Number(e.target.value) })}
        >
          {sizes.map((s) => (
            <option key={s} value={s}>
              {s}개
            </option>
          ))}
        </select>
      </label>

      {/* 검색 */}
      <label className="col-span-2 sm:col-span-6">
        <span className="sr-only">검색</span>
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="메모 검색"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </label>

      {/* 액션 */}
      <div className="col-span-2 sm:col-span-6 flex gap-2 justify-end">
        <button
          type="button"
          onClick={resetFilters}
          className="px-3 py-2 border rounded-lg"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
