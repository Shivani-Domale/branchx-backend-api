const formatToTimeString = (isoString) => {
  return new Date(isoString).toISOString().substring(11, 19); 
};

module.exports = formatToTimeString;