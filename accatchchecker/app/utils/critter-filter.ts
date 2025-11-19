import { ALL_DATA } from "../data";
import { Critter } from "../interfaces/critter";

export function filterAllCritters(date: Date, hemisphere: string) {
  return {
    insects: filterCategory(ALL_DATA.insects, date, hemisphere),
    fish: filterCategory(ALL_DATA.fish, date, hemisphere),
    seaCreatures: filterCategory(ALL_DATA.seaCreatures, date, hemisphere),
  };
}

export function filterCategory(critters: Critter[], date: Date, hemisphere: string) {
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = monthNames[date.getMonth()];

  const currentTime = date.getHours() + date.getMinutes() / 60; // decimal hour

  return critters.filter((critter) => {
    const availability = critter[`${hemisphere} ${month}`];

    if (!availability || availability === "NA") return false;
    if (availability.toLowerCase() === "all day") return true;

    const ranges = availability.split(",").map((r: string) => r.trim());

    for (const range of ranges) {
      const [startStr, endStr] = range.split("–").map((s: string) => s.trim());
      if (!startStr || !endStr) continue;

      const start = to24HourFormat(startStr);
      const end = to24HourFormat(endStr);

      // Normal range (same day)
      if (start < end) {
        if (currentTime >= start && currentTime < end) return true;
      } else {
        // Overnight range (wraps past midnight)
        if (currentTime >= start || currentTime < end) return true;
      }
    }

    return false; // not in any range
  });
}

export function to24HourFormat(timeStr: string): number {
  const [timePart, period] = timeStr.split(" ").map(s => s.trim().toLowerCase());
  const [hourStr, minuteStr] = timePart.split(":");
  let hour = parseInt(hourStr, 10);
  const minutes = minuteStr ? parseInt(minuteStr, 10) : 0;

  if (period === "pm" && hour !== 12) hour += 12;
  if (period === "am" && hour === 12) hour = 0;

  return hour + minutes / 60;
}
