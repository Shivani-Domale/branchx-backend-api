const moment = require('moment');

const formatToTimeString = (timeStr) => {
  // Input like "1am", "10:30pm", "02:45 AM"
  const parsed = moment(timeStr.trim(), ["hA", "h:mmA", "hh:mm A"], true);

  if (!parsed.isValid()) {
    throw new Error(`Invalid time format: ${timeStr}. Expected formats like '1am', '10:30pm'`);
  }

  return parsed.format("HH:mm:ss"); // e.g., "01:00:00"
};

module.exports = formatToTimeString;