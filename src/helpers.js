export const randomArrayValue = (array, random = Math.random) => {
  return array[Math.floor(random() * array.length)];
}

export const capitalize = word => {
  return word.substr(0, 1).toUpperCase() + word.substr(1);
}
