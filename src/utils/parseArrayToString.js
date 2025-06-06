const parseArrayToString = (input)=> {
  if (!input) return [];
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) return parsed;
  } catch (_) {
   
  }
  return input.split(',').map(item => item.trim());
};

module.exports = parseArrayToString;