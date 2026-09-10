export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function formatFullDateTime(iso: string): string {
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  const timeStr = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${dateStr} at ${timeStr}`;
}

export function formatDueDateTime(iso: string): string {
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
  const timeStr = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${dateStr}, ${timeStr}`;
}

export function timeParts(iso: string): { time: string; period: string } {
  const full = formatTime(iso);
  const m = full.match(/^(.*?)\s?(AM|PM)$/i);
  return m ? { time: m[1], period: m[2].toUpperCase() } : { time: full, period: "" };
}

export function monthShort(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { month: "short" }).toUpperCase();
}

export function dayNum(iso: string): number {
  return new Date(iso).getDate();
}

export function isToday(iso: string): boolean {
  const d = new Date(iso), n = new Date();
  return d.getFullYear() === n.getFullYear() && d.getMonth() === n.getMonth() && d.getDate() === n.getDate();
}

export function durationSuffix(mins: number): string {
  return mins ? ` · ${mins} min` : "";
}

export function formatDuration(ms: number): string {
  if (ms <= 0) return "0s";
  let s = Math.floor(ms / 1000);
  const d = Math.floor(s / 86400); s %= 86400;
  const h = Math.floor(s / 3600); s %= 3600;
  const m = Math.floor(s / 60); s %= 60;
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (d || h) parts.push(`${h}h`);
  if (d || h || m) parts.push(`${m}m`);
  if (!d) parts.push(`${s}s`);
  return parts.join(" ");
}

export function formatMMSS(totalSec: number): string {
  const sec = Math.max(0, totalSec);
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
