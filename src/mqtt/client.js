const mqtt = require('mqtt');
const env = require('../config/env');
const { setLatest } = require('../state/latest');

let client;
let onDhtDataCallback = null;   // server.js isko set karega (DB save + socket emit ke liye)

function connectMqtt() {
  const url = `mqtts://${env.mqtt.host}:${env.mqtt.port}`;

  client = mqtt.connect(url, {
    username: env.mqtt.user,
    password: env.mqtt.pass,
    clientId: 'backend-' + Math.random().toString(16).slice(2, 8),
    rejectUnauthorized: false,   // testing ke liye; production me true karna hai
  });

  client.on('connect', () => {
    console.log('MQTT connected as backend');
    client.subscribe('farm/+/dht');
    client.subscribe('farm/+/status');
  });

  client.on('reconnect', () => {
    console.log('MQTT reconnecting...');
  });

  client.on('error', (err) => {
    console.error('MQTT error:', err.message);
  });

  client.on('message', (topic, payload) => {
    const parts = topic.split('/');   // farm/esp1/dht -> ["farm","esp1","dht"]
    const deviceId = parts[1];
    const kind = parts[2];

    if (kind === 'dht') {
      try {
        const data = JSON.parse(payload.toString());
        setLatest(deviceId, { temp: data.t, hum: data.h });
        if (onDhtDataCallback) onDhtDataCallback(deviceId, data);
      } catch (e) {
        console.error('Bad DHT payload:', payload.toString());
      }
    }

    if (kind === 'status') {
      console.log(`Device ${deviceId} is ${payload.toString()}`);
    }
  });
}

function onDhtData(callback) {
  onDhtDataCallback = callback;
}

function publish(topic, message, options = {}) {
  client.publish(topic, message, options);
}

module.exports = { connectMqtt, onDhtData, publish };