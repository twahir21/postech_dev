import { differenceInMinutes, differenceInHours, differenceInDays, differenceInMonths, formatDistanceToNow } from 'date-fns';

export function timeRemainingUntil(dateStr: string): string {
  const targetDate = new Date(dateStr);
  const now = new Date();

  if (targetDate < now) return "Imepita";

  const minutes = differenceInMinutes(targetDate, now);
  const hours = differenceInHours(targetDate, now);
  const days = differenceInDays(targetDate, now);
  const months = differenceInMonths(targetDate, now);

  if (minutes < 60) return `Zimebaki dakika ${minutes}`;
  if (hours < 24) return `Zimebaki saa ${hours}`;
  if (days < 31) return `Zimebaki siku ${days}`;
  if (months < 12) return `Zimebaki miezi ${months}`;

  return `Zimebaki: ${formatDistanceToNow(targetDate, { addSuffix: true })}`;
}
