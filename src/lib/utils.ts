import { clsx } from "clsx";

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export function liquidScore(correct: number, wrong: number) {
  return correct - wrong;
}
