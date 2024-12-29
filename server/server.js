const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = 3000;

// Create the HTTP server
const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Set up the WebSocket server
const wss = new WebSocket.Server({ server });

// Store connected clients
let clients = [];

// Broadcast function to send data to all connected clients
function broadcast(data) {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// WebSocket connection handler
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
