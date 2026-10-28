const latestByDevice = {};

function ensure(deviceId) {
  if (!latestByDevice[deviceId]) latestByDevice[deviceId] = { actuators: {} };
  return latestByDevice[deviceId];
}

function setLatest(deviceId, data) {
  Object.assign(ensure(deviceId), data, { ts: Date.now() });
}

function setStatus(deviceId, status) {
  ensure(deviceId).status = status;
}

function setActuator(deviceId, name, state) {
  ensure(deviceId).actuators[name] = state;
}

function getLatest(deviceId) {
  return latestByDevice[deviceId] || null;
}

function getAllLatest() {
  return latestByDevice;
}

module.exports = { setLatest, setStatus, setActuator, getLatest, getAllLatest };