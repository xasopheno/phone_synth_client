import asyncio
import datetime
import random
import websockets
import socket
import json

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("8.8.8.8", 80))
ip = s.getsockname()[0]
s.close()

with open('./src/Server/ip.json', 'w') as outfile:
    json.dump({'ip': ip}, outfile)

async def time(websocket, path):
    while True:
        rand = str(random.randrange(300, 600, 10))
        await websocket.send(rand)
        await asyncio.sleep(.4)
        print(rand)

start_server = websockets.serve(time, ip, 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
