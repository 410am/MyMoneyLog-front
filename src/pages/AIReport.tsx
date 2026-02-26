// import React, { useEffect, useState } from "react";
// import { api } from "../api";

// interface Category {
//   id?: number;
//   categoryId?: number;
//   name: string;
// }

// const AIReport = () => {
//   const [cats, setCats] = useState<Category[]>([]);
//   useEffect(() => {
//     api
//       .get("/category/user/1")
//       .then((r) => setCats(r.data?.data))
//       .catch(console.error);
//   }, []);
//   return (
//     <div style={{ padding: 16 }}>
//       <h2>소비 기록 추가</h2>
//       <select>
//         {cats.map((c) => (
//           <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
//             {c.name}
//           </option>
//         ))}
//       </select>
//       {/* 날짜/금액/메모 인풋은 내일 붙여도 됨 */}
//     </div>
//   );
// };

// export default AIReport;

import { useEffect, useState } from "react";
import { postAiReportCurrent } from "../api";
import CheckIcon from "@mui/icons-material/Check";

const AIReport = () => {
  // const [summary, setSummary] = useState({
  //   month: null,
  //   rangeEndExclusive: "",
  //   rangeStart: "",
  //   smallPaymentCount: 0,
  //   topCategories: [],
  //   topCategory: null,
  //   topCategoryAmount: 0,
  //   topCategoryPercent: 0,
  //   topDayOfWeek: null,
  //   totalExpense: 0,
  //   totalIncome: 0,
  //   transactionCount: 0,
  //   year: null,
  // });

  const [aiReport, setAiReport] = useState({
    highlights: ["총 지출: 0원", "총 수입: 0원", "Top 카테고리: 없음"],
    oneLiner: "이번 달 데이터가 쌓이면 패턴을 더 잘 보여줄 수 있어.",
    tips: [
      "한 달치 데이터가 최소 10건 이상 쌓아보세요.",
      "카테고리를 '미분류' 없이 넣어두면 분석이 더 좋아져요",
      "지출 메모를 남겨보세요.",
    ],
    title: "2월 소비 리포트",
  });

  // useEffect(() => {
  //   (async () => {
  //     const res = await getMonthSummary();
  //     setSummary(res);
  //     console.log(res);
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      const res = await postAiReportCurrent();
      setAiReport(res);
      console.log(res);
    })();
  }, []);

  return (
    <div>
      <div className="text-2xl mb-14 ml-3 mt-3">{aiReport.title}</div>
      <div className="w-3/4">
        <div className="border-l-4 border-[#8556C1] pl-4 ml-5 text-xl font-semibold mb-12">
          {aiReport.oneLiner}
        </div>
        <div>
          <div className="flex ml-5 mb-12">
            <CheckIcon className="text-[#8556C1] mr-3 " fontSize="large" />
            <div className="font-semibold">{aiReport.tips[0]}</div>
          </div>
          <div className="flex ml-5 mb-12">
            <CheckIcon className="text-[#8556C1] mr-3" fontSize="large" />
            <div className="font-semibold">{aiReport.tips[1]}</div>
          </div>
          <div className="flex ml-5 mb-12">
            <CheckIcon className="text-[#8556C1] mr-3" fontSize="large" />
            <div className="font-semibold">{aiReport.tips[2]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIReport;
