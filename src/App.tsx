import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
import LoginSuccessPage from "./pages/LoginSuccessPage";
import Home from "./pages/Home";
import AIReport from "./pages/AIReport";
import MyPage from "./pages/MyPage";
import List from "./pages/RecordListPage";
import { ToastContainer } from "react-toastify";
import RecordDetailPage from "./pages/RecordDetailPage";

function App() {
  return (
    <>
      <nav style={{ display: "flex", gap: 12, padding: 12 }}>
        <Link to="/">홈</Link>
        <Link to="/list">내역</Link>
        <Link to="/ai-report">ai리포트</Link>
        <Link to="/mypage">마이페이지</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/success" element={<LoginSuccessPage />} />
        <Route path="/list" element={<List />} />
        <Route path="/ai-report" element={<AIReport />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/list/:recordId" element={<RecordDetailPage />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
