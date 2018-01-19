from socketIO_client import SocketIO, LoggingNamespace
import time

with SocketIO('127.0.0.1', 8000, LoggingNamespace) as socketIO:
    while True:
        socketIO.emit('echo', 'echooo')
        time.sleep(.2)
