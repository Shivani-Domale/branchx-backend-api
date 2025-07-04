const formatToTimeString = (timeStr) => {
  if (!/^\d{2}:\d{2}:\d{2}$/.test(timeStr)) {
    throw new Error("Invalid time format. Expected HH:mm:ss");
  }
  return timeStr;
};

module.exports = formatToTimeString;