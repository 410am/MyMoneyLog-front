import React, { useEffect, useState } from "react";
import { api } from "../api";

interface Category {
  id?: number;
  categoryId?: number;
  name: string;
}

const AIReport = () => {
  const [cats, setCats] = useState<Category[]>([]);
  useEffect(() => {
    api
      .get("/category/user/1")
      .then((r) => setCats(r.data?.data))
      .catch(console.error);
  }, []);
  return (
    <div style={{ padding: 16 }}>
      <h2>소비 기록 추가</h2>
      <select>
        {cats.map((c) => (
          <option key={c.id || c.categoryId} value={c.id || c.categoryId}>
            {c.name}
          </option>
        ))}
      </select>
      {/* 날짜/금액/메모 인풋은 내일 붙여도 됨 */}
    </div>
  );
};

export default AIReport;
