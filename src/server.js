const http = require('http');
const env = require('./config/env');
const { connectMqtt, onDhtData, onStatus } = require('./mqtt/client');
const { getAllLatest } = require('./state/latest');
const { initSockets, emitSensorUpdate, emitDeviceStatus } = require('./sockets');

const server = http.createServer();
initSockets(server);

connectMqtt();

onDhtData((deviceId, data) => {
  console.log(`[${deviceId}] Temp: ${data.t}°C  Humidity: ${data.h}%`);
  emitSensorUpdate(deviceId, { temp: data.t, hum: data.h });
});

onStatus((deviceId, status) => {
  emitDeviceStatus(deviceId, status);
});

server.listen(env.server.port, () => {
  console.log(`Server listening on port ${env.server.port}`);
});