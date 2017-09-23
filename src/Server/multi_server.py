import asyncio
import random
import websockets
import datetime
import socket
import json
from StreamToFrequency import Generator
from collections import deque

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip = s.getsockname()[0]
s.close()

generator = Generator()

# here we'll store all active connections to use for sending periodic messages
connections = set()

async def data():
    while True:
        return random.randrange(100, 1000, 15)

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

#
# @asyncio.coroutine
# async def send_periodically():
#     while True:
#         # async for i in asyncio.sleep(.2):  # switch to other code and continue execution in 5 seconds
#         async for freq in generator.generate_set():
#             # print (freq)
#             for connection in connections:
#                 print(connection)
#                 await connection.send(str(freq)) # send message to each connected client
#                 print('________')

@asyncio.coroutine
def send_periodically():
    while True:
        yield from asyncio.sleep(.01)  # switch to other code and continue execution in 5 seconds
        value = yield from generator.generate_set()
        print (value)
        for connection in connections:
            yield from connection.send(str(value))  # send message to each connected client
            print('________')

start_server = websockets.serve(connection_handler, ip, 5678)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.async(send_periodically())  # before blocking call we schedule our coroutine for sending periodic messages
asyncio.get_event_loop().run_forever()
