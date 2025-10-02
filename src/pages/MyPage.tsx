import React, { useState } from "react";
import { logout, updateUser, withdrawal } from "../api";
import { UserAuthStore } from "../store/AuthStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { ConfirmModal } from "../components/ConfirmModal";
import defaultProfile from "../assets/icons/mml 기본프로필.png";

const MyPage = () => {
  // const token = localStorage.getItem("accessToken");
  // const nickname = authStore((state) => state.nickname);
  // const email = authStore((state) => state.email);
  // const userId = authStore((state) => state.userId);
  // const picture = authStore((state) => state.picture);
  const { userId, email, nickname, picture } = UserAuthStore();

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!token) return;
  //   (async () => {
  //     const res = await fetchUser();
  //   })();
  // }, [token]);

  const [newNickname, setNewNickname] = useState(nickname || "");
  const [newPicture, setNewPicture] = useState(picture || "");

  const handleSave = async () => {
    try {
      if (userId) {
        await updateUser({
          userId: userId,
          email: email || "",
          nickname: newNickname,
          picture: newPicture,
        });

        setNewNickname(newNickname);
        setNewPicture(newPicture);

        toast.success("프로필이 업데이트되었어요 🎉");
      } else {
        console.error("사용자가 없습니다.");
      }
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

  return (
    <div>
      MyPage
      <Card>
        <CardHeader>내 정보</CardHeader>
        <CardContent>
          <p>아이디: {userId}</p>
          <p>닉네임: {nickname}</p>
          <p>이메일: {email}</p>
          <img
            className="w-10 h-10 rounded-full outline outline-1"
            src={picture || defaultProfile}
            alt="프로필"
          />
        </CardContent>
      </Card>
      <div>
        <h2>회원정보 수정</h2>

        <div>
          <label>닉네임</label>
          <input
            type="text"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
          />

          <label>프로필 사진</label>
          <input
            type="text"
            value={newPicture}
            onChange={(e) => setNewPicture(e.target.value)}
          />
        </div>
        <button onClick={handleSave}>저장하기</button>
      </div>
      <div>
        <button onClick={handleLogout}>로그아웃</button>
      </div>
      <div>
        {/* <button onClick={handleWithdrawal}>회원 탈퇴</button> */}
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
    </div>
  );
};

export default MyPage;
