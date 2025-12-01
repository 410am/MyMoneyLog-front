// src/features/records/components/FilterBar.tsx
import { useEffect, useRef, useState } from "react";
import type { CategoryOption } from "../pages/RecordListPage";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import DateRangePicker from "./DateRangePicker";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import SearchIcon from "@mui/icons-material/Search";

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

  const [range, setRange] = useState<{ from?: string; to?: string }>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dateOpen, setDateOpen] = useState(false);

  // 🔥 바깥 클릭 감지
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setDateOpen(false);
      }
    }

    if (dateOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dateOpen]);

  const dummyCategories: CategoryOption[] = [
    { categoryId: 1, categoryName: "식비" },
    { categoryId: 2, categoryName: "카페/디저트" },
    { categoryId: 3, categoryName: "편의점/마트" },
    { categoryId: 4, categoryName: "교통비" },
    { categoryId: 5, categoryName: "주거/관리비" },
    { categoryId: 6, categoryName: "의료/건강" },
    { categoryId: 7, categoryName: "쇼핑" },
    { categoryId: 8, categoryName: "취미/여가" },
    { categoryId: 9, categoryName: "교육" },
    { categoryId: 10, categoryName: "월급" },
  ];

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

  // const sizes = useMemo(() => [10, 20, 50], []);

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
    <div
      className={`grid grid-cols-2 sm:grid-cols-4 gap-2 ${
        className ?? ""
      } h-full`}
    >
      {/* 초기화 */}
      <div className="col-span-2 sm:col-span-6 flex gap-2 h-fit w-fit ml-auto self-end pr-6 pb-2">
        <button
          type="button"
          onClick={resetFilters}
          className="text-gray-400 text-sm h-fit"
        >
          필터 초기화
        </button>
      </div>

      {/* 카테고리 */}
      {showCategory && (
        <label className="col-span-2 sm:col-span-2 ml-auto">
          <Select
            value={value.categoryId ?? undefined}
            onValueChange={(e) => onChange({ categoryId: e || undefined })}
          >
            <SelectTrigger className="w-fit px-3 py-2 text-xl font-semibold text-slate-700">
              <SelectValue placeholder="카테고리" />
            </SelectTrigger>
            {/* {categories.length > 0 && ( */}
            {dummyCategories.length > 0 && (
              <SelectContent>
                {/* {categories.map((c) => ( */}
                {dummyCategories.map((c) => (
                  <SelectItem key={c.categoryId} value={String(c.categoryId)}>
                    {c.categoryName}
                  </SelectItem>
                ))}
              </SelectContent>
            )}
          </Select>
        </label>
      )}

      {/* 날짜 */}
      <div className="relative" ref={wrapperRef}>
        <button
          onClick={() => setDateOpen(!dateOpen)}
          className="text-xl font-semibold text-slate-700 flex pt-[6px] pl-6 "
        >
          날짜
        </button>
        {dateOpen && (
          <div className="absolute left-0 mt-2 z-50 bg-white border rounded-lg shadow-lg p-2">
            <DateRangePicker
              value={range}
              onChange={(r) => setRange(r)} // 여기선 상태만 업데이트
            />

            <div className="flex justify-end gap-2 mt-2">
              <button
                type="button"
                className="px-3 py-1 text-sm border rounded"
                onClick={() => setDateOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="px-3 py-1 text-sm bg-slate-900 text-white rounded"
                onClick={() => {
                  if (range?.from && range?.to) {
                    onChange({
                      from: range.from,
                      to: range.to,
                    });
                  } else if (range?.from && !range.to) {
                    // 한 날짜만 선택된 경우 → 단일 날짜 필터로 쓰고 싶으면 이렇게
                    const d = range.from;
                    onChange({ from: d, to: d });
                  }
                  setDateOpen(false);
                }}
              >
                적용
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 타입 */}
      <label
        className={`${
          showCategory ? "col-span-1" : "col-span-2"
        } sm:col-span-1`}
      >
        <Select
          value={value.type}
          onValueChange={(v) =>
            onChange({
              type: v === "ALL" ? undefined : (v as ListFilters["type"]),
            })
          }
        >
          <SelectTrigger className="w-full px-3 py-2 text-xl font-semibold text-slate-700">
            <SelectValue placeholder="유형" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ALL">전체</SelectItem>
            <SelectItem value="EXPENSE">지출</SelectItem>
            <SelectItem value="INCOME">수입</SelectItem>
          </SelectContent>
        </Select>
      </label>

      {/* 정렬 */}
      <label className="col-span-1 sm:col-span-1">
        <Select
          value={value.sort}
          onValueChange={(e) => onChange({ sort: e as ListFilters["sort"] })}
        >
          <SelectTrigger className="w-max px-3 py-2 text-xl font-semibold text-slate-700">
            <SelectValue placeholder="정렬" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="date_desc">최신순</SelectItem>
            <SelectItem value="date_asc">날짜순</SelectItem>
            <SelectItem value="amount_desc">금액 높은 순</SelectItem>
            <SelectItem value="amount_asc">금액 낮은 순</SelectItem>
          </SelectContent>
        </Select>
      </label>

      {/* 페이지 크기 */}
      {/* <label className="col-span-1 sm:col-span-1">
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
      </label> */}

      {/* 검색 */}
      <label className="col-span-2 sm:col-span-6 ml-auto self-end pb-3 relative">
        <SearchIcon className="absolute mt-[10px] ml-[9px] text-gray-300" />
        <input
          className="w-96 border rounded-lg pr-3 py-2 pl-10"
          placeholder={"검색"}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </label>
    </div>
  );
}
