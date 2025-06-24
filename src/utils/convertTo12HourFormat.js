const convertTo12HourFormat = (timeString) => {
  if (!timeString) return null;

  const date = new Date(`1970-01-01T${timeString}`);
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata'
  };

  return date.toLocaleTimeString('en-IN', options);
};
  module.exports = convertTo12HourFormat;