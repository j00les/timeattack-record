const lapForm = document.getElementById('lapForm');
const table = document.querySelector('.table');

const colors = ['red', 'blue', 'green', 'orange', 'yellow', 'violet'];

const records = {};
const socket = new WebSocket('ws://localhost:3000');

// Listen for real-time updates from the server
socket.onmessage = function (event) {
  const updatedRecord = JSON.parse(event.data);

  console.log(updatedRecord, '--debug cobain aja');

  const driverKey = `${updatedRecord.name}-${updatedRecord.carName}`;
  records[driverKey] = updatedRecord;

  updateLeaderboard();
};

// check if lapform exist first
if (lapForm) {
  lapForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim().toUpperCase();
    const lapTimeString = document.getElementById('lapTime').value.trim().toUpperCase();
    const carName = document.getElementById('car').value.trim().toUpperCase();

    // Parse the lap time input (e.g., "0050000" to "00:50:000")
    const formattedTime = formatLapTime(lapTimeString);

    // Convert lap time to milliseconds for comparison
    const lapTimeMilliseconds = timeToMilliseconds(formattedTime);

    const driverKey = `${name}-${carName}`;

    // Check if the record exists
    if (records[driverKey]) {
      // Compare the existing record with the new lap time
      if (lapTimeMilliseconds < records[driverKey].lapTime) {
        records[driverKey].lapTime = lapTimeMilliseconds;
        records[driverKey].lapTimeString = formattedTime;

        // Send updated record to the server
        socket.send(JSON.stringify(records[driverKey]));
      }
    } else {
      // Assign a random color from the colors array
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      // Create a new record
      const newRecord = {
        name,
        carName,
        lapTime: lapTimeMilliseconds,
        lapTimeString: formattedTime,
        colorClass: randomColor
      };

      records[driverKey] = newRecord;

      // Send new record to the server
      socket.send(JSON.stringify(newRecord));
    }

    updateLeaderboard();
    lapForm.reset();
  });
}

// Format input time (e.g., 0050000 to 00:50:000)
function formatLapTime(timeString) {
  const paddedTime = timeString.padStart(7, '0');
  const minutes = paddedTime.substring(0, 2);
  const seconds = paddedTime.substring(2, 4);
  const milliseconds = paddedTime.substring(4);
  return `${minutes}:${seconds}:${milliseconds}`;
}

// Convert formatted time to milliseconds
function timeToMilliseconds(formattedTime) {
  const [minutes, seconds, milliseconds] = formattedTime.split(':');
  return (
    parseInt(minutes) * 60000 + // Minutes to milliseconds
    parseInt(seconds) * 1000 + // Seconds to milliseconds
    parseInt(milliseconds) // Milliseconds
  );
}

function isEven(number) {
  return number % 2 === 0;
}

function updateLeaderboard() {
  // Save to IndexedDB
  saveToIndexedDB(records);

  // Clear and rebuild the leaderboard as before
  const rows = document.querySelectorAll('.table tr');
  rows.forEach((row, index) => {
    if (index !== 0) row.remove();
  });

  const sortedRecords = Object.values(records).sort((a, b) => a.lapTime - b.lapTime);

  sortedRecords.forEach((record, index) => {
    const newRow = document.createElement('tr');

    if (isEven(index)) {
      newRow.style.backgroundColor = '#F0F0F0'
    }



    newRow.innerHTML = `
      <td class="position">
        <div style="color: black;">${index + 1}</div>
        <div class="color-box ${record.colorClass}"></div>
        <div class="player-name">
          <p class="name">${record.name}</p>
        </div>
      </td>
      <td class="time">${record.lapTimeString}</td>
      <td class="car">${record.carName}</td>
    `;
    table.appendChild(newRow);
  });
}

// export result to csv
if (document.getElementById('exportData')) {
  document.getElementById('exportData').addEventListener('click', function () {
    const sortedRecords = Object.values(records).sort((a, b) => a.lapTime - b.lapTime);

    // Convert leaderboard data to CSV
    let csvContent = 'Name,Car,Lap Time\n'; // Header row
    sortedRecords.forEach((record) => {
      csvContent += `${record.name},${record.carName},${record.lapTimeString}\n`;
    });

    // Create a downloadable CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hasil_balap.csv'; // File name
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  });
}

function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RaceLeaderboard', 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;

      // Create an object store for records if it doesn't exist
      if (!db.objectStoreNames.contains('records')) {
        db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject(event.target.error);
    };
  });
}
function saveToIndexedDB(data) {
  initIndexedDB().then((db) => {
    const transaction = db.transaction(['records'], 'readwrite');
    const store = transaction.objectStore('records');

    // Clear the store before saving the updated data
    store.clear();

    Object.values(data).forEach((record) => {
      store.add(record);
    });

    transaction.oncomplete = function () {
      console.log('Data saved to IndexedDB.');
    };

    transaction.onerror = function (event) {
      console.error('Error saving data:', event.target.error);
    };
  });
}

function loadFromIndexedDB() {
  return new Promise((resolve, reject) => {
    initIndexedDB().then((db) => {
      const transaction = db.transaction(['records'], 'readonly');
      const store = transaction.objectStore('records');
      const request = store.getAll();

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };

      request.onerror = function (event) {
        reject(event.target.error);
      };
    });
  });
}

// Load records on page load
window.addEventListener('DOMContentLoaded', function () {
  loadFromIndexedDB().then((data) => {
    if (data.length > 0) {
      data.forEach((record) => {
        const driverKey = `${record.name}-${record.carName}`;
        records[driverKey] = record;
      });
      updateLeaderboard();
    }
  });
});
