import React, { useRef, useState } from "react";
import { logout, updateUser, withdrawal } from "../api";
import { authStore } from "../store/AuthStore";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "../components/ConfirmModal";
import defaultProfile from "../assets/icons/mml 기본프로필.png";
import { Button } from "../components/ui/button";
import Input from "@mui/material/Input";
import EditIcon from "@mui/icons-material/Edit";

const MyPage = () => {
  // const token = localStorage.getItem("accessToken");
  // const nickname = authStore((state) => state.nickname);
  // const email = authStore((state) => state.email);
  // const userId = authStore((state) => state.userId);
  // const picture = authStore((state) => state.picture);
  const { userId, email, nickname, picture } = authStore((s) => s);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!token) return;
  //   (async () => {
  //     const res = await fetchUser();
  //   })();
  // }, [token]);

  const [newNickname, setNewNickname] = useState(nickname || "");
  const [newPicture, setNewPicture] = useState(picture || "");
  // 실제 업로드용
const [imgFile, setImgFile] = useState<File | null>(null);
  const [edit, setEdit] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  
  const handleSave = async () => {
    if (!userId) {
      console.error("사용자가 없습니다.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("nickname", newNickname);
  
      if (imgFile) {
        formData.append("pictureFile", imgFile);
      }
  
      const updatedUser = await updateUser(userId, formData);
   console.log(updatedUser);
      // ✅ 화면 상태 업데이트
      authStore.getState().setAuth(updatedUser);
      setEdit(false);
    } catch (error) {
      console.error("❌ 수정 실패:", error);
      alert("수정 실패");
    }
  };
  

  const handleLogout = async () => {
    // 서버에 로그아웃 요청 (refreshToken 만료)
    await logout();

    // localStorage에서 accessToken 제거
    localStorage.removeItem("accessToken");

    // Zustand 상태 초기화
    authStore.getState().clearAuth();

    // 로그아웃 후 홈으로 리다이렉트
    navigate("/");
  };

  const handleWithdrawal = async () => {
    await withdrawal();
    handleLogout();
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;   

    setImgFile(file);
    setNewPicture(URL.createObjectURL(file));
  };
  

  return (
    <div>
      <div className="min-h-screen">


        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* 프로필 카드 */}
          {!edit ? (

          <section className="bg-white rounded-2xl shadow-sm p-5 flex gap-4 items-center">
          <img
                      src={newPicture ? newPicture : defaultProfile}
                      className="w-10 h-10 rounded-xl"
                      alt="profile"
                    />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-slate-900">{newNickname}</p>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
            <EditIcon
                          fontSize="inherit"
                          className="text-gray-400"
                          onClick={() => setEdit(true)}
                        />
          </section>

          ) : (
          <>
          {/* 변경 */}
          <section className="bg-white rounded-2xl shadow-sm p-5 flex gap-4 items-center">
            <div className="relative
            ">
          <img
                      src={newPicture || defaultProfile}
                      className="w-10 h-10 rounded-xl"
                      alt="profile"
                    />
                    <div className="w-10 h-10 rounded-xl bg-slate-500 hover:opacity-90 flex justify-center items-center
                    absolute inset-0 opacity-0 " onClick={() => fileInputRef.current?.click()}>            
                      <EditIcon
                          fontSize="inherit"
                          className="text-slate-50 "
                         
                        />
                        </div>

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={handlePictureChange}
  />
              </div>
            <div className="flex-1 space-y-1">
              <Input
         
              type="text"
              defaultValue={newNickname ? newNickname : nickname}
              onChange={(e) => setNewNickname(e.target.value)} className="text-sm font-semibold text-slate-900" />
              <p className="text-xs text-slate-500">{email}</p>
            </div>
            <div
                          
                          className="text-gray-400 text-sm pr-3 hover:font-bold"
                          onClick={() => handleSave()}
                        >저장</div>
          </section>

          </>
          )}

          {/* 계정 관리 */}

            <div className="space-y-2 grid grid-rows-2 justify-items-center">
              <Button
                variant="outline"
                className="w-2/5"
                // onClick={logout}
              >
                로그아웃
              </Button>

              <ConfirmModal
            triggerLabel="회원탈퇴"
            title="정말 탈퇴하시겠습니까?"
            description="탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다."
            confirmLabel="탈퇴"
            cancelLabel="취소"
            onConfirm={() => {
              handleWithdrawal();
            }}
          />
            </div>
        </main>
      </div>
    </div>
  );
};

export default MyPage;
