require('dotenv').config();

const WebSocket = require('ws');
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// const pool = new Pool({
//   user: process.env.PG_USER_DEV,
//   host: process.env.PG_HOST_DEV,
//   database: process.env.PG_DATABASE,
//   password: process.env.PG_PASSWORD_DEV,
//   port: process.env.PG_PASSWORD_HOST
// });

//its working
const pool = new Pool({
  user: process.env.PG_USER_PROD,
  host: process.env.PG_HOST_PROD,
  database: process.env.PG_DATABASE_PROD,
  password: process.env.PG_PASSWORD_PROD,
  port: process.env.PG_PORT_PROD
});

const createLeaderboardTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS leaderboard (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      car_name VARCHAR(255) NOT NULL,
      drive_train VARCHAR(50) NOT NULL,
      lap_time VARCHAR(50) NOT NULL,
      gap_time VARCHAR(50) NOT NULL,
      color_class VARCHAR(50) NOT NULL
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/input', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/input.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/leaderboard.html'));
});

app.post('/save-race-data', async (req, res) => {
  const records = req.body;
  console.log(records, '--deb rec');

  try {
    const client = await pool.connect();

    // Insert records into PostgreSQL
    for (let record of records) {
      const { name, carName, driveTrain, lapTime, colorClass, gapTime } = record;

      // Use parameterized queries to avoid SQL injection
      await client.query(
        'INSERT INTO leaderboard (name, car_name, drive_train, lap_time, gap_time, color_class) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, carName, driveTrain, lapTime, colorClass, gapTime]
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
