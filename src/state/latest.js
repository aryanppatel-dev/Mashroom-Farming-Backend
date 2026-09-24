const latestByDevice = {};

function setLatest(deviceId, data) {
  latestByDevice[deviceId] = { ...data, ts: Date.now() };
}

function getLatest(deviceId) {
  return latestByDevice[deviceId] || null;
}

function getAllLatest() {
  return latestByDevice;
}

module.exports = { setLatest, getLatest, getAllLatest };