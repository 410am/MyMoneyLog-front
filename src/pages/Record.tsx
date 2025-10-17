import { useEffect, useState } from "react";
import { authStore } from "../store/AuthStore";
import { Category } from "./Category";
import { createRecord, fetchCategories, RecordItem } from "../api";
import { Button } from "../components/ui/button";
import { DialogClose } from "../components/ui/dialog";

type RecordProps = {
  onCreated?: () => Promise<void>;
};

const Record = ({ onCreated }: RecordProps) => {
  const userId = authStore((state) => state.userId);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [newRecord, setNewRecord] = useState<RecordItem>({
    recordId: null,
    userId,
    categoryId: null,
    categoryName: "",
    type: "",
    amount: 0,
    memo: "",
    date: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    (async () => {
      const res = await fetchCategories();
      setCategoryList(res);
    })();
  }, [userId]);

  const handleCreateSubmit = async () => {
    try {
      if (!newRecord.categoryId || !newRecord.type) {
        alert("카테고리와 유형을 선택하세요!");
        return;
      }

      await createRecord(newRecord);

      // ✅ 입력 초기화
      setNewRecord({
        recordId: null,
        userId,
        categoryId: null,
        categoryName: "",
        type: "",
        amount: 0,
        memo: "",
        date: new Date().toISOString().slice(0, 10),
      });

      // ✅ 기록 생성 후 부모 콜백 실행 (리스트 갱신)
      await onCreated?.();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <select
        value={newRecord.categoryId ?? ""}
        onChange={(e) =>
          setNewRecord({
            ...newRecord,
            categoryId: e.target.value === "" ? null : Number(e.target.value),
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

      <input
        value={newRecord.memo}
        onChange={(e) => setNewRecord({ ...newRecord, memo: e.target.value })}
        placeholder="ex) 곱창전골"
      />

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={newRecord.amount === 0 ? "" : newRecord.amount}
        onChange={(e) => {
          const v = e.target.value;
          if (/^\d*$/.test(v)) {
            setNewRecord({ ...newRecord, amount: v === "" ? 0 : Number(v) });
          }
        }}
        placeholder="ex) 34000"
      />

      <select
        value={newRecord.type}
        onChange={(e) => setNewRecord({ ...newRecord, type: e.target.value })}
      >
        <option value="" disabled hidden>
          유형
        </option>
        <option value="EXPENSE">지출</option>
        <option value="INCOME">수입</option>
      </select>

      <DialogClose asChild>
        <Button onClick={handleCreateSubmit}>추가</Button>
      </DialogClose>
    </div>
  );
};

export default Record;
