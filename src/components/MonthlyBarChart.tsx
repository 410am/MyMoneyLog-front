import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type MonthlyData = {
  month: number; // 1~12
  amount: number; // 원 단위
};

function toManwon(value: number) {
  const man = value / 10000;
  return man % 1 === 0 ? `${man}만` : `${man.toFixed(1)}만`;
}

export function MonthlyBarChart({ data }: { data: MonthlyData[] }) {
  const chartData = data.map((d) => ({
    ...d,
    label: `${d.month}월`,
  }));

  return (
    <div className="w-full h-4/5 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-8 relative z-10 ">
        월별
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
        >
          {/* 가로줄 (점선) */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />

          {/* X축 */}
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
          />

          {/* Y축 (만원 단위) */}
          <YAxis
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickFormatter={(v) => toManwon(v)}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            formatter={(v: number) => [`${toManwon(v)}`, "지출"]}
            labelFormatter={(label) => `${label} 기준`}
            contentStyle={{
              borderRadius: 12,
              borderColor: "#E5E7EB",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
            }}
          />

          {/* 보라 그라데이션 바 */}
          <defs>
            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.15} />
            </linearGradient>
          </defs>

          <Bar
            dataKey="amount"
            fill="url(#purpleGradient)"
            radius={[6, 6, 0, 0]}
            barSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
