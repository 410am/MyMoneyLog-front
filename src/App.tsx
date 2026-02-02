import "./App.css";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
// import LoginSuccessPage from "./pages/LoginSuccessPage";
import Home from "./pages/Home";
// import AIReport from "./pages/AIReport";
import MyPage from "./pages/MyPage";
import LoginPage from "./components/Login";
import List from "./pages/RecordListPage";
import { ToastContainer } from "react-toastify";
import RecordDetailPage from "./pages/RecordDetailPage";
import { authStore } from "./store/AuthStore";
import defaultProfile from "./assets/icons/mml 기본프로필.png";
import mmlLogo from "./assets/icons/icon-192.png";

function App() {
  const userId = authStore((state) => state.userId);
  // const nickname = authStore((state) => state.nickname);
  const profilePicture = authStore((state) => state.picture ?? "");
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="bg-[#FBFBFB]">
    {userId ? (
    <div className="">
      <div className="px-10 py-4 mx-auto max-w-[1200px]">
        <div className="">
          <div className="flex gap-36 mb-10 ">
            <div
              className="flex gap-2 items-center"
              onClick={() => navigate("/")}
            >
              <img className="w-14 h-14" src={mmlLogo} alt="mmlLogo" />
              <h1 className="text-2xl font-bold text-blue-950 w-60">
                My Money Log
              </h1>
            </div>
            <nav className="flex w-full items-center text-gray-500">
              <div className="flex gap-12">
                <Link
                  to="/"
                  className={
                    location.pathname === "/" ? "text-black font-bold" : ""
                  }
                >
                  홈
                </Link>
                <Link
                  to="/list"
                  className={
                    location.pathname === "/list" ? "text-black font-bold" : ""
                  }
                >
                  소비기록
                </Link>
              </div>
             
                <div className="ml-auto pt-4">
                  <Link to="/mypage">
                    <img
                      src={profilePicture || defaultProfile}
                      className="w-10 h-10 rounded-xl"
                      alt="profile"
                    />
                    {/* {nickname ?? ""} */}
                  </Link>
                </div>
             
            </nav>
          </div>
          <div className="mx-auto w-full max-w-[1080px]">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login/success" element={<Home />} />
              <Route path="/list" element={<List />} />
              {/* <Route path="/ai-report" element={<AIReport />} /> */}
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/list/:recordId" element={<RecordDetailPage />} />
            </Routes>
            <ToastContainer position="top-center" autoClose={3000} />
          </div>
        </div>
      </div>
    </div>) : <LoginPage />}
    </div>
  );
}

export default App;
