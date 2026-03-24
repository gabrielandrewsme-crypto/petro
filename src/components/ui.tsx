import { ReactNode } from "react";
import { cn, formatPercent } from "@/lib/utils";

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-header">
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}

export function Card({
  title,
  subtitle,
  children,
  className,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("panel", className)}>
      {title ? (
        <div className="panel-heading">
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </div>
  );
}

export function ProgressBar({ value, tone = "blue" }: { value: number; tone?: "blue" | "yellow" | "green" }) {
  return (
    <div className="progress-track">
      <div className={cn("progress-fill", tone)} style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

export function MiniBarChart({
  items,
  type = "percent",
}: {
  items: Array<{ label: string; value: number; color?: string }>;
  type?: "percent" | "number";
}) {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <div className="mini-chart">
      {items.map((item) => (
        <div key={item.label} className="mini-chart-row">
          <div className="mini-chart-meta">
            <span>{item.label}</span>
            <strong>{type === "percent" ? formatPercent(item.value) : item.value}</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill blue"
              style={{
                width: `${(item.value / max) * 100}%`,
                background: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
