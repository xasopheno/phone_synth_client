import asyncio

import websockets


@asyncio.coroutine
def hello():
    connection = yield from websockets.connect('ws://localhost:8001/')
    name = 'test'
    yield from connection.send(name)
    print("> {}".format(name))
    while True:
        msg = yield from connection.recv()
        print("< {}".format(msg))

    # yield from connection.close()


asyncio.get_event_loop().run_until_complete(hello())
