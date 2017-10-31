const randomArrayValue = (array, random = Math.random) => {
  return array[Math.floor(random() * array.length)];
}

module.exports = {
  randomArrayValue,
};