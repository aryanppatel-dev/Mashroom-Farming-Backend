require('dotenv').config();

module.exports = {
  mqtt: {
    host: process.env.MQTT_HOST,
    port: Number(process.env.MQTT_PORT),
    user: process.env.MQTT_USER,
    pass: process.env.MQTT_PASS,
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  server: {
    port: Number(process.env.PORT) || 4000,
  },
};