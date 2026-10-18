const { Server } = require('socket.io');
const { getAllLatest } = require('../state/latest');

let io;

function initSockets(httpServer) {
  io = new Server(httpServer, {
    cors: { origin: '*' },   // abhi testing ke liye sab allow, baad me apna app URL daalenge
  });

  io.on('connection', (socket) => {
    console.log('Frontend connected:', socket.id);
    socket.emit('initial-state', getAllLatest());   // naye connect hote hi current data bhej do
  });

  return io;
}

function emitSensorUpdate(deviceId, data) {
  if (io) io.emit('sensor-update', { deviceId, ...data });
}

function emitDeviceStatus(deviceId, status) {
  if (io) io.emit('device-status', { deviceId, status });
}

module.exports = { initSockets, emitSensorUpdate, emitDeviceStatus };