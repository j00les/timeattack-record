// import { formatGapToFirst } from '/helper/index.js';

// const leaderboardTableBody = document.querySelector('.table tbody');

// const isOdd = (number) => {
//   return number % 2 !== 0;
// };

// const fetchLeaderboardData = async () => {
//   try {
//     const response = await fetch('/api/result-data');
//     const data = await response.json();
//     const sortedRecords = Object.values(data).sort((a, b) => a.lapTime - b.lapTime);

//     sortedRecords.forEach((record, index) => {
//       console.log(record);
//       const newRow = document.createElement('tr');
//       const position = index + 1;
//       const isSingleDigit = position < 10;
//       const positionClass = isSingleDigit ? 'single-digit' : '';
//       const formattedGapToFirst = formatGapToFirst(record.gaptime);

//       if (isOdd(index)) {
//         newRow.style.backgroundColor = '#D0D0D0';
//       }

//       newRow.innerHTML = `
//         <td class="position">
//           <div class="player-position ${positionClass}" style="color: black;">${position}</div>
//           <div class="color-box ${record.colorclass}"></div>
//           <div class="player-name">
//             <p class="name">${record.name}</p>
//           </div>
//         </td>
//         <td class="time">
//           <div class="player-time">
//             <p class="time-text">${record.laptimestring}</p>
//           </div>
//         </td>
//         <td class="gap-to-first">
//           <div class="">
//             <p class="gap-to-first-text">${formattedGapToFirst}</p>
//           </div>
//         </td>
//         <td class="car">${record.carname}</td>
//       `;

//       leaderboardTableBody.appendChild(newRow);
//     });
//   } catch (error) {
//     console.error('Error fetching leaderboard data:', error);
//   }
// };

// window.onload = fetchLeaderboardData;

import { formatGapToFirst } from '/helper/index.js';

const leaderboardTableBody = document.querySelector('.table tbody');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

let currentPage = 1;
const recordsPerPage = 10;
let totalPages = 1;
let allRecords = [];

const isOdd = (number) => number % 2 !== 0;

const renderPage = (page) => {
  // Clear existing rows
  leaderboardTableBody.querySelectorAll('tr:not(:first-child)').forEach((row) => row.remove());

  // Calculate start and end index for the page
  const startIndex = (page - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, allRecords.length);
  const pageRecords = allRecords.slice(startIndex, endIndex);

  // Render rows for the current page
  pageRecords.forEach((record, index) => {
    const newRow = document.createElement('tr');
    const position = startIndex + index + 1;
    const isSingleDigit = position < 10;
    const positionClass = isSingleDigit ? 'single-digit' : '';
    const formattedGapToFirst = formatGapToFirst(record.gaptime);

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
                <p class="time-text">${record.laptimestring}</p>
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

  // Update pagination controls
  prevButton.disabled = page === 1;
  nextButton.disabled = page === totalPages;
  pageInfo.textContent = `Page ${page} of ${totalPages}`;
};

const fetchLeaderboardData = async () => {
  try {
    const response = await fetch('/api/result-data');
    const data = await response.json();
    allRecords = Object.values(data).sort((a, b) => a.lapTime - b.lapTime);
    console.log(data, '--debug');

    totalPages = Math.ceil(allRecords.length / recordsPerPage);
    renderPage(currentPage);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
  }
};

// Event listeners for pagination
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderPage(currentPage);
  }
});

nextButton.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage += 1;
    renderPage(currentPage);
  }
});

window.onload = fetchLeaderboardData;
