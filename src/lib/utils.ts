import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Address } from "@/app/(protected)/account/[customerId]/address/page";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 *
 * @param str
 * @returns
 */
export const base64Encode = (str: string) => {
  const b = Buffer.from(str);
  return b.toString("base64");
};

/**
 *
 * @param str
 * @returns
 */
export const base64Decode = (str: string) => {
  const b = Buffer.from(str, "base64");
  return b.toString();
};

/**
 * Retrieves a value from localStorage by its key, and parses it as type `T`.
 * @param key The key to look up in localStorage.
 * @returns The parsed value as type `T`, or `null` if no value is found for the given key.
 * @template T The type of the value to parse from localStorage. Defaults to `any`.
 */
export const getItem = (key: string) => {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.localStorage.getItem(key);
  return value;
};

/**
 * Saves a value to localStorage with the given key.
 * @param key The key to use to store the value in localStorage.
 * @param value The value to save to localStorage.
 */
export const setItem = <T>(key: string, value: T) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Removes the key/value pair with the given key, if a key/value pair with the given key exists
 * @param key A string containing the name of the key you want to remove.
 * @returns
 */
export const removeItem = (key: string) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(key);
};

export const removeEmptyValues = <T extends object>(
  obj: T | undefined
): Partial<T> => {
  if (!obj) return {};

  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined) {
      acc[key as keyof T] = value as T[keyof T];
    }
    return acc;
  }, {} as Partial<T>);
};

/**
 *
 * @param page
 * @param total
 * @param delta
 * @returns
 */
export const pagination = (
  currentPage: number,
  totalPage: number,
  delta = 2
) => {
  const pages = [];
  const left = currentPage - delta;
  const right = currentPage + delta;
  for (let i = 1; i <= totalPage; i++) {
    if (
      i == 1 ||
      i == totalPage ||
      i == currentPage ||
      (i >= left && i <= right)
    ) {
      pages.push(i);
    } else if (i == left - 1 || i == right + 1) {
      pages.push("...");
    }
  }
  return pages;
};

export function convertVndToUsd(vnd: number, rate = 25000): string {
  return (vnd / rate).toFixed(2);
}

export const generateOrderCode = () => {
  // Ví dụ: ORD20250708-xxxx
  return `ORD${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "")}-${Math.floor(Math.random() * 10000)}`;
};

export const buildShippingAddress = (address: Address) => {
  // address là object selectedAddress FE của bạn
  return [address?.address, address?.ward, address?.district, address?.city]
    .filter(Boolean)
    .join(", ");
};
