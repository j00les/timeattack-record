require('dotenv').config();

const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const path = require('path');

const pool = require('./db');

const app = express();
const PORT = 3000;

const createLeaderboardTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      car_name VARCHAR(255) NOT NULL,
      drive_train VARCHAR(50) NOT NULL,
      lap_time VARCHAR(50) NOT NULL,
      gap_time VARCHAR(50) NOT NULL,
      color_class VARCHAR(50) NOT NULL,
      lap_time_string VARCHAR(50) NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_lap_time ON leaderboard (lap_time);
  `;

  try {
    const client = await pool.connect();
    await client.query(query);
    client.release();
    console.log("Leaderboard table created (if it didn't exist already)");
  } catch (err) {
    console.error('Error creating table:', err);
  }
};

createLeaderboardTable();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/helper', express.static(path.join(__dirname, 'helper')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/input', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/input.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/leaderboard.html'));
});

app.get('/result', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/result.html'));
});

app.get('/api/result-data', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        name, 
        car_name as carName, 
        drive_train as driveTrain, 
        lap_time as lapTime, 
        gap_time as gapTime, 
        color_class as colorClass,
        lap_time_string as lapTimeString
      FROM leaderboard
      ORDER BY lap_time ASC;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard data:', error);

    res.status(500).json({ error: 'Failed to fetch leaderboard data' });
  }
});

app.post('/save-race-data', async (req, res) => {
  const records = req.body;

  try {
    const client = await pool.connect();

    for (let record of records) {
      const {
        name,
        carName,
        driveTrain,
        lapTime,
        colorClass,
        gapToFirst: gapTime,
        lapTimeString
      } = record;

      await client.query(
        'INSERT INTO leaderboard (name, car_name, drive_train, lap_time, gap_time, color_class, lap_time_string) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [name, carName, driveTrain, lapTime, gapTime, colorClass, lapTimeString]
      );
    }

    client.release(); // Release the client back to the pool

    res.status(200).send('Data successfully uploaded to PostgreSQL');
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).send('Error uploading data to PostgreSQL');
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

let clients = [];

// Broadcast updates to all connected clients
function broadcast(data) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', (ws) => {
  clients.push(ws);

  ws.on('message', (message) => {
    console.log('Received:', message);
    broadcast(JSON.parse(message));
  });

  ws.on('close', () => {
    clients = clients.filter((client) => client !== ws);
  });
});
