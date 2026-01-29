import unittest
from app.utils.qvd_introspection import QvdIntrospector


class TestQvdIntrospection(unittest.TestCase):
    """Test QVD introspection utilities."""

    def test_sanitize_field_name(self):
        """Test field name sanitization."""
        cases = [
            ("%KEY_Item", "key_item"),
            ("Item Description", "item_description"),
            ("Item (Y/N)", "item_y_n"),
            ("Latest Purchase Price", "latest_purchase_price"),
            ("%ProductType", "producttype"),
            ("Item Search Key 2/NSN", "item_search_key_2_nsn"),
            ("class", "class_"),  # Python keyword
        ]

        for original, expected in cases:
            result = QvdIntrospector._sanitize_field_name(original)
            self.assertEqual(
                result,
                expected,
                f"Failed for '{original}': got '{result}', expected '{expected}'"
            )

    def test_to_pascal_case(self):
        """Test PascalCase conversion."""
        cases = [
            ("item", "Item"),
            ("purchase_order", "PurchaseOrder"),
            ("item reception", "ItemReception"),
            ("supplier_item", "SupplierItem"),
        ]

        for original, expected in cases:
            result = QvdIntrospector._to_pascal_case(original)
            self.assertEqual(
                result,
                expected,
                f"Failed for '{original}': got '{result}', expected '{expected}'"
            )

    def test_needs_alias_detection(self):
        """Test detection of fields needing aliases."""
        cases_needing_alias = [
            "%KEY_Item",
            "Item Description",
            "Item (Y/N)",
            "Latest Purchase Price",
        ]

        cases_not_needing_alias = [
            "item",
            "company",
            "description",
        ]

        for name in cases_needing_alias:
            sanitized = QvdIntrospector._sanitize_field_name(name)
            self.assertNotEqual(
                name,
                sanitized,
                f"'{name}' should need an alias"
            )

        for name in cases_not_needing_alias:
            sanitized = QvdIntrospector._sanitize_field_name(name)
            self.assertEqual(
                name.lower(),
                sanitized,
                f"'{name}' should not need an alias"
            )


if __name__ == "__main__":
    unittest.main()
