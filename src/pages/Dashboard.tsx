import CategoryDonut from "../components/CategoryDonut";
import { DailyLineChart } from "../components/DailyLineChart";
import { MonthlyBarChart } from "../components/MonthlyBarChart";

const Dashboard = () => {
  // 카테고리별 지출 비율
  const dummyCategoryData = [
    { categoryId: 1, categoryName: "식비", amount: 12800 },
    { categoryId: 2, categoryName: "카페/디저트", amount: 4200 },
    { categoryId: 3, categoryName: "교통비", amount: 1450 },
    { categoryId: 4, categoryName: "기타", amount: 20000 },
    { categoryId: 5, categoryName: "취미", amount: 4000 },
  ];

  const dummyDaily = [
    { date: "2025-12-01", amount: 800 },
    { date: "2025-12-02", amount: 2200 },
    { date: "2025-12-03", amount: 12000 },
    { date: "2025-12-04", amount: 3500 },
    { date: "2025-12-05", amount: 3400 },
    { date: "2025-12-06", amount: 16000 },
    { date: "2025-12-07", amount: 9500 },
  ];

  const dummyMonthly = [
    { month: 1, amount: 50000 },
    { month: 2, amount: 180000 },
    { month: 3, amount: 80000 },
    { month: 4, amount: 120000 },
    { month: 5, amount: 60000 },
    { month: 6, amount: 210000 },
    { month: 7, amount: 160000 },
  ];

  return (
    <div className="h-full flex px-10">
      <div className="w-1/3">
        <CategoryDonut data={dummyCategoryData} />
      </div>
      <div className="w-1/3">
        <DailyLineChart data={dummyDaily} />
      </div>
      <div className="w-1/3">
        <MonthlyBarChart data={dummyMonthly} />
      </div>
    </div>
  );
};

export default Dashboard;
