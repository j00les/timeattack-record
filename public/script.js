import { formatGapToFirst, timeToMilliseconds, formatLapTime } from '/helper/index.js';

const inputPage = document.getElementById('input');
const leaderboardPage = document.getElementById('leaderboard');
const lapForm = document.getElementById('lapForm');
const table = document.querySelector('.table');
const deleteButton = document.getElementById('deleteData');

const records = {};
const socket = new WebSocket('ws://localhost:3000');

// Listen for real-time updates from the server
socket.onmessage = (event) => {
  const updatedRecord = JSON.parse(event.data);

  const driverKey = `${updatedRecord.name}-${updatedRecord.carName}`;
  records[driverKey] = updatedRecord;

  updateLeaderboard();
};

if (lapForm) {
  lapForm.addEventListener('submit', (event) => {
    event.preventDefault();

    // Retrieve and format input values
    const nameInput = document.getElementById('name').value.trim().toUpperCase();
    const lapTimeInput = document.getElementById('lapTime').value.trim().toUpperCase();
    const carNameInput = document.getElementById('car').value.trim().toUpperCase();
    const driveTrainInput = document.getElementById('driveTrain').value.trim().toUpperCase();

    const name = nameInput.length > 18 ? nameInput.slice(0, 11) : nameInput;
    const formattedTime = formatLapTime(lapTimeInput);
    const lapTimeMilliseconds = timeToMilliseconds(formattedTime);

    const driverKey = `${name}-${carNameInput}`;

    const fastestLapTime = Object.values(records).reduce(
      (minTime, record) => Math.min(minTime, record.lapTime),
      Infinity
    );

    let gapToFirst = lapTimeMilliseconds - fastestLapTime;
    if (gapToFirst <= 0) {
      gapToFirst = 0;
    }

    const formattedGapToFirst = formatGapToFirst(gapToFirst);

    // Update or create the record
    if (records[driverKey]) {
      updateRecord(driverKey, lapTimeMilliseconds, formattedTime, gapToFirst);
    } else {
      createRecord(
        name,
        carNameInput,
        driveTrainInput,
        lapTimeMilliseconds,
        formattedTime,
        gapToFirst,
        formattedGapToFirst
      );
    }

    // Update the leaderboard and reset the form
    updateLeaderboard();
    lapForm.reset();
  });
}

function updateRecord(driverKey, lapTimeMilliseconds, formattedTime, gapToFirst) {
  const record = records[driverKey];

  if (lapTimeMilliseconds < record.lapTime) {
    record.lapTime = lapTimeMilliseconds;
    record.lapTimeString = formattedTime;
    record.gapToFirst = gapToFirst;

    socket.send(JSON.stringify(record));
  }
}

function createRecord(name, carName, driveTrain, lapTimeMilliseconds, formattedTime, gapToFirst) {
  const driveTrainColors = {
    FWD: 'blue',
    AWD: 'violet',
    RWD: 'red'
  };

  const colorClass = driveTrainColors[driveTrain];
  const newRecord = {
    name,
    carName,
    driveTrain,
    lapTime: lapTimeMilliseconds,
    gapToFirst,
    lapTimeString: formattedTime,

    colorClass
  };

  const driverKey = `${name}-${carName}`;
  records[driverKey] = newRecord;
  socket.send(JSON.stringify(newRecord));
}

const isOdd = (number) => {
  return number % 2 !== 0;
};

const updateLeaderboard = () => {
  const sortedRecords = Object.values(records).sort((a, b) => a.lapTime - b.lapTime);
  const top20Records = sortedRecords.slice(0, 20);
  const rows = document.querySelectorAll('.table tr');

  saveToIndexedDB(records);

  rows.forEach((row, index) => {
    if (index !== 0) row.remove();
  });

  if (leaderboardPage) {
    // Get the fastest lap time to calculate gaps
    const fastestLapTime = top20Records[0]?.lapTime || 0;

    top20Records.forEach((record, index) => {
      const newRow = document.createElement('tr');
      const position = index + 1;
      const isSingleDigit = position < 10;
      const positionClass = isSingleDigit ? 'single-digit' : '';
      newRow.id = 'raceDataRow';

      if (isOdd(index)) {
        newRow.style.backgroundColor = '#D0D0D0';
      }

      // Calculate the gap to the first driver
      const gapToFirstMilliseconds = record.lapTime - fastestLapTime;
      const formattedGapToFirst = formatGapToFirst(gapToFirstMilliseconds);

      record.gapToFirst = gapToFirstMilliseconds;

      newRow.innerHTML = `
        <td class="position">
          <div class="player-position ${positionClass}" style="color: black;">${position}</div>
          <div class="color-box ${record.colorClass}"></div>
          <div class="player-name">
            <p class="name">${record.name}</p>
          </div>
        </td>
        <td class="time">
          <div class="player-time">
             <p class="time-text">${record.lapTimeString}</p>
          </div>
        </td>
        <td class="gap-to-first">
          <div class="">
             <p class="gap-to-first-text">${formattedGapToFirst}</p>
          </div>
        </td>
        <td class="car">${record.carName}</td>
      `;

      table.appendChild(newRow);
    });
  }

  if (inputPage) {
    const fastestLapTime = top20Records[0]?.lapTime || 0;

    sortedRecords.forEach((record, index) => {
      const newRow = document.createElement('tr');
      const position = index + 1;
      const isSingleDigit = position < 10;
      const isMoreThanTen = position > 10;
      const positionClass = isSingleDigit ? 'single-digit' : '';
      newRow.id = `raceDataRow-${index}`;

      if (isOdd(index)) {
        newRow.style.backgroundColor = '#D0D0D0';
      }

      const rowColorClass = record.colorClass;

      const gapToFirstMilliseconds = record.lapTime - fastestLapTime;
      const formattedGapToFirst = formatGapToFirst(gapToFirstMilliseconds);

      newRow.innerHTML = `
        <td class="position">
          <div class="player-position ${positionClass}" style="color: black;">${position}</div>
          <div class="color-box ${rowColorClass}"></div>
          <div class="player-name">
            <p class="name">${record.name}</p>
          </div>
        </td>
        <td class="time">
          <div class="player-time">
             <p class="time-text">${record.lapTimeString}</p>
          </div>
        </td>

        <td class="time">
          <div class="player-time">
             <p class="time-text">${formattedGapToFirst}</p>
          </div>
        </td>
        
        <td class="car">${record.carName}</td>
        <td class="delete">
          <button class="delete-button" data-key="${record.name}-${record.carName}">Delete</button>
        </td>
      `;

      table.appendChild(newRow);
    });

    // Add event listener for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', (event) => {
        const recordKey = button.getAttribute('data-key');
        if (records[recordKey]) {
          delete records[recordKey]; // Remove the record from memory
          saveToIndexedDB(Object.values(records)); // Update IndexedDB
          updateLeaderboard(); // Refresh the table
        }
      });
    });
  }
};

const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RaceLeaderboard', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Check if the object store exists
      if (!Array.from(db.objectStoreNames).includes('records')) {
        db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
        console.log("Object store 'records' created.");
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const saveToIndexedDB = (data) => {
  initIndexedDB().then((db) => {
    const transaction = db.transaction(['records'], 'readwrite');
    const store = transaction.objectStore('records');

    // Clear the store before saving the updated data
    store.clear();

    Object.values(data).forEach((record) => {
      store.add(record);
    });

    transaction.oncomplete = () => {
      console.log('Data saved to IndexedDB.');
    };

    transaction.onerror = (event) => {
      console.error('Error saving data:', event.target.error);
    };
  });
};

const loadFromIndexedDB = () => {
  return new Promise((resolve, reject) => {
    initIndexedDB().then((db) => {
      const transaction = db.transaction(['records'], 'readonly');
      const store = transaction.objectStore('records');
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  });
};

window.addEventListener('DOMContentLoaded', () => {
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

if (deleteButton) {
  document.getElementById('deleteData').addEventListener('click', () => {
    // Ask for confirmation before deleting
    const isConfirmed = confirm('Are you sure you want to clear all data?');
    if (!isConfirmed) {
      return; // Do nothing if the user cancels
    }

    const databaseName = 'RaceLeaderboard';
    const objectStoreName = 'records';

    const openRequest = indexedDB.open(databaseName);

    openRequest.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(objectStoreName, 'readwrite');
      const objectStore = transaction.objectStore(objectStoreName);

      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = () => {
        console.log(`All data in the object store '${objectStoreName}' has been cleared.`);
        alert(`All data in the object store '${objectStoreName}' has been cleared.`);
      };

      clearRequest.onerror = (errorEvent) => {
        console.error('Failed to clear the object store:', errorEvent.target.error);
        alert('Failed to clear the object store.');
      };
    };

    openRequest.onerror = (errorEvent) => {
      console.error('Failed to open the database:', errorEvent.target.error);
      alert('Failed to open the database.');
    };
  });
}

const getAll = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RaceLeaderboard', 1);

    request.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(['records'], 'readonly');
      const store = transaction.objectStore('records');

      const getRequest = store.getAll();

      getRequest.onsuccess = (event) => {
        resolve(event.target.result);
      };

      getRequest.onerror = (event) => {
        reject('Failed to fetch records from IndexedDB');
      };
    };

    request.onerror = (event) => {
      reject('Failed to open IndexedDB database');
    };
  });
};

const sendRaceDataToServer = async () => {
  const raceData = await getAll();

  try {
    const response = await fetch('/save-race-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(raceData)
    });

    if (response.ok) {
      console.log('Data successfully uploaded to the server');
    } else {
      console.error('Failed to upload data to the server');
    }
  } catch (error) {
    console.error('Error sending data to the server:', error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const saveDataButton = document.getElementById('saveData');
  const toggleButton = document.getElementById('toggleButton');
  const canvas = document.getElementById('qrCanvas');

  if (saveDataButton) {
    saveDataButton.addEventListener('click', () => {
      handleSaveData();
      // generateQRCode('http://88.223.95.166:3000/result', canvas);
      generateQRCode('http://localhost:3000/result', canvas);
    });
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      handleToggleView(canvas);
    });
  }
});

/**
 * Handles saving race data to the server
 */
function handleSaveData() {
  console.log('Data saved successfully!');

  sendRaceDataToServer();
}

/**
 * Toggles visibility between the container and the QR code
 * @param {HTMLCanvasElement} canvas - The canvas element for QR code
 */
function handleToggleView(canvas) {
  const container = document.querySelector('.container');
  const header = document.getElementById('header-container');

  if (!container || !canvas || !header) {
    console.error('Required elements not found.');
    return;
  }

  if (container.style.display === 'none') {
    // Show container and hide QR code and header
    container.style.display = 'block';
    canvas.style.display = 'none';
    header.style.display = 'none';
    toggleButton.textContent = 'Show QR Code';
  } else {
    // Hide container and show QR code and header
    container.style.display = 'none';
    canvas.style.display = 'block';
    header.style.display = 'block';
    generateQRCode('/table');
    toggleButton.textContent = 'n';
  }
}

/**
 * Generates a QR code for the specified URL on a canvas
 * @param {string} url - The URL for the QR code
 * @param {HTMLCanvasElement} canvas - The canvas element where the QR code will be rendered
 */
function generateQRCode(url, canvas) {
  if (!canvas) {
    console.error('Canvas element not found.');
    return;
  }

  QRCode.toCanvas(canvas, url, { errorCorrectionLevel: 'H', width: 500 }, (error) => {
    if (error) {
      console.error('Failed to generate QR code:', error);
    } else {
      console.log('QR code successfully generated for:', url);
    }
  });
}
