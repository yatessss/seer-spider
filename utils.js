const arrayToObject = function (arr = [], mappingTable = {}) {
  if (arr.length < 2) {
    return {}
  }
  return {
    [mappingTable[arr[0]] ? mappingTable[arr[0]] : arr[0]]: arr[1]
  }
}

module.exports = {
  arrayToObject
}
