import { useState, useEffect } from 'react';

import { useWebSocket } from '../context/WebSocketContext';
import Dropdown from '../components/Dropdown';
import Table from '../components/Table';
// import { leaderboardData } from '../constants';

const Input = () => {
  const [carName, setCarName] = useState('');
  const [driverName, setDriverName] = useState('');
  const [lapTime, setLapTime] = useState('');
  const [carType, setCarType] = useState('');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [raceRun, setRaceRun] = useState('');
  const [heatNumber, setHeatNumber] = useState();

  const { socket } = useWebSocket();

  const CAR_OPTIONS = ['FWD', 'AWD', 'RWD'];

  const handleCarNameChange = (event) => {
    setCarName(event.target.value);
  };

  const handleLapTimeChange = (event) => {
    setLapTime(event.target.value);
  };

  const handleDriverNameChange = (event) => {
    setDriverName(event.target.value);
  };

  const handleCarTypeChange = (event) => {
    setCarType(event.target.value);
  };

  const handleRaceRunChange = (event) => {
    setRaceRun(event.target.value);
  };

  const handleHeatNumber = (event) => {
    setHeatNumber(event.target.value);
  };

  const saveToLocalStorage = (raceRunId, heatNumber, driverName, lapTime, carName, carType) => {
    const raceData = JSON.parse(localStorage.getItem('raceData')) || {};

    if (!raceData[raceRunId]) {
      raceData[raceRunId] = {};
    }

    if (!raceData[raceRunId][heatNumber]) {
      raceData[raceRunId][heatNumber] = [];
    }

    raceData[raceRunId][heatNumber].push({
      driverName,
      lapTime,
      carName,
      carType
    });

    localStorage.setItem('raceData', JSON.stringify(raceData));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (socket && socket.readyState === WebSocket.OPEN) {
      const data = {
        carName,
        lapTime,
        driverName,
        carType
      };

      socket.send(JSON.stringify(data));
      setCarName('');
      setLapTime('');
      setDriverName('');
      setCarType('');

      setRaceRun('');
      setHeatNumber('');
    } else {
      console.error('WebSocket is not connected');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setLeaderboardData((prevData) => {
          return [...prevData, data];
        });
      };
    }

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
          <input
            type="text"
            id="carName"
            value={carName}
            onChange={handleCarNameChange}
            placeholder="Enter car name"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            id="lapTime"
            value={lapTime}
            onChange={handleLapTimeChange}
            placeholder="Enter lap time (MMDDddd)"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            id="driverName"
            value={driverName}
            onChange={handleDriverNameChange}
            placeholder="Enter Driver Name"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Dropdown
            options={CAR_OPTIONS}
            value={carType}
            onChange={handleCarTypeChange}
            id="1"
            placeholder="Select Car Type"
          />
          <input
            type="text"
            id="raceRun"
            value={raceRun}
            onChange={handleRaceRunChange}
            placeholder="Enter Race Run"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            id="heat"
            value={heatNumber}
            onChange={handleHeatNumber}
            placeholder="Enter Heat Number"
            required
            className="p-3 text-lg border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="p-3 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit
          </button>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              id="deleteData"
              onClick={() => console.log('Delete Data')}
              className="w-48 p-3 bg-red-600 text-white rounded cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
            <button
              type="button"
              id="exportData"
              onClick={() => console.log('Export Data')}
              className="w-48 p-3 bg-gray-700 text-white rounded cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Export
            </button>
          </div>
        </form>
      </div>

      <Table isInputTable leaderboardData={leaderboardData} />
    </div>
  );
};

export default Input;
