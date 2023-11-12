/** Gets the day of the year. */
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / millisecondsInADay);
  return day;
}

/**
 * Derived from the linked PDF but with the equations differentiated to output
 * longitude with the sunrise as a parameter.
 *
 * @param {number} latitude The latitude in degrees.
 * @param {number} angleToPolaris The angle to polaris in degrees.
 * @param {number} timeAtNoonUTC The time at noon in UTC minutes.
 *
 * @link https://gml.noaa.gov/grad/solcalc/solareqns.PDF
 */
function getLongitude(latitude, angleToPolaris, timeAtNoonUTC) {
  /** The current time in the local time zone. */
  const currentTime = new Date();

  /** The local day of year in numbers (0-365/366). */
  const dayOfYear = getDayOfYear(currentTime);

  /** The local number of hours. */
  const hours = currentTime.getHours();

  /** The number of days in a year depending on if the year is a leap year. */
  const daysInAYear = currentTime.getUTCFullYear() % 4 === 0 ? 366 : 365;

  /**
   * The fractional year in radians.
   *
   * γ = (2 * PI) / 365 * (day_of_year - 1 + (hour - 12) / 24)
   */
  const fractionalYear =
    ((2 * Math.PI) / daysInAYear) * (dayOfYear - 1 + (hours - 12) / 24);

  /**
   * The equation of time in minutes.
   *
   * eqtime = 229.18*(0.000075 + 0.001868cos(γ) – 0.032077sin(γ)
   *           – 0.014615cos(2γ) – 0.040849sin(2γ) )
   */
  const eqTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(fractionalYear) -
      0.032077 * Math.sin(fractionalYear) -
      0.014615 * Math.cos(2 * fractionalYear) -
      0.040849 * Math.sin(2 * fractionalYear));

  /**
   * The longitude. Derived from the equation but we use timeAtUTC instead of
   * snoon.
   *
   * snoon = 720 – 4*longitude – eqtime
   *
   * Therefore,
   *
   * longitude = (720 - snoon - eqtime) / 4
   */
  const longitude = (720 - timeAtNoonUTC - eqTime) / 4;

  return longitude;
}

/** The latitude in degrees. */
const latitude = 42.023502;

/** The angle to polaris in degrees. */
const angleToPolaris = 42.0308;

/** The time of sunrise in the local time. */
const timeAtNoon = new Date("Nov 11, 2023 11:58:00 CST");

/** The time at noon in UTC minutes. */
const timeAtNoonUTC =
  timeAtNoon.getUTCHours() * 60 + timeAtNoon.getUTCMinutes();

/** The longitude estimate. */
const longitude = getLongitude(latitude, angleToPolaris, timeAtNoonUTC);

console.log({ latitude, longitude });
