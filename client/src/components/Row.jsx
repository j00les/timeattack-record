const Row = (props) => {
  const { leaderboardData } = props;

  const getColorForCarType = (carType) => {
    if (carType === 'FWD') return 'orange';
    if (carType === 'RWD') return 'blue';
    if (carType === 'AWD') return 'red';
    return 'gray'; // Default color for unknown types
  };

  const sortedDataByLapTime = leaderboardData
    .slice() // Create a copy of the array to avoid mutating props
    .sort((a, b) => a.lapTime - b.lapTime) // Sort by fastest lap time (ascending)
    .slice(0, 21); // Limit to top 21 entries

  return (
    <>
      {sortedDataByLapTime.map((record, index) => {
        const { driverName, lapTime, carName, carType, gapToFirst } = record;
        const position = index + 1;
        const positionMargin = position < 10 ? 'ml-[.8rem]' : '';
        const blockColor = getColorForCarType(carType);

        return (
          <tr key={index} className={`font-sugo uppercase font-medium`}>
            <td className="flex gap-1.5 mt-2  w-[11rem]">
              <span className={`text-2xl font-titillium ${positionMargin}`}>{position}</span>
              <span className="w-2.5" style={{ backgroundColor: blockColor }}></span>
              <span className={`ml-2 text-3xl tracking-tight`}>{driverName}</span>
            </td>
            <td className="font-titillium font-semibold text-center pr-[2rem]">{lapTime}</td>
            <td className="text-[1.5rem] font-titillium font-semibold">{gapToFirst}</td>
            <td className="text-[1.5rem] text-left pl-[.6rem] font-titillium font-semibold">
              {carName}
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default Row;
