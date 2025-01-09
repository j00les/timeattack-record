const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;
const cors = require('cors');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ server });

let clients = [];

function broadcast(data) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

wss.on('connection', (ws) => {
  console.log('New client connected');
  clients.push(ws);

  // Handle messages received from the client
  ws.on('message', (message) => {
    console.log('Received data:', message);
    const data = JSON.parse(message);

    // Broadcast the car name and lap time to other connected clients
    broadcast(data);
  });

  // Handle WebSocket closure
  ws.on('close', () => {
    clients = clients.filter((client) => client !== ws);
  });
});
