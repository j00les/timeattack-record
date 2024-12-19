const express = require('express');
const path = require('path');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// Serve static files

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/leaderboard-with-input.html'));
});

app.get('/leaderboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/leaderboard.html'));
});

// Start the HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// WebSocket server
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
