const io = require('socket.io')();
const mqtt = require('mqtt');

const FLESPI_TOKEN = 'N2ngz7UexLxJh4e9OsRiapV9CGfmHIUkA5pX29ZpIlXPd1MQjuYhHJfagikLQ4Ue';

const INCOMING = [
  'usersReceived',
  'userCreated',
  'userUpdated',
  'rolesReceived',
  'roleCreated',
  'roleUpdated',
];
const OUTGOING = ['getUsers', 'createUser', 'updateUser', 'getRoles', 'createRole', 'updateRole'];

const mqttClient = mqtt.connect(
  'wss://mqtt.flespi.io:443',
  { username: FLESPI_TOKEN },
);

const subscribeCallback = (error) => {
  if (error) {
    console.error(error); // eslint-disable-line
  }
};

mqttClient.on('connect', () => {
  INCOMING.forEach(topic => mqttClient.subscribe(topic, subscribeCallback));
});

mqttClient.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  io.emit(topic, data);
});

const onCallback = (message, data) => mqttClient.publish(message, JSON.stringify(data));

io.on('connection', (client) => {
  OUTGOING.forEach(topic => client.on(topic, onCallback.bind(null, topic)));
});

const PORT = 8000;
io.listen(PORT);
console.log(`users-roles app listening on port ${PORT}`); // eslint-disable-line
