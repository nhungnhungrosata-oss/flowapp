import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatNumber(value: number) { return new Intl.NumberFormat("vi-VN").format(value); }
export function formatDate(value: Date | string) { return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
export function sleep(ms: number) { return new Promise((resolve) => setTimeout(resolve, ms)); }
