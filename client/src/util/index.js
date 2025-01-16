const parseLapTime = (rawTime) => {
  const rawTimeString = String(rawTime).padStart(7, '0'); // Ensure consistent 7-character string
  const minutes = parseInt(rawTimeString.slice(0, 2), 10); // First 2 characters for minutes
  const seconds = parseInt(rawTimeString.slice(2, 4), 10); // Next 2 characters for seconds
  const milliseconds = parseInt(rawTimeString.slice(4, 7), 10); // Last 3 characters for milliseconds

  console.log(minutes, seconds, milliseconds, '--debug time');
  // Validate time segments
  if (seconds >= 60 || milliseconds >= 1000) {
    throw new Error(`Invalid lap time: ${rawTime}`);
  }

  const result = minutes * 60000 + seconds * 1000 + milliseconds;

  console.log(result, '--debug result');

  return result;
};

const formatLapTime = (totalMilliseconds) => {
  const minutes = Math.floor(totalMilliseconds / 60000);
  const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
  const milliseconds = totalMilliseconds % 1000;

  const result = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(
    milliseconds
  ).padStart(3, '0')}`;

  console.log(result);

  return result;
};

const calculateLapTime = (sortedData) => {
  if (sortedData.length === 0) return [];

  return sortedData.map((record) => {
    // Convert lapTime to milliseconds using parseLapTime
    const lapTimeMilliseconds = parseLapTime(record.lapTime);

    // Format lapTime back to MM:SS.mmm for consistency
    const formattedLapTime = formatLapTime(lapTimeMilliseconds);

    return {
      ...record,
      lapTime: formattedLapTime // Ensure lapTime is properly formatted
    };
  });
};

const sortAndCalculateLeaderboard = (data) => {
  const sortedData = [...data].sort((a, b) => parseLapTime(a.lapTime) - parseLapTime(b.lapTime));
  return calculateLapTime(sortedData);
};

export { sortAndCalculateLeaderboard };
