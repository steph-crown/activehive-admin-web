import { Card } from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const chartData = [
  { month: "Jan", participants: 560 },
  { month: "Feb", participants: 635 },
  { month: "Mar", participants: 590 },
  { month: "Apr", participants: 728 },
  { month: "May", participants: 682 },
  { month: "Jun", participants: 845 },
  { month: "Jul", participants: 798 },
  { month: "Aug", participants: 976 },
  { month: "Sep", participants: 926 },
  { month: "Oct", participants: 1115 },
  { month: "Nov", participants: 1068 },
  { month: "Dec", participants: 1238 },
];

export function MembersChart() {
  return (
    <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-[#F4F4F4] px-6 py-3">
          <h3 className="text-lg font-semibold text-[#3c3c3c]">
            Participants over time
          </h3>
        </div>

        <div className="flex flex-col gap-4 p-6">
          <div className="h-[300px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={18}>
                <CartesianGrid
                  strokeDasharray="0"
                  vertical={false}
                  stroke="#F4F4F4"
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9CA3AF", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "8px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [value, "Participants"]}
                />
                <Bar
                  dataKey="participants"
                  fill="#FABE12"
                  name="Participants"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
}
