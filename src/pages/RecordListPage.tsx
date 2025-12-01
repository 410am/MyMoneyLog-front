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
import RecordCreation from "./RecordCreation";
import { useNavigate } from "react-router-dom";

export type CategoryOption = { categoryId: number; categoryName: string };
export type SummaryOption = {
  incomeTotal: number;
  expenseTotal: number;
  incomeCount: number;
  expenseCount: number;
  balance: number;
};

//더미데이터
export const dummyRecords = [
  {
    recordId: 1,
    userId: 1,
    categoryId: 1,
    categoryName: "월급",
    type: "INCOME",
    amount: 2600000,
    memo: "10월 급여",
    date: "2025-10-31",
  },
  {
    recordId: 2,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 8700,
    memo: "편의점 도시락",
    date: "2025-11-01",
  },
  {
    recordId: 3,
    userId: 1,
    categoryId: 3,
    categoryName: "카페/디저트",
    type: "EXPENSE",
    amount: 4200,
    memo: "아이스 아메리카노",
    date: "2025-11-01",
  },
  {
    recordId: 4,
    userId: 1,
    categoryId: 4,
    categoryName: "교통비",
    type: "EXPENSE",
    amount: 1250,
    memo: "지하철",
    date: "2025-11-01",
  },
  {
    recordId: 5,
    userId: 1,
    categoryId: 7,
    categoryName: "기타",
    type: "EXPENSE",
    amount: 19000,
    memo: "영화 관람",
    date: "2025-11-02",
  },
  {
    recordId: 6,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 13200,
    memo: "점심 돈까스",
    date: "2025-11-02",
  },
  {
    recordId: 7,
    userId: 1,
    categoryId: 6,
    categoryName: "주거비",
    type: "EXPENSE",
    amount: 550000,
    memo: "월세",
    date: "2025-11-02",
  },
  {
    recordId: 8,
    userId: 1,
    categoryId: 3,
    categoryName: "카페/디저트",
    type: "EXPENSE",
    amount: 5200,
    memo: "투썸 조각케이크",
    date: "2025-11-03",
  },
  {
    recordId: 9,
    userId: 1,
    categoryId: 4,
    categoryName: "교통비",
    type: "EXPENSE",
    amount: 1250,
    memo: "버스",
    date: "2025-11-03",
  },
  {
    recordId: 10,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 8700,
    memo: "사무실 점심",
    date: "2025-11-03",
  },
  {
    recordId: 11,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 15800,
    memo: "저녁 치킨",
    date: "2025-11-04",
  },
  {
    recordId: 12,
    userId: 1,
    categoryId: 3,
    categoryName: "카페/디저트",
    type: "EXPENSE",
    amount: 3800,
    memo: "편의점 커피",
    date: "2025-11-04",
  },
  {
    recordId: 13,
    userId: 1,
    categoryId: 2,
    categoryName: "용돈",
    type: "INCOME",
    amount: 100000,
    memo: "엄마 용돈",
    date: "2025-11-04",
  },
  {
    recordId: 14,
    userId: 1,
    categoryId: 4,
    categoryName: "교통비",
    type: "EXPENSE",
    amount: 1250,
    memo: "지하철",
    date: "2025-11-05",
  },
  {
    recordId: 15,
    userId: 1,
    categoryId: 3,
    categoryName: "카페/디저트",
    type: "EXPENSE",
    amount: 4800,
    memo: "스타벅스",
    date: "2025-11-05",
  },
  {
    recordId: 16,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 9200,
    memo: "점심 제육덮밥",
    date: "2025-11-05",
  },
  {
    recordId: 17,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 7900,
    memo: "편의점 샌드위치",
    date: "2025-11-06",
  },
  {
    recordId: 18,
    userId: 1,
    categoryId: 7,
    categoryName: "기타",
    type: "EXPENSE",
    amount: 32000,
    memo: "선물 구입",
    date: "2025-11-06",
  },
  {
    recordId: 19,
    userId: 1,
    categoryId: 3,
    categoryName: "카페/디저트",
    type: "EXPENSE",
    amount: 4900,
    memo: "디저트 카페",
    date: "2025-11-06",
  },
  {
    recordId: 20,
    userId: 1,
    categoryId: 4,
    categoryName: "교통비",
    type: "EXPENSE",
    amount: 1350,
    memo: "버스",
    date: "2025-11-07",
  },
  {
    recordId: 21,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 11500,
    memo: "점심 김밥천국",
    date: "2025-11-07",
  },
  {
    recordId: 22,
    userId: 1,
    categoryId: 3,
    categoryName: "카페/디저트",
    type: "EXPENSE",
    amount: 3900,
    memo: "아메리카노",
    date: "2025-11-07",
  },
  {
    recordId: 23,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 8700,
    memo: "편의점 점심",
    date: "2025-11-08",
  },
  {
    recordId: 24,
    userId: 1,
    categoryId: 3,
    categoryName: "카페/디저트",
    type: "EXPENSE",
    amount: 5400,
    memo: "카페라떼",
    date: "2025-11-08",
  },
  {
    recordId: 25,
    userId: 1,
    categoryId: 7,
    categoryName: "기타",
    type: "EXPENSE",
    amount: 21000,
    memo: "영화 + 팝콘",
    date: "2025-11-09",
  },
  {
    recordId: 26,
    userId: 1,
    categoryId: 4,
    categoryName: "교통비",
    type: "EXPENSE",
    amount: 1350,
    memo: "지하철",
    date: "2025-11-09",
  },
  {
    recordId: 27,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 8800,
    memo: "점심 짜장면",
    date: "2025-11-09",
  },
  {
    recordId: 28,
    userId: 1,
    categoryId: 3,
    categoryName: "카페/디저트",
    type: "EXPENSE",
    amount: 4900,
    memo: "커피빈",
    date: "2025-11-09",
  },
  {
    recordId: 29,
    userId: 1,
    categoryId: 2,
    categoryName: "용돈",
    type: "INCOME",
    amount: 50000,
    memo: "용돈",
    date: "2025-11-10",
  },
  {
    recordId: 30,
    userId: 1,
    categoryId: 5,
    categoryName: "식비",
    type: "EXPENSE",
    amount: 9700,
    memo: "회사 점심",
    date: "2025-11-10",
  },
];

export default function RecordListPage() {
  const { filters, update } = useListFilters();
  const [data, setData] = useState<PageResp<RecordItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  // const email = authStore((state) => state.email);
  const userId = authStore((state) => state.userId);
  const navigate = useNavigate();
  const [categoryList, setCategoryList] = useState<CategoryOption[]>([]);
  const [monthSummary, setMonthSummary] = useState<SummaryOption>();

  useEffect(() => {
    let oncancel = false;
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await fetchRecords(filters);
        if (!oncancel) setData(res);
      } catch (e: any) {
        if (!oncancel) setErr(e?.message ?? "failed");
      } finally {
        if (!oncancel) setLoading(false);
      }
    })();
    return () => {
      oncancel = true;
    };
  }, [filters]);

  // 이번 달 요약
  useEffect(() => {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1); // 이번 달 1일
    const to = new Date(now.getFullYear(), now.getMonth() + 1, 0); // 이번 달 말일

    const monthFilter = {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
    };
    (async () => {
      const res = await fetchRecords(monthFilter);

      const records = res.content;

      const totals = records.reduce(
        (acc, record) => {
          if (record.type === "INCOME") {
            acc.incomeTotal += +record.amount;
            acc.incomeCount++;
          }
          if (record.type === "EXPENSE") {
            acc.expenseTotal += +record.amount;
            acc.expenseCount++;
          }
          return acc;
        },
        { incomeTotal: 0, expenseTotal: 0, incomeCount: 0, expenseCount: 0 }
      );

      const balance = totals.incomeTotal - totals.expenseTotal;

      setMonthSummary({ ...totals, balance });
    })();
  }, []);

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

  const now = new Date();

  return (
    <div className="max-w-6xl mx-auto pb-4 space-y-4 pl-10">
      {location.pathname === "/" ? (
        ""
      ) : (
        <div className="border-b-2 pb-2 h-[30vh] flex">
          <div className=" w-3/4 pl-10 p-3 pb-5">
            <div className="h-2/5  place-items-end place-content-end pr-5">
              <div className="text-md font-bold pb-1  text-gray-400">
                {now.getMonth() + 1}월의 수입
              </div>
              <div className="text-3xl font-semibold text-gray-400">
                {monthSummary?.incomeTotal.toLocaleString("ko-KR")}원
                {/* 2,341,560원 */}
              </div>
            </div>
            <div className="h-3/5 place-content-end pb-5">
              <div className="text-2xl font-semibold pb-2 text-slate-700">
                {now.getMonth() + 1}월의 지출
              </div>
              <div className="text-6xl font-semibold text-slate-700">
                {monthSummary?.expenseTotal.toLocaleString("ko-KR")}원
                {/* 1,567,890원 */}
              </div>
            </div>
            {/* <div>이번 달 수입 수 : {monthSummary?.incomeCount}회</div>
          <div>이번 달 소비 수 : {monthSummary?.expenseCount}회</div> */}
            {/* <div>현재 금액 : ${monthSummary?.balance}</div> */}
          </div>

          <div className="relative w-full">
            <div className="absolute h-full w-full justify-end pr-6">
              <FilterBar
                value={filters}
                onChange={update}
                categories={categoryList}
              />
            </div>

            {/* <div className="absolute pt-[93px] pl-[130px] h-full "> */}
            <div className="absolute w-1/3 flex h-1/3 mt-1">
              <div className="ml-auto content-end mr-2">
                <ConfirmModal
                  triggerLabel="수정"
                  title="카테고리"
                  component={<Category />}
                  cancelLabel="취소"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-fit w-full">
        <div className="w-fit">
          <ConfirmModal
            triggerLabel="기록 추가"
            title=""
            component={<RecordCreation onCreated={fetchData} />}
            cancelLabel="취소"
          />
        </div>
      </div>
      {loading && <div>불러오는 중…</div>}
      {err && <div className="text-red-500">에러: {err}</div>}

      <ul className="list-none pl-0">
        {/* {dummyRecords.length > 0 && ( */}
        {list.length > 0 && (
          <>
            {/* {dummyRecords.map((r) => ( */}
            {list.map((r) => (
              <li
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/list/${r.recordId}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ")
                    navigate(`/records/${r.recordId}`);
                }}
                className="cursor-pointer hover:bg-gray-50 transition rounded-md p-3 flex justify-between"
                key={r.recordId}
              >
                <div className="mb-3">
                  <div className="text-sm text-gray-500">
                    {r.date} · {r.categoryName}
                  </div>
                  {r.memo && <div className="text-lg mt-1">{r.memo}</div>}
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
          </>
        )}
      </ul>

      {/* {location.pathname === "/" ? (
        ""
      ) : (
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
      )} */}

      {!loading && !err && list.length === 0 && (
        <div className="text-center text-gray-500 py-10">기록이 없어요.</div>
      )}

      {/* 개발 중 확인용 */}
      {/* <pre className="text-xs bg-gray-50 p-2 rounded">{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}
