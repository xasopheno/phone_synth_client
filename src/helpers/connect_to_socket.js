import io from 'socket.io-client';


export default function connect_to_socket() {
  let address = window.location.host === 'localhost:3000' ?
    'localhost:9876' : 'phone-synth-server.herokuapp.com';

  let socket = io(`${address}`, {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax : 5000,
    reconnectionAttempts: Infinity,
  });

  return socket;
};
