import socketIO from 'socket.io-client';
const socketURL = 'http://localhost:8000/';
var socket = socketIO(socketURL)
export { socket }