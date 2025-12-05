import { useEffect, useState } from "react";
import { fetchDashboard } from "../api";

const Summary = () => {
  const now = new Date();

  const finalYear = now.getFullYear();
  const finalMonth = now.getMonth() + 1;

  const [summaryData, setSummaryData] = useState({
    balance: 0,
    expenseCount: 0,
    incomeCount: 0,
    totalExpense: 0,
    totalIncome: 0,
  });

  useEffect(() => {
    (async () => {
      const res = await fetchDashboard(finalYear, finalMonth);

      setSummaryData(res.summary);
    })();
  }, []);

  return (
    <div className="grid grid-row-2 mb-36">
      <div className=" h-[20vh] grid grid-cols-4 gap-3 my-3">
        <div className="rounded-xl bg-gradient-to-r to-[#6C95FF]  from-[#3D69DB] pt-10 pl-4">
          <div className="text-neutral-50 opacity-50 font-bold text-xl">
            총 수입
          </div>
          <div className="text-neutral-100 font-semibold text-2xl mt-1">
            {summaryData.totalIncome.toLocaleString("ko-KR")} 원
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#DA1CC7]  to-[#EA45AB]  pt-10 pl-4 rounded-xl">
          <div className="text-neutral-50 opacity-50 font-bold text-xl">
            총 지출
          </div>
          <div className="text-neutral-100 font-semibold text-2xl mt-1">
            {summaryData.totalExpense.toLocaleString("ko-KR")} 원
          </div>
        </div>
        <div className="bg-gradient-to-r from-[#2EAF4A]  to-[#8DD234]  rounded-xl  pt-10 pl-4">
          <div className="text-neutral-50 opacity-50 font-bold text-xl">
            총 잔액
          </div>
          <div className="text-neutral-100 font-semibold text-2xl mt-1">
            {summaryData.balance.toLocaleString("ko-KR")} 원
          </div>
        </div>
        <div className="flex w-full gap-3">
          <div className="bg-gradient-to-r from-[#FFA700]  to-[#FFC14E] pt-10 pl-3 w w-1/2 rounded-xl">
            <div className="text-neutral-50 opacity-65 font-bold text-xl">
              수입
            </div>
            <div className="text-neutral-100 font-semibold text-2xl mt-1">
              {summaryData.incomeCount.toLocaleString("ko-KR")} 건
            </div>
          </div>
          <div className="bg-gradient-to-r from-[#8555C1]  to-[#B469FF] pt-10 pl-3 w-1/2 rounded-xl">
            <div className="text-neutral-50 opacity-50 font-bold text-xl">
              지출
            </div>
            <div className="text-neutral-100 font-semibold text-2xl mt-1">
              {summaryData.expenseCount.toLocaleString("ko-KR")} 건
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
