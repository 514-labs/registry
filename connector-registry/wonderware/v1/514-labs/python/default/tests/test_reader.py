"""Tests for WonderwareReader."""
import pytest


def test_discover_tags(mock_engine):
    """Test discovering tags from TagRef table."""
    from wonderware.reader import WonderwareReader

    reader = WonderwareReader(mock_engine)
    tags = reader.discover_tags()

    # Should exclude SysTag
    assert len(tags) == 2
    assert "Tag1" in tags
    assert "Tag2" in tags
    assert "SysTag" not in tags


def test_fetch_history_data(mock_engine):
    """Test fetching history data."""
    from wonderware.reader import WonderwareReader

    reader = WonderwareReader(mock_engine)
    rows = reader.fetch_history_data(
        tag_names=["Tag1", "Tag2"],
        date_from="2026-01-01 00:00:00",
        date_to="2026-01-01 00:02:00",
        inclusive_start=True
    )

    assert len(rows) == 3
    assert all(isinstance(row, dict) for row in rows)
    assert all("TagName" in row for row in rows)
    assert all("Value" in row for row in rows)


def test_fetch_history_data_empty_tags(mock_engine):
    """Test fetching history data with empty tag list."""
    from wonderware.reader import WonderwareReader

    reader = WonderwareReader(mock_engine)
    rows = reader.fetch_history_data(
        tag_names=[],
        date_from="2026-01-01 00:00:00",
        date_to="2026-01-01 00:02:00"
    )

    assert len(rows) == 0


def test_fetch_history_data_single_tag(mock_engine):
    """Test fetching history data for a single tag."""
    from wonderware.reader import WonderwareReader

    reader = WonderwareReader(mock_engine)
    rows = reader.fetch_history_data(
        tag_names=["Tag1"],
        date_from="2026-01-01 00:00:00",
        date_to="2026-01-01 00:02:00"
    )

    assert len(rows) == 2
    assert all(row["TagName"] == "Tag1" for row in rows)


def test_get_tag_count(mock_engine):
    """Test getting tag count."""
    from wonderware.reader import WonderwareReader

    reader = WonderwareReader(mock_engine)
    count = reader.get_tag_count()

    # Should exclude SysTag
    assert count == 2


def test_test_connection_success(mock_engine):
    """Test connection test with valid engine."""
    from wonderware.reader import WonderwareReader

    reader = WonderwareReader(mock_engine)
    assert reader.test_connection() is True


def test_test_connection_failure():
    """Test connection test with invalid engine."""
    from wonderware.reader import WonderwareReader
    from unittest.mock import Mock

    # Create a mock engine that raises an exception
    mock_engine = Mock()
    mock_engine.connect.side_effect = Exception("Connection failed")

    reader = WonderwareReader(mock_engine)
    assert reader.test_connection() is False
