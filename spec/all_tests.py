import glob
import unittest


def create_test_suite():
    test_file_strings = glob.glob('spec/test_*.py')
    module_strings = ['spec.'+str[5:len(str)-3] for str in test_file_strings]
    suites = [unittest.defaultTestLoader.loadTestsFromName(name) \
              for name in module_strings]
    test_suite = unittest.TestSuite(suites)
    return test_suite
