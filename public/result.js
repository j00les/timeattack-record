// Assuming you have a table element in your HTML like this:
const leaderboardTableBody = document.querySelector('.table tbody');

const formatTimeValues = (timeInMilliseconds) => {
  const parsedata = parseInt(timeInMilliseconds, 10);

  console.log(timeInMilliseconds);

  const minutes = Math.floor(parsedata / 60000); // Extract minutes
  const seconds = Math.floor((parsedata % 60000) / 1000); // Extract seconds
  const milliseconds = parsedata % 1000; // Extract milliseconds

  // Format as MM:SS:sss
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(
    milliseconds
  ).padStart(3, '0')}`;
};

const formatGapTimeValues = (timeInMilliseconds) => {
  const totalSeconds = (timeInMilliseconds / 1000).toFixed(3); // Convert to seconds with 3 decimal places

  // Split into whole seconds and milliseconds
  const [seconds, milliseconds] = totalSeconds.split('.');

  // Pad the seconds to ensure it has two digits (e.g., '01' instead of '1')
  const formattedSeconds = seconds.padStart(2, '0');

  // Combine the formatted seconds and milliseconds back
  return `${formattedSeconds}.${milliseconds}`;
};

const isOdd = (number) => {
  return number % 2 !== 0;
};

// Fetch the leaderboard data from the backend when the page loads
const fetchLeaderboardData = async () => {
  try {
    const response = await fetch('/api/result-data'); // Adjust this URL to match your backend route
    const data = await response.json();

    const filteredData = Array.from(
      new Map(data.map((record) => [`${record.name}-${record.carName}`, record])).values()
    );

    filteredData.sort((a, b) => parseInt(a.lapTime, 10) - parseInt(b.lapTime, 10));
    console.log(data, '--debug data');

    // Inject rows into the table
    filteredData.forEach((record, index) => {
      const newRow = document.createElement('tr');

      const position = index + 1;

      const isSingleDigit = position < 10;
      const positionClass = isSingleDigit ? 'single-digit' : '';

      const formattedLapTime = formatTimeValues(record.laptime);
      const formattedGapToFirst = formatGapTimeValues(Math.abs(record.gaptime));

      if (isOdd(index)) {
        newRow.style.backgroundColor = '#D0D0D0';
      }

      newRow.innerHTML = `
        <td class="position">
          <div class="player-position ${positionClass}" style="color: black;">${position}</div>
          <div class="color-box ${record.colorclass}"></div>
          <div class="player-name">
            <p class="name">${record.name}</p>
          </div>
        </td>
        <td class="time">
          <div class="player-time">
            <p class="time-text">${formattedLapTime}</p>
          </div>
        </td>
        <td class="gap-to-first">
          <div class="">
            <p class="gap-to-first-text">${formattedGapToFirst}</p>
          </div>
        </td>
        <td class="car">${record.carname}</td>
      `;

      leaderboardTableBody.appendChild(newRow);
    });
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
  }
};

window.onload = fetchLeaderboardData;
