const Row = (props) => {
  const { leaderboardData } = props;

  const getColorForCarType = (carType) => {
    let blockColor = 'bg-gray-500';

    if (carType === 'FWD') {
      blockColor = 'rounded-[3px] bg-blue-600';
    }

    if (carType === 'RWD') {
      blockColor = 'rounded-[3px] bg-[#87CEEB]';
    }

    if (carType === 'AWD') {
      blockColor = 'rounded-[3px] bg-[#FF4500]';
    }

    return blockColor;
  };

  const parseLapTime = (rawTime) => {
    const rawTimeString = String(rawTime).padStart(7, '0');
    const minutes = parseInt(rawTimeString.slice(0, 2), 10);
    const seconds = parseInt(rawTimeString.slice(2, 4), 10);
    const milliseconds = parseInt(rawTimeString.slice(4, 7), 10);

    return minutes * 60000 + seconds * 1000 + milliseconds;
  };

  const formatLapTime = (totalMilliseconds) => {
    const minutes = Math.floor(totalMilliseconds / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = totalMilliseconds % 1000;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(
      milliseconds
    ).padStart(3, '0')}`;
  };

  const formatGapTime = (gapMilliseconds) => {
    const seconds = Math.floor(gapMilliseconds / 1000);
    const milliseconds = gapMilliseconds % 1000;

    return `${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  };

  const sortedDataByLapTime = leaderboardData
    .map((record) => ({
      ...record,
      lapTimeMilliseconds: parseLapTime(record.lapTime)
    }))
    .sort((a, b) => a.lapTimeMilliseconds - b.lapTimeMilliseconds)
    .slice(0, 21);

  const firstLapTimeMilliseconds = sortedDataByLapTime[0]?.lapTimeMilliseconds || 0;

  return (
    <>
      {sortedDataByLapTime.map((record, index) => {
        const { driverName, lapTime, carName, carType } = record;
        const position = index + 1;
        const positionMargin = position < 10 && 'ml-[.8rem]';
        const styling = position % 2 === 0 && 'bg-[#D4D4D4]';
        const blockColor = getColorForCarType(carType);
        const gapToFirst = index === 0 ? '-' : formatGapTime(lapTime - firstLapTimeMilliseconds);

        return (
          <tr key={index} className={`font-sugo uppercase font-medium ${styling}`}>
            <td className="flex gap-1.5 mt-2  w-[13rem]">
              <span className={`text-[1.4rem] font-titillium font-medium ${positionMargin}`}>
                {position}
              </span>
              <span className={`w-[.5rem] ${blockColor}`}></span>
              <span className={`text-[1.7rem]  tracking-tight`}>{driverName}</span>
            </td>
            <td className="font-titillium text-[1.4rem] font-semibold text-center">
              {formatLapTime(lapTime)}
            </td>
            <td className="text-[1.4rem] text-center pr-[.5rem] font-titillium font-semibold">
              {gapToFirst}
            </td>
            <td className="text-[1.4rem] text-left pl-[.9rem] font-titillium font-semibold">
              {carName}
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default Row;
