import { Calendar } from "./ui/calendar";
import { DateRange } from "react-day-picker";
import { useState } from "react";

type Props = {
  value?: { from?: string; to?: string };
  onChange: (range: { from?: string; to?: string }) => void;
};
// YYYY-MM-DD 포맷 함수
const format = (d: Date) => d.toISOString().slice(0, 10);

export default function DateRangePicker({ onChange }: Props) {
  const [range, setRange] = useState<DateRange | undefined>();

  return (
    <div className="p-2 border rounded-md shadow-sm bg-white">
      <Calendar
        mode="range"
        selected={range}
        onSelect={(val) => {
          setRange(val);

          // 둘 다 선택됐을 때만 부모에 값 전달
          if (val?.from && val?.to) {
            onChange({
              from: format(val.from),
              to: format(val.to),
            });
          }
        }}
        numberOfMonths={2} // 한 번에 2달 보여줌
      />
    </div>
  );
}
