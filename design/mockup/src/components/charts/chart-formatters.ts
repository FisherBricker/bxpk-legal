/**
 * bxpk: the registry ships plain Intl date formatters, and bklit's time axis has
 * no formatter prop. This page encodes trip days and seasons as dates, so the
 * two shared formatters below translate them back into the labels the page
 * needs: "Day 3" for a trip day (year 2001) and "Spring 2025" for a season (the
 * 15th of January, April, July or October). Every other date falls through to
 * the original Intl formatting.
 */

const shortIntl = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const weekdayIntl = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

const SEASONS = ["Winter", "", "", "Spring", "", "", "Summer", "", "", "Fall", "", ""];

/** Trip days are encoded as 1 January 2001 plus n days. */
export const TRIP_DAY_YEAR = 2001;

function tripLabel(date: Date): string | null {
  if (date.getFullYear() === TRIP_DAY_YEAR) {
    return `Day ${date.getDate()}`;
  }
  if (date.getDate() === 15 && SEASONS[date.getMonth()]) {
    return `${SEASONS[date.getMonth()]} ${date.getFullYear()}`;
  }
  return null;
}

export const shortDateFmt = {
  format: (date: Date) => tripLabel(date) ?? shortIntl.format(date),
};

export const weekdayDateFmt = {
  format: (date: Date) => tripLabel(date) ?? weekdayIntl.format(date),
};

export const hmsTimeFmt = new Intl.DateTimeFormat("en-US", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

// `Intl.NumberFormat.prototype.format` is a bound getter — safe to extract.
export const intFmt = new Intl.NumberFormat("en-US").format;
