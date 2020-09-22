const arrayToObject = function (arr = [], mappingTable = {}) {
  if (arr.length < 2) {
    return null
  }
  if (!mappingTable[arr[0]]) {
    return null
  }
  return {
    [mappingTable[arr[0]]]: arr[1]
  }
}

module.exports = {
  arrayToObject
}
