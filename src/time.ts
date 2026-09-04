export interface City {
  label: string;
  timeZone: string;
}

interface ZonedParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface CitySnapshot {
  daySerial: number;
  hour: number;
  isWorkingHour: boolean;
  timeline: string;
}

const timeFormatters = new Map<string, Intl.DateTimeFormat>();
const displayFormatters = new Map<string, Intl.DateTimeFormat>();

function getDisplayFormatter(
  key: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const cached = displayFormatters.get(key);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat(locale, options);
  displayFormatters.set(key, formatter);
  return formatter;
}

function getPartsFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = timeFormatters.get(timeZone);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  timeFormatters.set(timeZone, formatter);
  return formatter;
}

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const values = Object.fromEntries(
    getPartsFormatter(timeZone)
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, Number(part.value)]),
  );

  return {
    year: values.year,
    month: values.month,
    day: values.day,
    hour: values.hour,
    minute: values.minute,
    second: values.second,
  };
}

function sameWallClock(left: ZonedParts, right: ZonedParts): boolean {
  return (
    left.year === right.year &&
    left.month === right.month &&
    left.day === right.day &&
    left.hour === right.hour &&
    left.minute === right.minute
  );
}

function hasAlternativeWallClockMatch(candidate: number, parts: ZonedParts, timeZone: string): boolean {
  const searchRangeMinutes = 180;

  for (let offsetMinutes = -searchRangeMinutes; offsetMinutes <= searchRangeMinutes; offsetMinutes += 15) {
    if (offsetMinutes === 0) continue;

    const alternative = new Date(candidate + offsetMinutes * 60_000);
    if (sameWallClock(getZonedParts(alternative, timeZone), parts)) return true;
  }

  return false;
}

function zonedWallClockToInstant(parts: ZonedParts, timeZone: string): Date | undefined {
  const desiredUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  let candidate = desiredUtc;

  for (let iteration = 0; iteration < 4; iteration += 1) {
    const actual = getZonedParts(new Date(candidate), timeZone);
    const actualUtc = Date.UTC(
      actual.year,
      actual.month - 1,
      actual.day,
      actual.hour,
      actual.minute,
      actual.second,
    );
    const adjustment = desiredUtc - actualUtc;
    candidate += adjustment;
    if (adjustment === 0) break;
  }

  const result = new Date(candidate);
  if (!sameWallClock(getZonedParts(result, timeZone), parts)) return undefined;
  if (hasAlternativeWallClockMatch(candidate, parts, timeZone)) return undefined;
  return result;
}

export function shiftInstant(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

export function parseTimeQuery(query: string, base: Date, anchorTimeZone: string): Date | undefined {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (!normalized) return undefined;
  if (normalized === "now") return new Date();

  const relative = normalized.match(
    /^([+-])\s*(\d+(?:\.\d+)?)\s*(m|min|mins|minute|minutes|h|hr|hrs|hour|hours|d|day|days)$/,
  );
  if (relative) {
    const direction = relative[1] === "+" ? 1 : -1;
    const amount = Number(relative[2]);
    const unit = relative[3][0];
    const multiplier = unit === "d" ? 1_440 : unit === "h" ? 60 : 1;
    const shifted = shiftInstant(base, direction * amount * multiplier);
    return Number.isFinite(shifted.getTime()) ? shifted : undefined;
  }

  const clock = normalized.match(/^(?:(today|tomorrow|yesterday)\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!clock) return undefined;

  const dayWord = clock[1];
  let hour = Number(clock[2]);
  const minute = Number(clock[3] ?? 0);
  const meridiem = clock[4];

  if (minute > 59) return undefined;
  if (meridiem) {
    if (hour < 1 || hour > 12) return undefined;
    hour = (hour % 12) + (meridiem === "pm" ? 12 : 0);
  } else if (hour > 23) {
    return undefined;
  }

  const baseParts = getZonedParts(base, anchorTimeZone);
  const dayOffset = dayWord === "tomorrow" ? 1 : dayWord === "yesterday" ? -1 : 0;
  const shiftedDay = new Date(Date.UTC(baseParts.year, baseParts.month - 1, baseParts.day + dayOffset));

  return zonedWallClockToInstant(
    {
      year: shiftedDay.getUTCFullYear(),
      month: shiftedDay.getUTCMonth() + 1,
      day: shiftedDay.getUTCDate(),
      hour,
      minute,
      second: 0,
    },
    anchorTimeZone,
  );
}

export function formatTimeInZone(date: Date, timeZone: string, use24Hour: boolean): string {
  return getDisplayFormatter(`time:${timeZone}:${use24Hour ? "24" : "12"}`, use24Hour ? "en-GB" : "en-US", {
    timeZone,
    hour: use24Hour ? "2-digit" : "numeric",
    minute: "2-digit",
    hour12: !use24Hour,
  }).format(date);
}

export function formatDateInZone(date: Date, timeZone: string): string {
  return getDisplayFormatter(`date:${timeZone}`, "en-US", {
    timeZone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatTimeZoneName(date: Date, timeZone: string): string {
  const parts = getDisplayFormatter(`zone:${timeZone}`, "en-US", {
    timeZone,
    timeZoneName: "long",
  }).formatToParts(date);
  return parts.find((part) => part.type === "timeZoneName")?.value ?? timeZone;
}

function daySerial(date: Date, timeZone: string): number {
  const parts = getZonedParts(date, timeZone);
  return Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000;
}

export function describeDayDifference(date: Date, anchorTimeZone: string, timeZone: string): string {
  return describeDayOffset(daySerial(date, timeZone) - daySerial(date, anchorTimeZone));
}

export function describeDayOffset(difference: number): string {
  if (difference === 0) return "Same day";
  if (difference === 1) return "Tomorrow";
  if (difference === -1) return "Yesterday";
  return difference > 0 ? `${difference} days ahead` : `${Math.abs(difference)} days behind`;
}

export function localHour(date: Date, timeZone: string): number {
  const parts = getZonedParts(date, timeZone);
  return parts.hour + parts.minute / 60;
}

export function isWorkingHour(date: Date, timeZone: string): boolean {
  const hour = localHour(date, timeZone);
  return hour >= 9 && hour < 17;
}

export function buildTimeline(date: Date, timeZone: string): string {
  return buildTimelineFromHour(localHour(date, timeZone));
}

function buildTimelineFromHour(hour: number): string {
  const markerIndex = Math.min(23, Math.floor(hour));
  return Array.from({ length: 24 }, (_, index) => (index === markerIndex ? "●" : "·")).join("");
}

export function getCitySnapshot(date: Date, timeZone: string): CitySnapshot {
  const parts = getZonedParts(date, timeZone);
  const hour = parts.hour + parts.minute / 60;
  return {
    daySerial: Date.UTC(parts.year, parts.month - 1, parts.day) / 86_400_000,
    hour,
    isWorkingHour: hour >= 9 && hour < 17,
    timeline: buildTimelineFromHour(hour),
  };
}

function isValidTimeZone(timeZone: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone }).format();
    return true;
  } catch {
    return false;
  }
}

export function parseCities(value: string): City[] {
  const seen = new Set<string>();

  return value
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap((entry) => {
      const separator = entry.indexOf("|");
      if (separator < 1) return [];

      const label = entry.slice(0, separator).trim();
      const timeZone = entry.slice(separator + 1).trim();
      if (!label || !isValidTimeZone(timeZone) || seen.has(timeZone)) return [];

      seen.add(timeZone);
      return [{ label, timeZone }];
    });
}
