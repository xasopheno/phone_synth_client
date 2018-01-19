import asyncio
import random
import websockets
import datetime
import socket
import json
from src.Server.StreamToFrequency import Generator
from collections import deque

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip = s.getsockname()[0]
ip = s.getsockname()[0]
s.close()

generator = Generator()

# here we'll store all active connections to use for sending periodic messages
connections = set()
globals()
i = 0


async def data():
    global i
    # while True:
        # if i >= 35:
        #     i = 0
        #
        # if i < 10:
        #     i += 1
        #     print(i)
        #     return 100 + i * 15
        #
        # if i >= 10 and i < 20:
        #     i += 1
        #     return random.randrange(100, 700, 15)
        #
        # if i >= 20 and i < 25:
        #     i += 1
        #     return random.randrange(800, 1000, 25)
        #
        # if i >= 25 and i < 35:
        #     i += 1
        #     return random.randrange(500, 600, 25)
    freq = 500
    while True:
        if i >= 28:
            i = 0

        if i < 4:
            i += 1
            print(i)
            return freq

        if i >= 4 and i < 8:
            i += 1
            return freq * 3/2

        if i >= 8 and i < 12:
            i += 1
            return freq * 4/3

        if i >= 12 and i < 16:
            i += 1
            return freq * 9/8 + (freq * 1/8 * (i - 13))

        if i >= 16 and i < 19:
            i += 1
            return freq * 11/8 + (freq * 1/8 * (i - 13))

        if i >= 19 and i < 22:
            i += 1
            return freq * 15/8 + (freq * 1/8 * (i - 13))

        if i >= 22 and i < 28:
            i += 1
            return 0



@asyncio.coroutine
def connection_handler(connection, path):
    global connections
    connections.add(connection)  # add connection to pool
    while True:
        try:
            msg = yield from connection.recv()
            if msg is None:  # connection lost
                print('connection lost')
                connections.remove(connection)  # remove connection from pool, when client disconnects
                break
        finally:
                print('< {}'.format(msg))
                yield from connection.send(msg)
                print('> {}'.format(msg))


@asyncio.coroutine
def send_periodically():
    while True:
        yield from asyncio.sleep(.01)  # switch to other code and continue execution in 5 seconds
        value = yield from generator.generate_set()
        # value = yield from data()
        print (value)
        for connection in connections:
            print(connection)
            yield from connection.send(str(value))  # send message to each connected client
            print('________')

start_server = websockets.serve(connection_handler, ip, 5678)
print(ip, 5678)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.async(send_periodically())  # before blocking call we schedule our coroutine for sending periodic messages
asyncio.get_event_loop().run_forever()
