import asyncio
import datetime
import random
import websockets
import socket
import json
from src.Server.StreamToFrequency import Generator

s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("192.168.1.151", 80))
ip = s.getsockname()[0]
s.close()


generator = Generator()
# generator.generate_set()

with open('./src/Server/ip.json', 'w') as outfile:
    json.dump({'ip': ip}, outfile)

async def data():
    while True:
        yield random.randrange(100, 1000, 15)

async def test(websocket, path):
    async for i in data():
        print(i)
        await websocket.send(str(i))
        await asyncio.sleep(.4)

# if __name__ == '__main__':ç

start_server = websockets.serve(test, ip, 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
