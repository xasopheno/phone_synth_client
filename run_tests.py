import unittest
import test.all_tests
test_suite = test.all_tests.create_test_suite()
text_runner = unittest.TextTestRunner().run(test_suite)
