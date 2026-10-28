const mqtt = require('mqtt');
const env = require('../config/env');
const { ACTUATORS } = require('../config/constants');
const { setLatest, setStatus, setActuator } = require('../state/latest');

let client;
let onDhtDataCallback = null;
let onStatusCallback = null;
let onActuatorStateCallback = null;

function connectMqtt() {
  const url = `mqtts://${env.mqtt.host}:${env.mqtt.port}`;

  client = mqtt.connect(url, {
    username: env.mqtt.user,
    password: env.mqtt.pass,
    clientId: 'backend-' + Math.random().toString(16).slice(2, 8),
    rejectUnauthorized: false,
  });

  client.on('connect', () => {
    console.log('MQTT connected as backend');
    client.subscribe('farm/+/dht');
    client.subscribe('farm/+/status');
    client.subscribe('farm/+/+/state');   // fan/state, sprinkler/state
  });

  client.on('reconnect', () => console.log('MQTT reconnecting...'));
  client.on('error', (err) => console.error('MQTT error:', err.message));

  client.on('message', (topic, payload) => {
    const parts = topic.split('/');   // farm/esp1/dht, farm/esp1/fan/state
    const deviceId = parts[1];
    const text = payload.toString();

    if (parts.length === 3 && parts[2] === 'dht') {
      try {
        const data = JSON.parse(text);
        setLatest(deviceId, { temp: data.t, hum: data.h });
        if (onDhtDataCallback) onDhtDataCallback(deviceId, data);
      } catch (e) {
        console.error('Bad DHT payload:', text);
      }
    } else if (parts.length === 3 && parts[2] === 'status') {
      console.log(`Device ${deviceId} is ${text}`);
      setStatus(deviceId, text);
      if (onStatusCallback) onStatusCallback(deviceId, text);
    } else if (parts.length === 4 && parts[3] === 'state') {
      const actuator = parts[2];
      if (!ACTUATORS.includes(actuator)) return;   // purane 'led/state' jaise topics ignore
      if (text !== 'ON' && text !== 'OFF') return;
      setActuator(deviceId, actuator, text);
      if (onActuatorStateCallback) onActuatorStateCallback(deviceId, actuator, text);
    }
  });
}

function onDhtData(cb) { onDhtDataCallback = cb; }
function onStatus(cb) { onStatusCallback = cb; }
function onActuatorState(cb) { onActuatorStateCallback = cb; }

// retain default false rehta hai. Command kabhi retained nahi honi chahiye.
function publish(topic, message, options = {}) {
  client.publish(topic, message, options);
}

module.exports = { connectMqtt, onDhtData, onStatus, onActuatorState, publish };