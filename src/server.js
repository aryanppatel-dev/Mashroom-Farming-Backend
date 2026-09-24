const env = require('./config/env');
const { connectMqtt, onDhtData } = require('./mqtt/client');
const { getAllLatest } = require('./state/latest');

connectMqtt();

onDhtData((deviceId, data) => {
  console.log(`[${deviceId}] Temp: ${data.t}°C  Humidity: ${data.h}%`);
});

console.log('Server running, MQTT client starting...');