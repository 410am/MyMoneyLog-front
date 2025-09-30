import React, { useState } from "react";
import { updateUser } from "../api";
import { authStore } from "../store/AuthStore";
import { toast } from "react-toastify";

// 로그아웃 시 초기화
// authStore.getState().clearAuth();

const MyPage = () => {
  // const token = localStorage.getItem("accessToken");
  // const nickname = authStore((state) => state.nickname);
  // const email = authStore((state) => state.email);
  // const userId = authStore((state) => state.userId);
  // const picture = authStore((state) => state.picture);
  const { userId, email, nickname, picture } = authStore();

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

  return (
    <div>
      MyPage
      <div>
        <div>{userId}</div>
        <div>{nickname}</div>
        <div>{email}</div>
        <div>{picture}</div>
      </div>
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
      </div>
      <button onClick={handleSave}>저장하기</button>
    </div>
  );
};

export default MyPage;
