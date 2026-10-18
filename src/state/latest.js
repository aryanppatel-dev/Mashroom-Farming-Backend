const latestByDevice = {};

function setLatest(deviceId, data) {
  latestByDevice[deviceId] = {
    ...latestByDevice[deviceId],
    ...data,
    ts: Date.now(),
  };
}

function setStatus(deviceId, status) {
  latestByDevice[deviceId] = {
    ...latestByDevice[deviceId],
    status,
  };
}

function getLatest(deviceId) {
  return latestByDevice[deviceId] || null;
}

function getAllLatest() {
  return latestByDevice;
}

module.exports = { setLatest, setStatus, getLatest, getAllLatest };