const socket = new WebSocket('ws://localhost:3000');
const records = {};

// Subscribe to WebSocket updates for a specific drivetrain
function subscribeToDrivetrainUpdates(drivetrain, updateCallback) {
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.drivetrain === drivetrain) {
      Object.assign(records, message.data);
      updateCallback(records);
    }
  };
}

// Export functionality
export { subscribeToDrivetrainUpdates, records };
