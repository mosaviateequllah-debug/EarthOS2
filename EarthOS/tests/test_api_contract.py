"""Small contract tests for the public API surface."""
import unittest
from backend.main import app

class ApiContractTests(unittest.TestCase):
    def test_expected_routes_are_registered(self):
        paths = {route.path for route in app.routes}
        self.assertIn("/health", paths)
        self.assertIn("/api/nasa/power", paths)
        self.assertIn("/api/catalog", paths)

    def test_app_metadata(self):
        self.assertEqual(app.title, "EarthOS Platform API")
        self.assertTrue(app.version.startswith("1."))

if __name__ == "__main__":
    unittest.main()
