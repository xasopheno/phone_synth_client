from socketIO_client import SocketIO, LoggingNamespace
import time
import random


def random_song(start, end):
    rand = random.randint(start, end)
    payload = {
        'freq1': rand,
        'freq2': rand * random.choice([3/2, 5/4, 15/8, 7/4, 9/8, 25/24, 25/24]),
        'vol': 100,
    }

    socketIO.emit('song_change', payload)
    time.sleep(random.choice([0.05]))


def pretty():
    x = 300
    freqs = [
        [x, x * 5/4],
        [x, x * 5/4],
        [x, x * 5/4],
        [x * 9/8, x * 4/3],
        [x * 5/4, x * 3/2],
        [x * 9/8, x * 15/8],
        [x * 4/3, x * 5/3],
        [x * 15/8 /2, x * 3/2],
    ]

    for i in range(2):
        for freq in freqs:
            payload = {
                'freq1': freq[0],
                'freq2': freq[1],
                'vol': 100,
            }

            socketIO.emit('song_change', payload)
            time.sleep(.6)

    start = 800
    end = 1000
    for i in range(15):
        random_song(start, end)
        start -= 50
        end -= 50

with SocketIO('127.0.0.1', 8000, LoggingNamespace) as socketIO:
    while True:
        pretty()

