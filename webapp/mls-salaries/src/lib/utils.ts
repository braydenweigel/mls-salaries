import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCompactCurrency(value: number){
  const abs = Math.abs(value)

  if (abs >= 1_000_000){
    return `$${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`
  }
  if (abs >= 1_000){
    return `$${(value / 1_000).toFixed(0)}k`
  }
  return `$${value}`
}
