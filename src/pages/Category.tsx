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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";

export type Category = {
  categoryId: number | null;
  userId: number | null;
  categoryName: string;
  type: string;
  default: boolean;
};

const Category = () => {
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

  const handleEditCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        ...editCategory,
        userId: userId,
      };
      const res = await updateCategory(payload);
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
    <div className="h-[500px]">
      <div className="pb-8 pt-3 grid grid-cols-2 gap-5">
        {/* {dummyCategories.map((category) => { */}
        {categoryList.map((category) => {
          return (
            <div
              key={category.categoryId}
              className="pt-5 border border-gray-300 rounded-2xl h-[120px] shadow-md"
            >
              {category.categoryId == editCategory.categoryId ? (
                <form onSubmit={handleEditCategory} className="">
                  <input
                    value={editCategory.categoryName}
                    className="font-extrabold text-lg ml-8 w-5/6"
                    name="카테고리 이름"
                    onChange={(e) => {
                      setEditCategory({
                        ...editCategory,
                        categoryName: e.target.value,
                      });
                    }}
                  />

                  <Select
                    value={editCategory.type}
                    onValueChange={(e) => {
                      setEditCategory({
                        ...editCategory,
                        type: e,
                      });
                    }}
                  >
                    <SelectTrigger className="w-fit px-10 pb-3 text-md font-semibold text-slate-700">
                      <SelectValue placeholder="유형" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="EXPENSE">지출</SelectItem>
                      <SelectItem value="INCOME">수입</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    className="w-full flex justify-end pr-5"
                    type="submit"
                  >
                    확인
                  </button>
                </form>
              ) : (
                <div>
                  <p className="font-extrabold text-lg ml-8">
                    {category.categoryName}
                  </p>

                  <p
                    className={`ml-9 mt-1 ${
                      category.type == "EXPENSE"
                        ? "text-red-500"
                        : "text-blue-500"
                    }`}
                  >
                    {category.type == "EXPENSE" ? "지출" : "수입"}
                  </p>
                  <div className="w-full flex justify-end pr-3">
                    <button
                      className=""
                      type="button"
                      onClick={() =>
                        setEditCategory({
                          ...category,
                          userId: category.userId ?? userId,
                        })
                      }
                    >
                      {category.default === false && (
                        <EditIcon
                          fontSize="inherit"
                          className="text-gray-400"
                        />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteCategory(category.categoryId);
                      }}
                      className="px-2"
                    >
                      {category.default === false ? (
                        <Delete fontSize="inherit" className="text-gray-400" />
                      ) : (
                        <div className="px-2"></div>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="pl-10 w-full border border-gray-300 rounded-xl shadow-md p-3 h-16 mb-4">
        <form onSubmit={handleCreateSubmit} className="w-full flex mb-10 ">
          <input
            value={newCategory.categoryName}
            name="카테고리 이름"
            onChange={(e) => {
              setNewCategory({
                ...newCategory,
                categoryName: e.target.value,
              });
            }}
            placeholder={focused ? "" : "ex)배달음식"}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />

          <Select
            value={newCategory.type}
            onValueChange={(e) => {
              setNewCategory({ ...newCategory, type: e });
            }}
          >
            <SelectTrigger className="w-fit px-10 pb-3 text-md font-semibold text-slate-700">
              <SelectValue placeholder="유형" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="EXPENSE">지출</SelectItem>
              <SelectItem value="INCOME">수입</SelectItem>
            </SelectContent>
          </Select>

          <button type="submit" className="ml-auto mr-4 ">
            추가
          </button>
        </form>
      </div>
    </div>
  );
};

export default Category;
