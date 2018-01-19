import unittest
import spec.all_tests
test_suite = spec.all_tests.create_test_suite()
text_runner = unittest.TextTestRunner().run(test_suite)
