import unittest
from src.Server.io_server import Counter
from src.Server.io_server import prepare_payload


class PhoneSynthTest(unittest.TestCase):
    def test_counter(self):
        counter = Counter()

        self.assertEqual(counter.count, 0)
        counter.inc()
        self.assertEqual(counter.count, 1)

    def test_prepare_payload(self):
        expected = {
            'freq1': 100,
            'freq2': 200,
            'vol': 100,
        }
        self.assertEqual(prepare_payload(100, 200), expected)

if __name__ == '__main__':
    unittest.main()
