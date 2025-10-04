import { useEffect, useState } from "react";
import { createCategory, fetchCategories, updateCategory } from "../api";
import { UserAuthStore } from "../store/AuthStore";
import EditIcon from "@mui/icons-material/Edit";

export type Category = {
  categoryId: number | null;
  userId: number | null;
  categoryName: string;
  type: string;
  default: boolean;
};

const Category = () => {
  const userId = UserAuthStore((state) => state.userId);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const [newCategory, setNewCategory] = useState<Category>({
    categoryId: null,
    userId: userId,
    categoryName: "",
    type: "",
    default: false,
  });

  const [editCategory, setEditCategory] = useState<Category>({
    categoryId: null,
    userId: userId,
    categoryName: "",
    type: "",
    default: false,
  });

  useEffect(() => {
    (async () => {
      const res = await fetchCategories();
      setCategoryList(res);
      console.log(res);
    })();
  }, [userId]);

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log(newCategory);
      const res = await createCategory(newCategory);
      setCategoryList([...categoryList, res]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCategory = async () => {
    try {
      // 1️⃣ 서버에 수정 요청 보내기
      const res = await updateCategory(editCategory);
      console.log(res);

      // 2️⃣ 기존 리스트에서 해당 항목만 교체
      setCategoryList((prev) =>
        prev.map((category) =>
          category.categoryId === res.categoryId
            ? res // 서버 응답으로 교체
            : category
        )
      );

      // 3️⃣ 수정 완료 후 초기화
      setEditCategory({
        categoryId: null,
        userId: userId,
        categoryName: "",
        type: "",
        default: false,
      });
    } catch (error) {
      console.error("카테고리 수정 실패:", error);
    }
  };

  const [focused, setFocused] = useState<boolean>(false);

  return (
    <>
      <>
        <h2>카테고리</h2>
        {categoryList.map((category) => {
          return (
            <div key={category.categoryId}>
              {category.categoryId == editCategory.categoryId ? (
                <form onSubmit={handleEditCategory}>
                  <input
                    value={editCategory.categoryName}
                    name="카테고리 이름"
                    onChange={(e) => {
                      setEditCategory({
                        ...editCategory,
                        categoryName: e.target.value,
                      });
                    }}
                  />

                  <select
                    value={editCategory.type}
                    onChange={(e) => {
                      setEditCategory({
                        ...editCategory,
                        type: e.target.value,
                      });
                    }}
                    name="type"
                  >
                    <option value="">유형</option>
                    <option value="EXPENSE">지출</option>
                    <option value="INCOME">수입</option>
                  </select>
                  <button type="button" onClick={handleEditCategory}>
                    확인
                  </button>
                </form>
              ) : (
                <div>
                  <p>{category.categoryName}</p>
                  <p>{category.type}</p>
                  <button
                    type="button"
                    onClick={() => setEditCategory(category)}
                  >
                    {category["default"] === false && <EditIcon />}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </>
      <>
        <h2>사용자 카테고리</h2>
        <form onSubmit={handleCreateSubmit}>
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
            name="카테고리 타입"
            onChange={(e) => {
              setNewCategory({ ...newCategory, type: e.target.value });
            }}
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
