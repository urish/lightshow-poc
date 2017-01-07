const 
	express = require('express'),
	io = require('socket.io'),
	SerialPort = require('serialport');

const app = express();
const server = app.listen(8080);
const socketServer = io(server);

const portName = process.argv[2];
const serial = new SerialPort(portName, {baudRate: 115200});

let serialAvailable = true;

function handleClient(socket){
	console.log('New client: ' + socket.handshake.address);

	socket.on('message', function(data) {
		if (serialAvailable)  {
			serial.write(data, () => serialAvailable = true);
			serialAvailable = false;
		}
	});
}

app.use(express.static('web'));
socketServer.on('connection', handleClient);
