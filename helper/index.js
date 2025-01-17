const formatLapTime = (timeString) => {
  const paddedTime = timeString.padStart(7, '0');
  const minutes = paddedTime.substring(0, 2);
  const seconds = paddedTime.substring(2, 4);
  const milliseconds = paddedTime.substring(4);
  return `${minutes}:${seconds}:${milliseconds}`;
};

const formatGapToFirst = (milliseconds) => {
  const seconds = Math.floor(milliseconds / 1000);
  const remainingMilliseconds = milliseconds % 1000;
  const formattedGap = `${seconds.toString().padStart(2, '0')}.${remainingMilliseconds
    .toString()
    .padStart(3, '0')}`;
  return formattedGap;
};

const timeToMilliseconds = (formattedTime) => {
  const [minutes, seconds, milliseconds] = formattedTime.split(':');
  return (
    parseInt(minutes) * 60000 + // Minutes to milliseconds
    parseInt(seconds) * 1000 + // Seconds to milliseconds
    parseInt(milliseconds) // Milliseconds
  );
};

export { formatLapTime, formatGapToFirst, timeToMilliseconds };
