import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type DailyData = {
  date: string; // "2025-12-01"
  amount: number; // 일별 지출(양수)
};

function formatDayLabel(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  return `${day}일`;
}

export function DailyLineChart({ data }: { data: DailyData[] }) {
  const chartData = data.map((d) => ({
    ...d,
    dayLabel: formatDayLabel(d.date),
  }));

  function toManwon(value: number) {
    const man = value / 10000; // 원 → 만원 변환
    // 0.0, 1.0, 3.5 이런 형태
    return man % 1 === 0 ? `${man}만` : `${man.toFixed(1)}만`;
  }

  return (
    <div className="w-full h-full pl-5 py-5 pr-10">
      <h2 className="text-lg font-semibold text-slate-900 relative z-10 mb-5">
        일별
      </h2>

      <ResponsiveContainer width="100%" height="80%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 0, left: -10, bottom: 0 }}
        >
          {/* 보라색 그라데이션 영역 */}
          <defs>
            <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* 가는 점선 그리드 (가로만) */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E5E7EB"
            vertical={false}
          />

          {/* X축: 날짜 라벨 (살짝 연하게) */}
          <XAxis
            dataKey="dayLabel"
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "#9CA3AF" }}
            tickFormatter={(v) => toManwon(v)}
            tickLine={false}
            axisLine={false}
            width={45}
          />

          <Tooltip
            formatter={(value: any) =>
              typeof value === "number"
                ? [`${value.toLocaleString()}원`, "지출"]
                : [value, ""]
            }
            labelFormatter={(label) => `${label} 기준`}
            contentStyle={{
              borderRadius: 12,
              borderColor: "#E5E7EB",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
            }}
          />

          {/* 보라 라인 + 부드러운 곡선 */}
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#8B5CF6"
            strokeWidth={3}
            fill="url(#dailyGradient)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: "#8B5CF6" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
