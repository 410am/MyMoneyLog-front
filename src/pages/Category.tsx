import { useEffect, useState } from "react";
import { createCategory, fetchCategories } from "../api";
import { UserAuthStore } from "../store/AuthStore";

export type Category = {
  userId: number | null;
  categoryName: string;
  type: string;
  isDefault: boolean;
};

const Category = () => {
  const userId = UserAuthStore((state) => state.userId);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const [newCategory, setNewCategory] = useState<Category>({
    userId: userId,
    categoryName: "",
    type: "",
    isDefault: false,
  });

  useEffect(() => {
    (async () => {
      const res = await fetchCategories();
      setCategoryList(res);
      console.log(res);
    })();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log(newCategory);
      await createCategory(newCategory);
      setCategoryList([...categoryList, newCategory]);
    } catch (error) {
      console.error(error);
    }
  };

  const [focused, setFocused] = useState<boolean>(false);

  return (
    <>
      <>
        <h2>기본 카테고리</h2>
        {categoryList.map((category) => {
          return <p key={category.categoryName}>{category.categoryName}</p>;
        })}
      </>
      <>
        <h2>사용자 카테고리</h2>
        <form onSubmit={handleSubmit}>
          <input
            value={newCategory.categoryName}
            name="카테고리 이름"
            onChange={(e) => {
              setNewCategory({ ...newCategory, categoryName: e.target.value });
            }}
            placeholder={focused ? "" : "ex)배달음식"}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />

          <select
            value={newCategory.type}
            onChange={(e) => {
              setNewCategory({ ...newCategory, type: e.target.value });
            }}
            name="type"
          >
            <option value="">유형</option>
            <option value="EXPENSE">지출</option>
            <option value="INCOME">수입</option>
          </select>

          <button type="submit">추가</button>
        </form>
      </>
    </>
  );
};

export default Category;
