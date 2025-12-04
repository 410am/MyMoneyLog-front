import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type CategoryItem = {
  categoryId: number;
  categoryName: string;
  amount: number;
};

const CategoryDonut = ({ data }: { data: CategoryItem[] }) => {
  const COLORS = [
    "#6366F1", // 인디고
    "#EC4899", // 핑크
    "#22C55E", // 초록
    "#F97316", // 오렌지
    "#0EA5E9", // 스카이블루
    "#A855F7", // 퍼플
  ];

  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  const items = [...data]
    .sort((a, b) => b.amount - a.amount)
    .map((d, idx) => ({
      ...d,
      color: COLORS[idx % COLORS.length],
      percent:
        totalAmount === 0 ? 0 : Math.round((d.amount / totalAmount) * 100),
    }));

  const topLegends = items.slice(0, 3);
  const bottomLegends = items.slice(3).reverse();

  return (
    <div className=" py-5 pl-5 ">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">카테고리</h2>

      {/* ⚡ 전체 레이아웃: 2x2 grid */}
      <div className="grid grid-cols-[auto,1fr] grid-rows-[auto,auto] gap-4 items-center h-fit">
        {/* 도넛: 왼쪽 세로 전체 차지 (row-span-2) */}
        <div className="row-span-2 flex justify-center ">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={items}
                  dataKey="amount"
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={80}
                  paddingAngle={4}
                  stroke="#ffffff"
                  strokeWidth={3}
                >
                  {items.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 오른쪽 위: 일부 범례 (3개) */}
        <div className="flex flex-col gap-12 row-span-2 pl-6">
          {topLegends.map((item) => (
            <div
              key={item.categoryId}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <div className="grid grid-cols-1 ml-3">
                <span className="text-slate-500">{item.categoryName}</span>
                <span className="font-semibold text-slate-900 text-base">
                  {item.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 오른쪽 아래: 나머지 범례들 → 가로 */}
        <div className="flex flex-wrap gap-x-14 gap-y-2 ">
          {bottomLegends.map((item) => (
            <div
              key={item.categoryId}
              className="flex items-center gap-2 text-xs"
            >
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: item.color }}
              />
              <div className="grid grid-cols-1 ml-3">
                <span className="text-slate-500">{item.categoryName}</span>
                <span className="font-semibold text-slate-900  text-base">
                  {item.percent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryDonut;
