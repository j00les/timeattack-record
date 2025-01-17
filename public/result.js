import { formatGapToFirst } from '/helper/index.js';

const leaderboardTableBody = document.querySelector('.table tbody');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

let currentPage = 1;
const recordsPerPage = 10;
let totalPages = 1;
let sortedData = [];

const isOdd = (number) => number % 2 !== 0;

const renderPage = (page, sortedData) => {
  leaderboardTableBody.querySelectorAll('tr:not(:first-child)').forEach((row) => row.remove());

  const startIndex = (page - 1) * recordsPerPage;
  const endIndex = Math.min(startIndex + recordsPerPage, sortedData.length);
  const pageRecords = sortedData.slice(startIndex, endIndex);

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
  pageInfo.textContent = `${page} of ${totalPages}`;
};

const fetchLeaderboardData = async () => {
  try {
    const response = await fetch('/api/result-data');
    const data = await response.json();

    const dataArray = Object.values(data);
    sortedData = dataArray.sort((a, b) => Number(a.laptime) - Number(b.laptime));

    totalPages = Math.ceil(sortedData.length / recordsPerPage);

    renderPage(currentPage, sortedData);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);
  }
};

prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage -= 1;
    renderPage(currentPage, sortedData);
  }
});

nextButton.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage += 1;
    renderPage(currentPage, sortedData);
  }
});

window.onload = fetchLeaderboardData;
