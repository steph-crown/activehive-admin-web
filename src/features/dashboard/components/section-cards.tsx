import * as React from "react";
import { Card } from "@/components/ui/card";

function TrendUpIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_1621_251540)">
        <path
          d="M14.6667 4.66699L9.42095 9.91275C9.15694 10.1768 9.02494 10.3088 8.87272 10.3582C8.73882 10.4017 8.59459 10.4017 8.4607 10.3582C8.30848 10.3088 8.17647 10.1768 7.91246 9.91274L6.08762 8.08791C5.82361 7.82389 5.6916 7.69189 5.53939 7.64243C5.40549 7.59892 5.26126 7.59892 5.12736 7.64243C4.97514 7.69189 4.84314 7.82389 4.57913 8.08791L1.33337 11.3337M14.6667 4.66699H10M14.6667 4.66699V9.33366"
          stroke="var(--success-500)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_1621_251540">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

function TrendDownIcon(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.6667 11.3337L9.42092 6.08791C9.15691 5.82389 9.02491 5.69189 8.87269 5.64243C8.73879 5.59892 8.59456 5.59892 8.46066 5.64243C8.30845 5.69189 8.17644 5.82389 7.91243 6.08791L6.08759 7.91275C5.82358 8.17676 5.69157 8.30876 5.53935 8.35822C5.40546 8.40173 5.26123 8.40173 5.12733 8.35822C4.97511 8.30876 4.84311 8.17676 4.5791 7.91274L1.33334 4.66699M14.6667 11.3337H10M14.6667 11.3337V6.66699"
        stroke="var(--error-400)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GymsIconPrimary(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5228 43.5228 48 38 48H10C4.47715 48 0 43.5228 0 38V10Z"
        fill="var(--primary-50)"
      />
      <path
        d="M36 12V36H12V12H36Z"
        fill="white"
        fillOpacity="0.01"
      />
      <g opacity="0.3">
        <path
          d="M16 29V21.5C16 20.6716 16.6716 20 17.5 20H30.5C31.3284 20 32 20.6716 32 21.5V29H16Z"
          fill="var(--primary-500)"
        />
      </g>
      <path
        d="M16 29V21.5C16 20.6716 16.6716 20 17.5 20H30.5C31.3284 20 32 20.6716 32 21.5V29H16Z"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 29V25.5C19 24.6716 19.6716 24 20.5 24H27.5C28.3284 24 29 24.6716 29 25.5V29"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M21 20V18C21 17.4477 21.4477 17 22 17H26C26.5523 17 27 17.4477 27 18V20"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M18.5 22.5H23"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M25 22.5H29.5"
        stroke="var(--primary-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrainersIconBlue(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5228 43.5228 48 38 48H10C4.47715 48 0 43.5228 0 38V10Z"
        fill="var(--blue-50)"
      />
      <path
        d="M36 12V36H12V12H36Z"
        fill="white"
        fillOpacity="0.01"
      />
      <g opacity="0.3">
        <path
          d="M24 23C26.2091 23 28 21.2091 28 19C28 16.7909 26.2091 15 24 15C21.7909 15 20 16.7909 20 19C20 21.2091 21.7909 23 24 23Z"
          fill="var(--blue-500)"
        />
      </g>
      <path
        d="M24 23C26.2091 23 28 21.2091 28 19C28 16.7909 26.2091 15 24 15C21.7909 15 20 16.7909 20 19C20 21.2091 21.7909 23 24 23Z"
        stroke="var(--blue-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 32C18.5 28.4101 21.4101 25.5 25 25.5H23C21.6193 25.5 20.5 26.6193 20.5 28V32"
        fill="var(--blue-500)"
        fillOpacity="0.01"
      />
      <path
        d="M17.5 32V28.5C17.5 26.0147 19.5147 24 22 24H26C28.4853 24 30.5 26.0147 30.5 28.5V32"
        stroke="var(--blue-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M20.5 18.5H27.5"
        stroke="var(--blue-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChallengesIconError(props: Readonly<React.SVGProps<SVGSVGElement>>) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5228 43.5228 48 38 48H10C4.47715 48 0 43.5228 0 38V10Z"
        fill="var(--error-50)"
      />
      <path
        d="M36 12V36H12V12H36Z"
        fill="white"
        fillOpacity="0.01"
      />
      <g opacity="0.3">
        <path
          d="M19 18H29V22C29 26.4183 25.4183 30 21 30H19V18Z"
          fill="var(--error-500)"
        />
      </g>
      <path
        d="M19 18H29V22C29 26.4183 25.4183 30 21 30H19V18Z"
        stroke="var(--error-500)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 31H31.5"
        stroke="var(--error-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M22 14V18"
        stroke="var(--error-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M26 14V18"
        stroke="var(--error-500)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CourseManagementUsersIcon(
  props: Readonly<React.SVGProps<SVGSVGElement>>,
) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 10C0 4.47715 4.47715 0 10 0H38C43.5229 0 48 4.47715 48 10V38C48 43.5228 43.5228 48 38 48H10C4.47715 48 0 43.5228 0 38V10Z"
        fill="var(--purple-50)"
      />
      <path
        d="M36 12V36H12V12H36Z"
        fill="white"
        fillOpacity="0.01"
      />
      <g opacity="0.3">
        <path
          d="M28 19C28 21.2091 26.2091 23 24 23C21.7909 23 20 21.2091 20 19C20 16.7909 21.7909 15 24 15C26.2091 15 28 16.7909 28 19Z"
          fill="var(--purple-500)"
        />
        <path
          d="M32 32C32 32.5523 31.5523 33 31 33H17C16.4477 33 16 32.5523 16 32V31C16 28.7909 17.7909 27 20 27H28C30.2091 27 32 28.7909 32 31V32Z"
          fill="var(--purple-500)"
        />
      </g>
      <path
        d="M28 19C28 21.2091 26.2091 23 24 23C21.7909 23 20 21.2091 20 19C20 16.7909 21.7909 15 24 15C26.2091 15 28 16.7909 28 19Z"
        stroke="var(--purple-500)"
        strokeWidth="2"
      />
      <path
        d="M32 32C32 32.5523 31.5523 33 31 33H17C16.4477 33 16 32.5523 16 32V31C16 28.7909 17.7909 27 20 27H28C30.2091 27 32 28.7909 32 31V32Z"
        stroke="var(--purple-500)"
        strokeWidth="2"
      />
    </svg>
  );
}

type MetricCardTheme = {
  icon: React.ReactNode;
  title: string;
  value: string;
  percentChange: number;
  isPositive: boolean;
  comparisonText: string;
  valueColorVar: string;
  hoverShadowClass: string;
  cssVars: React.CSSProperties;
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
      icon: <GymsIconPrimary />,
      valueColorVar: "var(--primary-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(255,91,4,0.28)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--primary-50": "#ffefe6",
        "--primary-500": "#ff5b04",
      }),
    },
    {
      title: "total members",
      value: "8,746",
      percentChange: 2.4,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <CourseManagementUsersIcon />,
      valueColorVar: "var(--purple-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(126,82,255,0.26)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--purple-50": "#f2eeff",
        "--purple-500": "#7e52ff",
      }),
    },
    {
      title: "Total Trainers",
      value: "56",
      percentChange: 1.9,
      isPositive: true,
      comparisonText: "vs last month",
      icon: <TrainersIconBlue />,
      valueColorVar: "var(--blue-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(67,66,255,0.26)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--blue-50": "#ececff",
        "--blue-500": "#4342ff",
      }),
    },
    {
      title: "Active challenges",
      value: "14",
      percentChange: -1.7,
      isPositive: false,
      comparisonText: "vs last month",
      icon: <ChallengesIconError />,
      valueColorVar: "var(--error-500)",
      hoverShadowClass:
        "hover:shadow-[0_14px_30px_-20px_rgba(211,47,47,0.22)]",
      cssVars: mergeCssVars({
        ...baseVars,
        "--error-50": "#fbeaea",
        "--error-500": "#d32f2f",
      }),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardThemes.map((card) => {
        const TrendIcon = card.isPositive ? TrendUpIcon : TrendDownIcon;
        const percent = Math.abs(card.percentChange);

        return (
          <Card
            key={card.title}
            className={`@container/card p-0 gap-0 bg-white border border-[#f4f4f4] shadow-none transition-shadow ${card.hoverShadowClass}`}
            style={card.cssVars}
          >
            <div className="flex flex-col gap-2 p-5">
              <div className="flex flex-col items-start gap-5">
                {card.icon}
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--grey-800)" }}
                >
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
                    style={{
                      color: card.isPositive
                        ? "var(--success-500)"
                        : "var(--error-400)",
                    }}
                  >
                    <TrendIcon className="size-4" />
                    ~{percent}%
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
        );
      })}
    </div>
  );
}
