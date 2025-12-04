import React, { useState } from "react";
import { logout, updateUser, withdrawal } from "../api";
import { authStore } from "../store/AuthStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { ConfirmModal } from "../components/ConfirmModal";
import defaultProfile from "../assets/icons/mml 기본프로필.png";
import { Button } from "../components/ui/button";
import Input from "@mui/material/Input";

const MyPage = () => {
  // const token = localStorage.getItem("accessToken");
  // const nickname = authStore((state) => state.nickname);
  // const email = authStore((state) => state.email);
  // const userId = authStore((state) => state.userId);
  // const picture = authStore((state) => state.picture);
  const { userId, email, nickname, picture } = authStore();

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
      <div className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="max-w-2xl mx-auto px-4 py-3">
            <h1 className="text-base font-semibold text-slate-900">
              마이페이지 김
            </h1>
            <p className="text-xs text-slate-500">
              계정 정보와 MyMoneyLog 환경을 관리하는 곳이야 김밥
            </p>
          </div>
        </header>

        <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {/* 프로필 카드 */}
          <section className="bg-white rounded-2xl shadow-sm p-5 flex gap-4 items-center">
            <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xl">
              {nickname?.[0] ?? "M"}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-semibold text-slate-900">{nickname}</p>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
          </section>

          {/* 닉네임 변경 */}
          <section className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              닉네임 변경 김
            </h2>
            <p className="text-xs text-slate-500">
              홈 화면과 레포트에서 표시되는 이름이야 김밥
            </p>
            <div className="flex gap-2">
              <Input defaultValue={nickname} />
              <Button>저장</Button>
            </div>
          </section>

          {/* 계정 / 보안 */}
          <section className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
            <h2 className="text-sm font-semibold text-slate-900">
              계정 관리 김
            </h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-between">
                <span className="text-sm">비밀번호 변경</span>
                <span className="text-xs text-slate-400">준비 중</span>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-between"
                // onClick={logout}
              >
                로그아웃
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-between text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                회원 탈퇴
              </Button>
            </div>
          </section>

          <p className="text-[11px] text-slate-400 text-center pt-4">
            MyMoneyLog · 오늘 소비도 차분히 기록해보자 김밥김
          </p>
        </main>
      </div>
    </div>
  );
};

export default MyPage;
