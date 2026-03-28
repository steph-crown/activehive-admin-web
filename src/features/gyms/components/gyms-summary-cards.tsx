import type { ReactNode } from "react";
import {
  IconCircleCheckFilled,
  IconClockHour4,
  IconHomeFilled,
  IconUserFilled,
} from "@tabler/icons-react";

import { Card } from "@/components/ui/card";

type GymsSummaryCardsProps = {
  totalGyms: number;
  activeGyms: number;
  pendingApproval: number;
  totalMembers: number;
};

const baseVars = {
  "--success-500": "#22c55e",
  "--grey-500": "#959595",
} as Record<string, string>;

type CardSpec = {
  title: string;
  value: string;
  icon: ReactNode;
  iconBgVar: string;
  iconColorVar: string;
  valueColorVar: string;
  hoverShadowClass: string;
  cssVars: React.CSSProperties;
};

export function GymsSummaryCards({
  totalGyms,
  activeGyms,
  pendingApproval,
  totalMembers,
}: GymsSummaryCardsProps) {
  const cards: CardSpec[] = [
    {
      title: "Total gyms",
      value: String(totalGyms),
      icon: <IconHomeFilled className="size-6" />,
      iconBgVar: "var(--primary-50)",
      iconColorVar: "var(--primary-500)",
      valueColorVar: "var(--primary-500)",
      hoverShadowClass: "hover:shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]",
      cssVars: {
        ...baseVars,
        "--primary-50": "#ffefe6",
        "--primary-500": "#ff5b04",
      } as React.CSSProperties,
    },
    {
      title: "Active gyms",
      value: String(activeGyms),
      icon: <IconCircleCheckFilled className="size-6" />,
      iconBgVar: "var(--success-50)",
      iconColorVar: "var(--success-500)",
      valueColorVar: "var(--success-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(34,197,94,0.22)]",
      cssVars: {
        ...baseVars,
        "--success-50": "#ecfdf3",
        "--success-500": "#22c55e",
      } as React.CSSProperties,
    },
    {
      title: "Pending approval",
      value: String(pendingApproval),
      icon: <IconClockHour4 className="size-6" />,
      iconBgVar: "var(--amber-50)",
      iconColorVar: "var(--amber-600)",
      valueColorVar: "var(--amber-600)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(217,119,6,0.2)]",
      cssVars: {
        ...baseVars,
        "--amber-50": "#fffbeb",
        "--amber-600": "#d97706",
      } as React.CSSProperties,
    },
    {
      title: "Total members",
      value: totalMembers.toLocaleString(),
      icon: <IconUserFilled className="size-6" />,
      iconBgVar: "var(--purple-50)",
      iconColorVar: "var(--purple-500)",
      valueColorVar: "var(--purple-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]",
      cssVars: {
        ...baseVars,
        "--purple-50": "#f2eeff",
        "--purple-500": "#7e52ff",
      } as React.CSSProperties,
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={`@container/card !rounded-md gap-0 border border-[#F4F4F4] bg-white p-0 shadow-none transition-shadow ${card.hoverShadowClass}`}
          style={card.cssVars}
        >
          <div className="flex flex-col gap-2 p-5">
            <div className="flex flex-col items-start gap-5">
              <div
                className="flex size-12 items-center justify-center rounded-md"
                style={{
                  backgroundColor: card.iconBgVar,
                  color: card.iconColorVar,
                }}
              >
                {card.icon}
              </div>
              <span className="text-xs font-medium text-gray-400">
                {card.title}
              </span>
            </div>
            <div
              className="text-2xl leading-none font-bold"
              style={{ color: card.valueColorVar }}
            >
              {card.value}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
