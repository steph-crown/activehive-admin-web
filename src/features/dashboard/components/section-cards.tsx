import * as React from "react";
import { Link } from "react-router-dom";
import {
  IconBarbellFilled,
  IconHomeFilled,
  IconTrendingDown,
  IconTrendingUp,
  IconTrophyFilled,
  IconUserFilled,
} from "@tabler/icons-react";
import { Card } from "@/components/ui/card";

type MetricCardTheme = {
  icon: React.ReactNode;
  iconBgVar: string;
  iconColorVar: string;
  title: string;
  value: string;
  percentChange: number;
  isPositive: boolean;
  comparisonText: string;
  valueColorVar: string;
  hoverShadowClass: string;
  cssVars: React.CSSProperties;
  href: string;
};

function mergeCssVars(vars: Record<string, string>) {
  return vars as React.CSSProperties;
}

export function SectionCards() {
  const baseVars = {
    "--success-500": "#22c55e",
    "--error-400": "#dc5959",
    "--grey-800": "#3c3c3c",
    "--grey-500": "#959595",
  } as Record<string, string>;

  const cardThemes: MetricCardTheme[] = [
    {
      title: "Total Gyms",
      value: "24",
      percentChange: 2.4,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <IconHomeFilled className="size-6" />,
      iconBgVar: "var(--primary-50)",
      iconColorVar: "var(--primary-500)",
      valueColorVar: "var(--primary-500)",
      hoverShadowClass: "hover:shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--primary-50": "#ffefe6",
        "--primary-500": "#ff5b04",
      }),
      href: "/dashboard/gyms",
    },
    {
      title: "Total Members",
      value: "8,746",
      percentChange: 2.4,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <IconUserFilled className="size-6" />,
      iconBgVar: "var(--purple-50)",
      iconColorVar: "var(--purple-500)",
      valueColorVar: "var(--purple-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--purple-50": "#f2eeff",
        "--purple-500": "#7e52ff",
      }),
      href: "/dashboard/members",
    },
    {
      title: "Total Trainers",
      value: "56",
      percentChange: 1.9,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <IconBarbellFilled className="size-6" />,
      iconBgVar: "var(--blue-50)",
      iconColorVar: "var(--blue-500)",
      valueColorVar: "var(--blue-500)",
      hoverShadowClass: "hover:shadow-[0_14px_30px_-20px_rgba(67,66,255,0.26)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--blue-50": "#ececff",
        "--blue-500": "#4342ff",
      }),
      href: "/dashboard/trainers",
    },
    {
      title: "Active Challenges",
      value: "14",
      percentChange: -1.7,
      isPositive: false,
      comparisonText: "vs last month",
      icon: <IconTrophyFilled className="size-6" />,
      iconBgVar: "var(--error-50)",
      iconColorVar: "var(--error-500)",
      valueColorVar: "var(--error-500)",
      hoverShadowClass: "hover:shadow-[0_14px_30px_-20px_rgba(211,47,47,0.22)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--error-50": "#fbeaea",
        "--error-500": "#d32f2f",
      }),
      href: "/dashboard/challenges",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardThemes.map((card) => {
        const TrendIcon = card.isPositive ? IconTrendingUp : IconTrendingDown;
        const percent = Math.abs(card.percentChange);
        const varianceColor = card.isPositive
          ? "var(--success-500)"
          : "var(--error-400)";

        return (
          <Link
            key={card.title}
            to={card.href}
            className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Card
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

              <div className="flex items-center justify-between gap-2">
                <div
                  className="text-2xl leading-none font-bold"
                  style={{ color: card.valueColorVar }}
                >
                  {card.value}
                </div>

                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 text-xs font-medium"
                    style={{ color: varianceColor }}
                  >
                    <TrendIcon className="size-4" stroke={2} />~{percent}%
                  </div>
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--grey-500)" }}
                  >
                    {card.comparisonText}
                  </span>
                </div>
              </div>
            </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
