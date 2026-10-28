require('dotenv').config();

module.exports = {
  mqtt: {
    host: process.env.MQTT_HOST,
    port: Number(process.env.MQTT_PORT),
    user: process.env.MQTT_USER,
    pass: process.env.MQTT_PASS,
  },
  server: {
    port: Number(process.env.PORT) || 4000,
    corsOrigin: (process.env.CORS_ORIGIN || 'http://localhost:5173')
      .split(',')
      .map((s) => s.trim()),
  },
};