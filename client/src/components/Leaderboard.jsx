import { useEffect, useState } from 'react';
import { useWebSocket } from '../context/WebSocketContext'; // WebSocket context
import logo from '../assets/SA-logo-baru.png';

const Leaderboard = () => {
  const { socket } = useWebSocket();
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        console.log(message, '---debug message');

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
    <div className="flex justify-center items-center py-10 font-titillium">
      <div className="w-full max-w-4xl bg-white rounded-lg">
        <div className="flex justify-center pt-8">
          <img id="sa-logo" src={logo} alt="SpeedAttack Logo" className="" />
        </div>
        <h2 className="text-center text-[#ff0000] text-5xl font-bold mt-4 mb-8">BEST TIME</h2>
        <table className="min-w-full table-auto text-xl">
          <thead className="text-2xl">
            <tr className="bg-[#ff0000] text-white">
              <th className="px-4  py-2 text-center rounded-tl-md rounded-bl-md">POSITION</th>
              <th className="px-4  py-2 text-center">TIME</th>
              <th className="px-4  py-2 text-center rounded-tr-md rounded-br-md">CAR NAME</th>
            </tr>
          </thead>
          <tbody className="text-2xl">
            {leaderboardData.map((record, index) => {
              const position = index + 1;
              const driverName = record.driverName;
              const lapTime = record.lapTime;
              const carName = record.carName;

              return (
                <tr key={index} className="">
                  <div className="flex gap-1.5 mt-2">
                    <span className="">{position}</span>
                    <span className="w-2.5 bg-purple-500"></span>
                    <span className="ml-2">{driverName}</span>
                  </div>
                  <td className="px-4 py-2 text-center">{lapTime}</td>
                  <td className="px-4 py-2 text-center">{carName}</td>
                </tr>
              );
            })}

            {/* <tr className="bg-gray-400">
              <div className="flex gap-1.5 mt-2">
                <td className="">2</td>
                <span className="w-2.5 bg-purple-500"></span>
                <span className="ml-2">yatno</span>
              </div>
              <td className="px-4 py-2 text-center">adf\</td>
              <td className="px-4 py-2 text-center">adfadf</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
