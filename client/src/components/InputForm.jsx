import { useState, useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

const InputForm = () => {
  const [carName, setCarName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [lapTime, setLapTime] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);

  const { socket } = useWebSocket();

  const handleCarNameChange = (event) => {
    setCarName(event.target.value);
  };

  const handleLapTimeChange = (event) => {
    setLapTime(event.target.value);
  };

  const handleDriverNameChange = (event) => {
    setDriverName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        carName,
        lapTime,
        driverName
      };

      socket.send(JSON.stringify(data));
      setCarName('');
      setLapTime('');
      setDriverName('');
    } else {
      console.error('WebSocket is not connected');
    }
  };

  useEffect(() => {
    // Listen for incoming WebSocket messages
    if (socket) {
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        // Update the leaderboard with new lap data
        setLeaderboardData((prevData) => {
          // Add new data, ensuring unique entries
          return [...prevData, data];
        });
      };
    }

    // Cleanup WebSocket listener on component unmount
    return () => {
      if (socket) {
        socket.onmessage = null;
      }
    };
  }, [socket]);

  return (
    <div className="flex justify-evenly items-start gap-8 max-w-screen-xl mx-auto pt-24">
      <div className="flex-1 max-w-md">
        <form id="lapForm" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input type="text" id="carName" value={carName} onChange={handleCarNameChange} placeholder="Enter car name" required className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" id="lapTime" value={lapTime} onChange={handleLapTimeChange} placeholder="Enter lap time (MMDDddd)" required className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" id="driverName" value={driverName} onChange={handleDriverNameChange} placeholder="Enter Driver Name" required className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="p-3 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Submit
          </button>

          {/* Export and Delete buttons */}
          <div className="flex justify-between mt-4">
            <button type="button" id="deleteData" onClick={() => console.log('Delete Data')} className="w-48 p-3 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
              Delete
            </button>
            <button type="button" id="exportData" onClick={() => console.log('Export Data')} className="w-48 p-3 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Export
            </button>
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="flex-1 max-w-lg overflow-y-auto h-[500px]">
        <table className="w-full table-auto mt-4">
          <thead>
            <tr>
              <th className="text-center bg-red-600 text-white px-4 py-2 rounded-tl-lg">Position</th>
              <th className="text-center bg-red-600 text-white px-4 py-2">Time</th>
              <th className="text-center bg-red-600 text-white px-4 py-2">Car Name</th>
              <th className="text-center bg-red-600 text-white px-4 py-2 rounded-tr-lg"></th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((record, index) => (
              <tr key={index} className="border-t">
                <td className="text-center px-4 py-2">{index + 1}</td>
                <td className="text-center px-4 py-2">{record.lapTime}</td>
                <td className="text-center px-4 py-2">{record.carName}</td>
                <td className="text-center px-4 py-2">
                  <button className="text-red-600 hover:text-red-700 focus:outline-none">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InputForm;
