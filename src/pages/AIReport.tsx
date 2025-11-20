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

export const dummyAIReport = {
  month: "2025-11",
  content: `
이번 달은 외식비 비중이 40%로 높게 나타났어요.
특히 '식비'와 '카페/디저트' 항목에서 지출이 집중됐습니다.
출퇴근 교통비는 전월 대비 12% 감소했습니다.

👉 지출 패턴 요약
- 주중에는 점심 지출이 일정하게 발생
- 주말에는 카페/영화 등의 여가 소비 비중이 높음

💡 절약 팁
카페 횟수를 주 4회 → 2회로 줄이면 한 달에 약 15,000원을 아낄 수 있습니다 ☕️
`,
};

import React from "react";

const AIReport = () => {
  return <div>AIReport</div>;
};

export default AIReport;
