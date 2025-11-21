import { useEffect, useState } from "react";
import {
  createCategory,
  fetchCategories,
  updateCategory,
  deleteCategory,
} from "../api";
import { authStore } from "../store/AuthStore";
import EditIcon from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";

export type Category = {
  categoryId: number | null;
  userId: number | null;
  categoryName: string;
  type: string;
  default: boolean;
};

const Category = () => {
  const dummyCategories = [
    {
      categoryId: 1,
      userId: 1,
      categoryName: "식비",
      type: "EXPENSE",
      default: true,
    },
    {
      categoryId: 2,
      userId: 1,
      categoryName: "카페/디저트",
      type: "EXPENSE",
      default: true,
    },
    {
      categoryId: 3,
      userId: 1,
      categoryName: "교통비",
      type: "EXPENSE",
      default: true,
    },
    {
      categoryId: 4,
      userId: 1,
      categoryName: "쇼핑",
      type: "EXPENSE",
      default: false,
    },
    {
      categoryId: 5,
      userId: 1,
      categoryName: "취미/여가",
      type: "EXPENSE",
      default: false,
    },
    {
      categoryId: 6,
      userId: 1,
      categoryName: "건강/의료",
      type: "EXPENSE",
      default: false,
    },
    {
      categoryId: 7,
      userId: 1,
      categoryName: "주거/월세",
      type: "EXPENSE",
      default: true,
    },
    {
      categoryId: 8,
      userId: 1,
      categoryName: "통신비",
      type: "EXPENSE",
      default: true,
    },
    {
      categoryId: 9,
      userId: 1,
      categoryName: "보험",
      type: "EXPENSE",
      default: false,
    },
    {
      categoryId: 10,
      userId: 1,
      categoryName: "교육",
      type: "EXPENSE",
      default: false,
    },

    {
      categoryId: 11,
      userId: 1,
      categoryName: "월급",
      type: "INCOME",
      default: true,
    },
    {
      categoryId: 12,
      userId: 1,
      categoryName: "보너스",
      type: "INCOME",
      default: false,
    },
    {
      categoryId: 13,
      userId: 1,
      categoryName: "용돈",
      type: "INCOME",
      default: false,
    },
    {
      categoryId: 14,
      userId: 1,
      categoryName: "투자수익",
      type: "INCOME",
      default: false,
    },
    {
      categoryId: 15,
      userId: 1,
      name: "기타수입",
      type: "INCOME",
      default: false,
    },
  ];

  const userId = authStore((state) => state.userId);
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

      setNewCategory({
        categoryId: null,
        userId: userId,
        categoryName: "",
        type: "",
        default: false,
      });
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

  const handleDeleteCategory = async (categoryId: number | null) => {
    try {
      if (categoryId === null) {
        alert("유효하지 않은 카테고리입니다.");
      } else {
        await deleteCategory(categoryId);
        setCategoryList((prev) =>
          prev.filter((c) => c.categoryId != categoryId)
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [focused, setFocused] = useState<boolean>(false);

  return (
    <div>
      <div className="pb-8 pt-3">
        {/* {categoryList.map((category) => { */}
        {dummyCategories.map((category) => {
          return (
            <div key={category.categoryId} className="flex py-3">
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
                    <option value="" disabled hidden>
                      유형
                    </option>
                    <option value="EXPENSE">지출</option>
                    <option value="INCOME">수입</option>
                  </select>
                  <button type="button" onClick={handleEditCategory}>
                    확인
                  </button>
                </form>
              ) : (
                <div className="w-full flex">
                  <div className="w-2/3 flex">
                    <p className="font-extrabold text-lg ml-10">
                      {category.categoryName}
                    </p>
                    <p
                      className={`ml-auto ${
                        category.type == "EXPENSE"
                          ? "text-red-500"
                          : "text-blue-500"
                      }`}
                    >
                      {category.type == "EXPENSE" ? "지출" : "수입"}
                    </p>
                  </div>
                  <button
                    className="ml-auto"
                    type="button"
                    onClick={() => setEditCategory(category)}
                  >
                    {category["default"] === false && (
                      <EditIcon fontSize="inherit" className="text-gray-400" />
                    )}
                  </button>
                </div>
              )}
              <div className="w-fit">
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteCategory(category.categoryId);
                  }}
                  className="px-2"
                >
                  {category["default"] === false ? (
                    <Delete fontSize="inherit" className="text-gray-400" />
                  ) : (
                    <div className="px-2"></div>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="pl-10 w-full">
        <form onSubmit={handleCreateSubmit} className="w-full flex mt-1 mb-10">
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
            className="pl-9"
          >
            <option value="">유형</option>
            <option value="EXPENSE">지출</option>
            <option value="INCOME">수입</option>
          </select>

          <button type="submit" className="ml-auto mr-4">
            추가
          </button>
        </form>
      </div>
    </div>
  );
};

export default Category;
