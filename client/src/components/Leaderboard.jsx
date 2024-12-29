import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext'; // WebSocket context

const Leaderboard = () => {
  const { socket } = useWebSocket();
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);

        setLeaderboardData((prevData) => {
          const updatedData = [...prevData, data];

          updatedData.sort((a, b) => parseFloat(a.lapTime) - parseFloat(b.lapTime));

          return updatedData;
        });
      };

      return () => {
        socket.onmessage = null;
      };
    }
  }, [socket]);

  return (
    <div className="flex justify-center items-center py-10">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
        <div className="flex justify-center pt-8">
          <img id="sa-logo" src="/assets/SA-logo-baru.png" alt="SpeedAttack Logo" className="w-16 h-16 rounded-full" />
        </div>
        <h2 className="text-center text-red-600 text-4xl font-bold mt-4 mb-8">BEST TIME</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-red-600 text-white">
              <th className="px-4 py-2 text-center rounded-tl-lg">POSITION</th>
              <th className="px-4 py-2 text-center">TIME</th>
              <th className="px-4 py-2 text-center rounded-tr-lg">CAR NAME</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((record, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 text-center">{index + 1}</td>
                <td className="px-4 py-2 text-center">{record.lapTime}</td>
                <td className="px-4 py-2 text-center">{record.carName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
