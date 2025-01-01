const Row = (props) => {
  const { leaderboardData } = props;

  const handleGroupedData = (carType) => {
    const groupedData = leaderboardData.filter((record) => record.carType === carType).slice(0, 7);

    return groupedData;
  };

  const generateRandomColor = (excludeColor) => {
    let newColor;
    do {
      const hue = Math.floor(Math.random() * 360);
      newColor = `hsl(${hue}, 100%, 50%)`;
    } while (newColor === excludeColor);
    return newColor;
  };

  const renderGroupedRows = (carType, headerText) => {
    const groupedData = handleGroupedData(carType);
    let previousColor = null; // Track the last used color

    return (
      <>
        <tr className="border-red-400">
          <td colSpan="3" className="px-4 py-2 text-left text-red-700 font-extrabold">
            {headerText}
          </td>
        </tr>

        {groupedData.map((record, index) => {
          const { driverName, lapTime, carName, carLogo } = record;
          const position = index + 1;
          const positionMargin = position < 10 ? 'ml-3.5 text-2xl font-titillium' : '';

          // Generate a new color, ensuring it's not the same as the previous one
          const blockColor = generateRandomColor(previousColor);
          previousColor = blockColor; // Update the previous color

          return (
            <tr key={index} className="font-sugo uppercase font-medium ">
              <td className="flex gap-1.5 mt-2 w-[18rem]">
                <span className={positionMargin}>{position}</span>
                <span className="w-2.5" style={{ backgroundColor: blockColor }}></span>
                <span className="ml-2 text-3xl tracking-tight">{driverName}</span>
              </td>
              <td className="font-titillium font-semibold  text-center">{lapTime}</td>
              <td className="px-4 py-2 text-left text-[1.5rem] font-titillium font-semibold flex items-center justify-center gap-[2rem]">
                <span className="ml-4">
                  <img
                    src={carLogo}
                    alt="Descriptive Alt Text"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                </span>
                <span className="w-[10rem]">{carName}</span>
              </td>
            </tr>
          );
        })}
      </>
    );
  };

  return (
    <>
      {renderGroupedRows('FWD', 'FRONT WHEEL DRIVE')}
      {renderGroupedRows('RWD', 'REAR WHEEL DRIVE')}
      {renderGroupedRows('AWD', 'ALL WHEEL DRIVE')}
    </>
  );
};

export default Row;
