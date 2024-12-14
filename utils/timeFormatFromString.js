export const timeFormatFromString = (timeString) => {
  if (!/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/.test(timeString)) {
    return "Invalid time"; // Return a fallback message or value
  }
  const { hours, minutes } = parse24HourTime(timeString);
  const { hours12, amPm } = convertTo12HourFormat(hours);
  return `${hours12}:${String(minutes).padStart(2, "0")} ${amPm}`;
};

const parse24HourTime = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":").map(Number);
  return { hours, minutes, seconds };
};
// Function to convert 24-hour time to 12-hour format
const convertTo12HourFormat = (hours) => {
  const amPm = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12; // Convert 0 hours to 12 for AM
  return { hours12, amPm };
};

export const formattedLocation = (location) => {
  console.log("Unformatted Location", location);

  // Split the location by commas
  const parts = location.split(",");

  // Keep the first parts until the second-to-last one (city + province)
  const addressWithoutCountryAndPostal = parts
    .slice(0, parts.length - 2)
    .join(",")
    .trim();

  console.log("Formatted Location", addressWithoutCountryAndPostal);
  return addressWithoutCountryAndPostal;
};
