import "./index.css";

/** The form's HTML element. */
const $form = document.querySelector("#form");

/** The tutorial help button HTML element. */
const $tutorialButton = document.querySelector("#tutorial-button");

/** The teleporter button HTML element. */
const $teleporterButton = document.querySelector("#teleporter-button");

/** The teleporter HTML element. */
const $teleporter = document.querySelector("#teleporter");

/** Button that starts camera to align polaris */
const $angleHelperButton = document.querySelector("#angle-helper-button");

/**
 * The teleporter locations from timeanddate.
 *
 * @link https://www.timeanddate.com/
 */
const teleporterLocations = {
  "ames-ia": {
    polarAngle: 42.025811,
    solarNoon: "11:58 CST",
  },
  "new-york": {
    polarAngle: 40.6970193,
    solarNoon: "11:43 EST",
  },
  amboseli: {
    polarAngle: -2.6526705,
    solarNoon: "12:14 UTC+3",
  },
  kyiv: {
    polarAngle: 50.4015698,
    solarNoon: "11:41 UTC+2",
  },
};

/** The output HTML element. */
const $output = document.querySelector("#output");

/** The tutorial HTML element. */
const $tutorial = document.querySelector("#tutorial");

/** The latitude span HTML element. */
const $latitude = $output.querySelector("#latitude");

/** The longitude span HTML element. */
const $longitude = $output.querySelector("#longitude");

// The handle for form submissions.
$form.addEventListener("submit", (e) => {
  // Stop default PHP-inspired POST request behavior.
  e.preventDefault();

  const data = new FormData($form);

  showLocation(parseFloat(data.get("polarAngle")), data.get("solarNoon"));
});

/**
 * Shows the computed location coordinates.
 *
 * @param {number} polarAngle
 * @param {string} solarNoon
 */
function showLocation(polarAngle, solarNoonTime) {
  const currentTime = new Date();

  const solarNoonString = `${
    currentTime.getMonth() + 1
  }/${currentTime.getDate()}/${currentTime.getFullYear()} ${solarNoonTime}`;

  const solarNoon = new Date(solarNoonString);

  const timeAtNoonUTC =
    solarNoon.getUTCHours() * 60 + solarNoon.getUTCMinutes();

  const longitude = getLongitude(timeAtNoonUTC);

  $latitude.textContent = formatAngle("latitude", polarAngle);
  $longitude.textContent = formatAngle("longitude", longitude);

  $output.classList.remove("hidden");
  $tutorial.classList.add("hidden");

  $output.href = `https://www.google.com/maps/@${polarAngle.toFixed(
    7
  )},${longitude.toFixed(7)},10.21z?entry=ttu`;
}

// The handle for the tutorial button.
$tutorialButton.addEventListener("click", () => {
  // Close the tutorial if it is already open.
  if (!$tutorial.classList.contains("hidden")) {
    $tutorial.classList.add("hidden");
    return;
  }

  $tutorial.classList.remove("hidden");
  $output.classList.add("hidden");
});

// The handle for the teleporter button.
$teleporterButton.addEventListener("click", () => {
  $teleporter.classList.add("showing");
  $teleporterButton.classList.add("hiding");
});

// The handle for teleporters.
for (const [location, { polarAngle, solarNoon }] of Object.entries(
  teleporterLocations
)) {
  const $location = $teleporter.querySelector(`#${location}`);
  $location.addEventListener("click", () => {
    $form.querySelector("[name=polarAngle]").value = polarAngle;
    $form.querySelector("[name=solarNoon]").value = solarNoon.split(" ")[0];
    showLocation(polarAngle, solarNoon);
  });
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
function getLongitude(timeAtNoonUTC) {
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

/**
 * Gets the day of the year.
 *
 * @param {Date} date The date to get the day of the year for.
 * @returns {number} The numerical day of the year.
 */
function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const millisecondsInADay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / millisecondsInADay);
  return day;
}

/**
 * Converts a float angle to a pretty format.
 *
 * @param {"longitude" | "latitude"} mode The mode to format the angle in.
 * @param {number} angle The angle in degrees.
 * @returns {string} The formatted angle.
 */
function formatAngle(mode, angle) {
  const degrees = Math.floor(Math.abs(angle));
  const minutes = (Math.abs(angle) - degrees) * 60;
  const seconds = (minutes - Math.floor(minutes)) * 60;
  const suffix =
    angle < 0
      ? mode === "longitude"
        ? "W"
        : "S"
      : mode === "longitude"
      ? "E"
      : "N";

  return `${degrees}° ${Math.floor(minutes)}' ${Math.floor(
    seconds
  )}" ${suffix}`;
}

// The code below was used to estimate the longitude of Ames, IA using a given
// angleToPolaris and the time of noon.
//
// /** The latitude in degrees. */
// const latitude = 42.023502;
//
// /** The angle to polaris in degrees. */
// const angleToPolaris = 42.0308;
//
// /** The time of noon in the local timezone. */
// const timeAtNoon = new Date("Nov 11, 2023 11:58:00 CST");
//
// /** The time at noon in UTC minutes. */
// const timeAtNoonUTC =
//   timeAtNoon.getUTCHours() * 60 + timeAtNoon.getUTCMinutes();
//
// /** The longitude estimate. */
// const longitude = getLongitude(latitude, angleToPolaris, timeAtNoonUTC);
//
// console.log({ latitude, longitude });

let deviceOrientationAngle = 0;
let hasHandledDeviceOrientationEvents = false;

/**
 * Handles device orientation updates.
 *
 * @param {DeviceOrientationEvent} e
 */
function deviceOrientationHandler(e) {
  deviceOrientationAngle = e.beta;
}

/** Registers the device orientation handler. */
function registerDeviceOrientationHandler() {
  if (
    window.DeviceOrientationEvent !== undefined &&
    typeof window.DeviceOrientationEvent.requestPermission === "function"
  ) {
    // iOS 13+
    window.DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          window.addEventListener(
            "deviceorientation",
            deviceOrientationHandler,
            false
          );
        }
      })
      .catch((e) => alert(e.message));
  } else {
    // non iOS 13+
    window.addEventListener(
      "deviceorientation",
      deviceOrientationHandler,
      false
    );
  }
}

/** Modal that holds the camera stream */
const $cameraModal = document.querySelector("#camera-modal");

/** Video dom element that streams camera */
const $videoElement = document.querySelector("#camera-video-element");

/** Closes video and saves orientation */
const $saveAngleButton = document.querySelector("#save-angle-button");

$angleHelperButton.addEventListener("click", () => {
  if (!hasHandledDeviceOrientationEvents) {
    registerDeviceOrientationHandler();
    hasHandledDeviceOrientationEvents = true;
  }

  $cameraModal.classList.toggle("hidden");
  $videoElement.setAttribute("autoplay", "autoplay");

  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } }) // 'environment' tries to access the rear camera
    .then(function (stream) {
      $videoElement.srcObject = stream;
    })
    .catch(function (err) {
      alert("Error accessing the camera: " + err);
    });
});

$saveAngleButton.addEventListener("click", () => {
  $videoElement.srcObject = null;
  $cameraModal.classList.add("hidden");

  // NOTE: The given angle is off by 90 degrees.
  $form.querySelector("[name=polarAngle]").value = deviceOrientationAngle - 90;
});
