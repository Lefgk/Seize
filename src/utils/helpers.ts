import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const shortenText = (str: string) => {
  if (str.length > 8) {
    return `${str.slice(0, 4)}...${str.slice(str.length - 4)}`
  }
  return str
}
export const valueNumFormatter = (num: number, minAmount: number = 0.0001) => {
  return num < minAmount ? `< ${minAmount}` : num.toLocaleString("en")
}
export const getShortErrorMessage = (e: any, unknownMessage: string = "Unknown"): string => {
  if (typeof e === "string") {
    return e;
  } else if (e?.shortMessage) {
    return e?.shortMessage;
  } if (e instanceof Error) {
    return e.message;
  } else if (typeof e === "object") {
    return JSON.stringify(e, null, 2)
  }
  return unknownMessage;
};

export const parseTokenAmount = (amount: number, decimals: number) => amount * Math.pow(10, decimals)
export const dataURLToFile = (dataUrl: string, filename: string) => {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(base64);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new File([new Uint8Array(array)], filename, { type: mimeType });
}


export const getRemainingTimeObj = (
  ms: number,
  verbose: boolean = false,
  minUnits: number = 0,
): { unit: string; value: number }[] => {
  const totalSeconds = Math.floor(ms / 1000);

  const years = Math.floor(totalSeconds / (365 * 24 * 3600));
  const months = Math.floor((totalSeconds % (365 * 24 * 3600)) / (30 * 24 * 3600));
  const days = Math.floor((totalSeconds % (30 * 24 * 3600)) / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const timeUnits = [
    { unit: verbose ? (years > 1 ? "years" : "year") : "Y", value: years },
    { unit: verbose ? (months > 1 ? "months" : "month") : "M", value: months },
    { unit: verbose ? (days > 1 ? "days" : "day") : "D", value: days },
    { unit: verbose ? (hours > 1 ? "hours" : "hour") : "H", value: hours },
    { unit: verbose ? (minutes > 1 ? "minutes" : "minute") : "M", value: minutes },
    { unit: verbose ? (seconds > 1 ? "seconds" : "second") : "S", value: seconds },
  ];

  const nonZeroUnits = timeUnits.filter(({ value }) => value > 0);

  if (nonZeroUnits.length < minUnits) {
    const allUnits = [...timeUnits];

    for (const unit of allUnits.reverse()) {
      if (nonZeroUnits.length >= minUnits) break;
      if (!nonZeroUnits.some((existingUnit) => existingUnit.unit === unit.unit)) {
        nonZeroUnits.push({ unit: unit.unit, value: 0 });
      }
    }

    nonZeroUnits.sort((a, b) => timeUnits.findIndex(u => u.unit === a.unit) - timeUnits.findIndex(u => u.unit === b.unit));
  }

  return nonZeroUnits.slice(0, Math.max(minUnits, nonZeroUnits.length));
};

export const getRemainingTime = (
  ms: number,
  verbose: boolean = false,
  maxUnits: number = 3,
): string => {
  const remainingTimeJson = getRemainingTimeObj(ms, verbose)
  return (
    remainingTimeJson
      .slice(0, maxUnits)
      .map(({ unit, value }) => `${value}${verbose ? ` ${unit}` : unit}`)
      .join(' ') || '0s'
  );
};