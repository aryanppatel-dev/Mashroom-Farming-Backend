const http = require('http');
const env = require('./config/env');
const { connectMqtt, onDhtData, onStatus, onActuatorState } = require('./mqtt/client');
const {
  initSockets,
  emitSensorUpdate,
  emitDeviceStatus,
  emitActuatorState,
} = require('./sockets');

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('ok');
    return;
  }
  res.writeHead(404);
  res.end();
});

initSockets(server);
connectMqtt();

onDhtData((deviceId, data) => {
  // console.log(`[${deviceId}] Temp: ${data.t}°C  Humidity: ${data.h}%`);
  emitSensorUpdate(deviceId, { temp: data.t, hum: data.h });
});

onStatus((deviceId, status) => emitDeviceStatus(deviceId, status));

onActuatorState((deviceId, actuator, state) => {
  console.log(`[${deviceId}] ${actuator} is ${state}`);
  emitActuatorState(deviceId, actuator, state);
});

server.listen(env.server.port, () => {
  console.log(`Server listening on port ${env.server.port}`);
});