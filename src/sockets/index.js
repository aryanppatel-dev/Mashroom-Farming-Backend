const { Server } = require('socket.io');
const env = require('../config/env');
const { ACTUATORS } = require('../config/constants');
const { getAllLatest } = require('../state/latest');
const { publish } = require('../mqtt/client');

const DEVICE_ID_RE = /^[a-z0-9_-]{1,32}$/;

let io;

function initSockets(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: env.server.corsOrigin },
  });

  io.on('connection', (socket) => {
    console.log('Frontend connected:', socket.id);
    socket.emit('initial-state', getAllLatest());

    socket.on('actuator-command', (cmd, ack) => {
      const reply = (r) => typeof ack === 'function' && ack(r);

      const { deviceId, actuator, state } = cmd || {};
      if (
        typeof deviceId !== 'string' ||
        !DEVICE_ID_RE.test(deviceId) ||
        !ACTUATORS.includes(actuator) ||
        (state !== 'ON' && state !== 'OFF')
      ) {
        return reply({ ok: false, error: 'invalid' });
      }

      publish(`farm/${deviceId}/${actuator}/set`, state);
      console.log(`Command: ${deviceId}/${actuator} -> ${state}`);
      reply({ ok: true });
    });
  });

  return io;
}

function emitSensorUpdate(deviceId, data) {
  if (io) io.emit('sensor-update', { deviceId, ...data });
}

function emitDeviceStatus(deviceId, status) {
  if (io) io.emit('device-status', { deviceId, status });
}

function emitActuatorState(deviceId, actuator, state) {
  if (io) io.emit('actuator-state', { deviceId, actuator, state });
}

module.exports = { initSockets, emitSensorUpdate, emitDeviceStatus, emitActuatorState };