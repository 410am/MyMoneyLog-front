import { useNavigate } from "react-router-dom";
import LoginPage from "../components/Login";
import { authStore } from "../store/AuthStore";
import AIReport from "./AIReport";
import Dashboard from "./Dashboard";
import RecordListPage from "./RecordListPage";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardiOS";
import Summary from "../components/Summary";

const Home = () => {
  const userId = authStore((state) => state.userId ?? "");
  const navigate = useNavigate();

  return (
    <div>
      {userId ? (
        <div>
          <div>
            <Summary />
          </div>
          <div className="border rounded-2xl shadow-xl my-3  h-[50vh] w-[150vh]">
            <Dashboard />
          </div>
          <div className="flex h-[69vh] ">
            <div className="border rounded-2xl shadow-xl m-3 w-1/2 py-10 px-6">
              <AIReport />
            </div>
            <div className="border rounded-2xl shadow-xl m-3 w-1/2 overflow-hidden py-10 pr-6">
              <div className="flex px-4">
                <h2 className="text-2xl pb-3 pl-5">최근 내역</h2>
                <button
                  onClick={() => navigate("/list")}
                  className="ml-auto text-gray-400 pb-3"
                >
                  <ArrowForwardIcon className="!w-3 !h-3" />
                </button>
              </div>
              <RecordListPage />
            </div>
          </div>
        </div>
      ) : (
        <LoginPage />
      )}
    </div>
  );
};

export default Home;
