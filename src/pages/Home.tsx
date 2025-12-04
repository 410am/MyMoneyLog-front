import { useNavigate } from "react-router-dom";
import LoginPage from "../components/Login";
import { authStore } from "../store/AuthStore";
import AIReport from "./AIReport";
import Dashboard from "./Dashboard";
import RecordListPage from "./RecordListPage";
import ArrowForwardIcon from "@mui/icons-material/ArrowForwardiOS";

//더미 데이터
export const dummyMonthSummary = {
  incomeTotal: 2600000,
  expenseTotal: 41000,
  balance: 2559000,
  incomeCount: 5,
  expenseCount: 128,
};

const Home = () => {
  const userId = authStore((state) => state.userId ?? "");
  const navigate = useNavigate();

  return (
    <div className="">
      {userId ? (
        <div className="grid grid-row-2 mb-36">
          <div className=" h-[20vh] grid grid-cols-4 gap-3 my-3">
            <div className="rounded-xl bg-gradient-to-r to-[#6C95FF]  from-[#3D69DB] pt-10 pl-4">
              <div className="text-neutral-50 opacity-50 font-bold text-xl">
                총 수입
              </div>
              <div className="text-neutral-100 font-semibold text-2xl mt-1">
                {dummyMonthSummary.incomeTotal.toLocaleString("ko-KR")} 원
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#DA1CC7]  to-[#EA45AB]  pt-10 pl-4 rounded-xl">
              <div className="text-neutral-50 opacity-50 font-bold text-xl">
                총 지출
              </div>
              <div className="text-neutral-100 font-semibold text-2xl mt-1">
                {dummyMonthSummary.expenseTotal.toLocaleString("ko-KR")} 원
              </div>
            </div>
            <div className="bg-gradient-to-r from-[#2EAF4A]  to-[#8DD234]  rounded-xl  pt-10 pl-4">
              <div className="text-neutral-50 opacity-50 font-bold text-xl">
                총 잔액
              </div>
              <div className="text-neutral-100 font-semibold text-2xl mt-1">
                {dummyMonthSummary.balance.toLocaleString("ko-KR")} 원
              </div>
            </div>
            <div className="flex w-full gap-3">
              <div className="bg-gradient-to-r from-[#FFA700]  to-[#FFC14E] pt-10 pl-3 w w-1/2 rounded-xl">
                <div className="text-neutral-50 opacity-65 font-bold text-xl">
                  수입
                </div>
                <div className="text-neutral-100 font-semibold text-2xl mt-1">
                  {dummyMonthSummary.incomeCount.toLocaleString("ko-KR")} 건
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#8555C1]  to-[#B469FF] pt-10 pl-3 w-1/2 rounded-xl">
                <div className="text-neutral-50 opacity-50 font-bold text-xl">
                  지출
                </div>
                <div className="text-neutral-100 font-semibold text-2xl mt-1">
                  {dummyMonthSummary.expenseCount.toLocaleString("ko-KR")} 건
                </div>
              </div>
            </div>
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
