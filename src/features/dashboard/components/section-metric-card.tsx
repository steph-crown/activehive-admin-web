import * as React from "react";
import { Link } from "react-router-dom";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function mergeSectionMetricCssVars(vars: Record<string, string>) {
  return vars as React.CSSProperties;
}

export type SectionMetricCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBgVar: string;
  iconColorVar: string;
  percentChange: number;
  isPositive: boolean;
  comparisonText: string;
  hoverShadowClass: string;
  style?: React.CSSProperties;
  /** When set, the whole tile is wrapped in a dashboard-style link. */
  href?: string;
  className?: string;
};

export function SectionMetricCard({
  title,
  value,
  icon,
  iconBgVar,
  iconColorVar,
  percentChange,
  isPositive,
  comparisonText,
  hoverShadowClass,
  style,
  href,
  className,
}: SectionMetricCardProps) {
  const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown;
  const percent = Math.abs(percentChange);
  const varianceColor =
    percent === 0
      ? "var(--grey-500)"
      : isPositive
        ? "var(--success-500)"
        : "var(--error-400)";

  const card = (
    <Card
      className={cn(
        "@container/card !rounded-md gap-0 border border-[#F4F4F4] bg-white p-0 shadow-none transition-shadow",
        hoverShadowClass,
        className,
      )}
      style={style}
    >
      <div className="flex flex-col gap-2 p-5">
        <div className="flex flex-col items-start gap-5">
          <div
            className="flex size-12 items-center justify-center rounded-md"
            style={{
              backgroundColor: iconBgVar,
              color: iconColorVar,
            }}
          >
            {icon}
          </div>
          <span className="text-xs font-medium text-gray-400">{title}</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="font-bebas text-3xl leading-none font-medium text-black">
            {value}
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
              {comparisonText}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {card}
      </Link>
    );
  }

  return card;
}
