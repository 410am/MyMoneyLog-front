import { useNavigate } from "react-router-dom";
import AIReport from "./AIReport";
import Dashboard from "./Dashboard";
import RecordListPage from "./RecordListPage";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardiOS";
import Summary from "../components/Summary";
import { useEffect } from "react";
import { getMonthSummary } from "../api";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const res = await getMonthSummary();
      console.log(res);
    })();
  }, []);

  return (
    <div className="mb-40">
      <div>
        <div>
          <Summary />
        </div>
        <div className="border-[0.5px] border-gray-100/60 rounded-2xl shadow-xl my-3  h-[50vh] w-full bg-[#FCFCFC]">
          <Dashboard />
        </div>
        <div className="flex h-[69vh]">
          <div className="rounded-2xl shadow-xl m-3 w-1/2 py-10 px-6 bg-[#FCFCFC]">
            <AIReport />
          </div>
          <div className="rounded-2xl shadow-xl m-3 w-1/2 overflow-hidden py-10 pr-6 bg-[#FCFCFC]">
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
    </div>
  );
};

export default Home;
