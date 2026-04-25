import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGymsOverTimeQuery } from "../services";

export function RevenueChart() {
  const { data, isLoading } = useGymsOverTimeQuery();

  const chartData = (data ?? []).map((d) => ({
    month: d.monthLabel,
    gyms: d.count,
  }));

  return (
    <Card className="!rounded-md border border-[#F4F4F4] p-0 shadow-none">
      <div className="flex flex-col">
        <div className="flex items-center justify-between border-b border-[#F4F4F4] px-6 py-3">
          <h3 className="text-lg font-semibold text-[#3c3c3c]">
            Gyms over time
          </h3>
        </div>

        <div className="flex flex-col gap-4 p-6">
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : (
            <div className="h-[300px] w-full [&_*]:outline-none [&_*]:focus:outline-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gymsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FABE12" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#FABE12" stopOpacity={0} />
                    </linearGradient>
                  </defs>
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
                    formatter={(value) => [value, "Gyms"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="gyms"
                    stroke="#FABE12"
                    strokeWidth={2}
                    fill="url(#gymsFill)"
                    name="Gyms"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
