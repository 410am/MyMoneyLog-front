import { useEffect, useState } from "react";
import CategoryDonut from "../components/CategoryDonut";
import { DailyLineChart } from "../components/DailyLineChart";
import { MonthlyBarChart } from "../components/MonthlyBarChart";
import { fetchDashboard } from "../api";

const Dashboard = () => {
  const now = new Date();

  const finalYear = now.getFullYear();
  const finalMonth = now.getMonth() + 1;

  const [categoryData, setCategoryData] = useState([]);
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await fetchDashboard(finalYear, finalMonth);
      console.log(res);
      setCategoryData(res.categoryChart);
      setDailyData(res.dailyChart);
      setMonthlyData(res.monthlyChart);
    })();
  }, []);

  return (
    <div className="h-full flex px-10">
      <div className="w-1/3">
        <CategoryDonut data={categoryData} />
      </div>
      <div className="w-1/3">
        <DailyLineChart data={dailyData} />
      </div>
      <div className="w-1/3">
        <MonthlyBarChart data={monthlyData} />
      </div>
    </div>
  );
};

export default Dashboard;
