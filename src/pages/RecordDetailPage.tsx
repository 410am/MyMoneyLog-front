import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  deleteRecord,
  fetchCategories,
  fetchRecordById,
  RecordItem,
  updateRecord,
} from "../api";
import EditIcon from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { Category } from "./Category";
import { authStore } from "../store/AuthStore";

export default function RecordDetailPage() {
  const userId = authStore((state) => state.userId);
  const { recordId } = useParams();
  const [record, setRecord] = useState<RecordItem>();
  const [editButton, setEditButton] = useState<boolean>(false);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await fetchCategories();
      setCategoryList(res);
    })();
  }, [userId]);

  useEffect(() => {
    (async () => {
      if (recordId) {
        const res = await fetchRecordById(Number(recordId));
        setRecord(res);
      }
    })();
  }, [recordId]);

  if (!record) return <div>로딩 중...</div>;

  const handleEditRecord = async () => {
    try {
      // 1️⃣ 서버에 수정 요청 보내기
      const res = await updateRecord(record);
      console.log(res);

      // 2️⃣ 기존 리스트에서 해당 항목만 교체
      setCategoryList((prev) =>
        prev.map((category) =>
          category.categoryId === res.categoryId
            ? res // 서버 응답으로 교체
            : category
        )
      );
    } catch (error) {
      console.error("기록 수정 실패:", error);
    }
  };

  const handleDeleteRecord = async (recordId: number | null) => {
    try {
      if (recordId === null) {
        alert("유효하지 않은 기록입니다.");
      } else {
        await deleteRecord(recordId);
        alert("삭제되었습니다.");
        navigate("/list");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {editButton ? (
        <form onSubmit={handleEditRecord}>
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            <h1 className="text-xl font-bold mb-4">기록 수정</h1>
            <strong>날짜</strong>
            <label className="col-span-1 sm:col-span-1">
              <span className="sr-only">날짜</span>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2"
                value={record.date ?? ""}
                onChange={(e) => setRecord({ ...record, date: e.target.value })}
              />
            </label>
            <select
              value={record.categoryId ?? ""}
              onChange={(e) =>
                setRecord({
                  ...record,
                  categoryId:
                    e.target.value === "" ? null : Number(e.target.value),
                })
              }
            >
              <option value="" disabled hidden>
                카테고리 선택
              </option>
              {categoryList.map((c) => (
                <option key={c.categoryId} value={String(c.categoryId!)}>
                  {c.categoryName}
                </option>
              ))}
            </select>
            <select
              value={record.type}
              onChange={(e) => setRecord({ ...record, type: e.target.value })}
            >
              <option value="" disabled hidden>
                유형
              </option>
              <option value="EXPENSE">지출</option>
              <option value="INCOME">수입</option>
            </select>
            <strong>금액:</strong>
            <input
              value={record.amount}
              onChange={(e) =>
                setRecord({ ...record, amount: Number(e.target.value) })
              }
              placeholder={`${record.amount}`}
            />
            <strong>메모:</strong>
            <input
              value={record.memo}
              onChange={(e) => setRecord({ ...record, memo: e.target.value })}
              placeholder={record.memo}
            />
          </div>

          <button type="submit">저장</button>
        </form>
      ) : (
        <div className="max-w-2xl mx-auto p-4 space-y-4">
          <h1 className="text-xl font-bold mb-4">기록 상세보기</h1>
          <p>
            <strong>날짜:</strong> {record.date}
          </p>
          <p>
            <strong>카테고리:</strong> {record.categoryName}
          </p>
          <p>
            <strong>유형:</strong> {record.type}
          </p>
          <p>
            <strong>금액:</strong> {record.amount.toLocaleString("ko-KR")}원
          </p>
          <p>
            <strong>메모:</strong> {record.memo}
          </p>
        </div>
      )}
      <button type="button" onClick={() => setEditButton(true)}>
        <EditIcon />
      </button>
      <button type="button" onClick={() => handleDeleteRecord(record.recordId)}>
        <Delete />
      </button>
    </div>
  );
}
