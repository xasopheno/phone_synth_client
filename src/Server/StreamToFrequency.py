from __future__ import division
import numpy
import pyaudio
from collections import deque, Counter
import aubio
import os.path
import sys
import time
sys.path.append(os.path.join(os.path.dirname(os.path.realpath(__file__)), os.pardir))
current_path = os.getcwd()

class StreamToFrequency:
    def __init__(self):
        self.pDetection = aubio.pitch("yinfft", 2048, 2048, 44100)
        self.pDetection.set_unit("Hz")
        self.pDetection.set_silence(-40)
        self.pDetection.set_tolerance(.99)

        self.volume_threshold = 300
        self.acceptable_confidence = 0.61

        self.past_freq = 0
        self.predicted_frequency = 0
        self.set = {0}


    def callback(self, in_data, frame_count, time_info, status):
        samples = numpy.fromstring(in_data,
                                   dtype=aubio.float_type)

        prediction = self.pDetection(samples)[0]

        volume = numpy.sum(samples ** 2) / len(samples)
        volume = round(volume, 6) * 10 ** 5

        confidence = self.pDetection.get_confidence()

        if confidence < self.acceptable_confidence or volume < self.volume_threshold:
            self.predicted_frequency = 0
        else:
            self.predicted_frequency = prediction

        prediction = round(self.predicted_frequency)
        # print(prediction)
        self.past_freq = prediction

        # self.output_file.write(str(self.predicted_frequency) + '\n')
        # self.output_file.flush()
        # os.fsync(self.output_file.fileno())

        return in_data, pyaudio.paContinue


class Generator:
    def __init__(self):
        self.value = 0
        self.subdivision = 0.01
        self.isZero = True
        self.counter = 0
        self.set = {0}
        self.detector = StreamToFrequency()
        self.p = pyaudio.   PyAudio()
        self.stream = self.p.open(format=pyaudio.paFloat32,
                                  channels=1,
                                  rate=44100,
                                  frames_per_buffer=2048,
                                  input=True,
                                  output=False,
                                  stream_callback=self.detector.callback)

    def __next__self(self):
        while True:
            return self.value

    def next(self):
        return self.__next__self()

    def myround(self, x, base=5):
        return int(base * round(float(x)/base))

    def Most_Common(self, lst):
        data = Counter(lst)
        return data.most_common(1)[0][0]

    async def generate_set(self):
        prev_lines = deque(maxlen=1)
        while True:
            pred = self.detector.predicted_frequency
            prev_lines.append(int(round(pred)))
            self.set = set(prev_lines)
            value = self.play_set(self.set)
            if self.counter % 1000 == 1:
                return value
            self.counter += 1


    def play_set(self, bagOfNotes):
                start = time.time()
                # with open("midiOutput.txt", 'a') as myfile:
                # value = self.myround(sum(bagOfNotes) / len(bagOfNotes), 20)
                for value in bagOfNotes:
                    return value

if __name__ == '__main__':
    generator = Generator()
    generator.generate_set()
