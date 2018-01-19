import socketio
import eventlet
from flask import Flask
import random

sio = socketio.Server(logger=True, async_mode=None)
app = Flask(__name__)

class Counter:
    def __init__(self):
        self.count = 0

    def inc(self):
        self.count += 1


@sio.on('connect')
def connect(sid, environ):
    print('client_connect', sid)
    sio.emit('connected_to_server', {'message': 'Connected', 'count': counter.count})
    counter.count += 1
    print(counter.count)


@sio.on('freq_change')
def freq_change(sid, data):
    freq1 = data['freq']
    freq2 = data['freq'] * 3/2
    vol = data['vol']

    output = {
        'freq1': freq1,
        'freq2': freq2,
        'vol': vol,
    }
    sio.emit('freq', output)

@sio.on('song_change')
def freq_change(sid, data):
    freq1 = data['freq1']
    freq2 = data['freq2']
    vol = data['vol']

    output = {
        'freq1': freq1,
        'freq2': freq2,
        'vol': vol,
    }
    sio.emit('freq', output)

@sio.on('echo')
def message(sid, data):
    rand = random.randint(100, 300)
    payload = {
        'freq1': rand,
        'freq2': rand,
        'vol': 100,
               }
    sio.emit('freq', payload)
    print('freq', rand)


@sio.on('disconnect')
def disconnect(sid):
    print('disconnect ', sid)

if __name__ == '__main__':
    counter = Counter()
    app = socketio.Middleware(sio, app)

    eventlet.wsgi.server(eventlet.listen(('localhost', 8000)), app)
