"""
Unit tests for WonderwareBatchInserter.
"""

import pytest
from unittest.mock import MagicMock, patch
from app.workflows.lib.wonderware_inserter import WonderwareBatchInserter
from app.ingest.wonderware_models import WonderwareHistory


@pytest.fixture
def inserter():
    """Create WonderwareBatchInserter instance."""
    return WonderwareBatchInserter()


@pytest.fixture
def mock_insert_result():
    """Mock insert result from Moose."""
    result = MagicMock()
    result.successful = 2
    result.failed = 0
    return result


def test_insert_rows_success(inserter, sample_wonderware_rows, mock_insert_result):
    """Test successful batch insert."""
    with patch('app.workflows.lib.wonderware_inserter.WonderwareHistoryTable.insert') as mock_insert:
        mock_insert.return_value = mock_insert_result

        count = inserter.insert_rows(sample_wonderware_rows)

        assert count == 2
        assert mock_insert.call_count == 1

        # Verify models were passed
        call_args = mock_insert.call_args
        models = call_args[0][0]
        assert len(models) == 2
        assert all(isinstance(m, WonderwareHistory) for m in models)


def test_insert_rows_empty_list(inserter):
    """Test inserting empty list returns 0."""
    count = inserter.insert_rows([])

    assert count == 0


def test_insert_rows_invalid_data(inserter):
    """Test inserting invalid data logs warning and skips rows."""
    invalid_rows = [
        {'DateTime': '2025-02-06 12:00:00'},  # Missing required fields
        {'TagName': 'TagA'},  # Missing DateTime
    ]

    with patch('app.workflows.lib.wonderware_inserter.WonderwareHistoryTable.insert') as mock_insert:
        count = inserter.insert_rows(invalid_rows)

        # Should not call insert since no valid models
        assert count == 0
        mock_insert.assert_not_called()


def test_insert_rows_partial_failure(inserter, sample_wonderware_rows):
    """Test insert with partial failures."""
    mock_result = MagicMock()
    mock_result.successful = 1
    mock_result.failed = 1

    with patch('app.workflows.lib.wonderware_inserter.WonderwareHistoryTable.insert') as mock_insert:
        mock_insert.return_value = mock_result

        count = inserter.insert_rows(sample_wonderware_rows)

        # Returns count of models sent, not successful rows
        assert count == 2


def test_insert_rows_retry_on_failure(inserter, sample_wonderware_rows):
    """Test retry logic when insert fails."""
    with patch('app.workflows.lib.wonderware_inserter.WonderwareHistoryTable.insert') as mock_insert:
        # First two calls fail, third succeeds
        mock_insert.side_effect = [
            Exception("Connection error"),
            Exception("Timeout"),
            MagicMock(successful=2, failed=0)
        ]

        count = inserter.insert_rows(sample_wonderware_rows)

        # Should retry and eventually succeed
        assert count == 2
        assert mock_insert.call_count == 3


def test_insert_rows_exhausted_retries(inserter, sample_wonderware_rows):
    """Test that retry exhaustion raises exception."""
    with patch('app.workflows.lib.wonderware_inserter.WonderwareHistoryTable.insert') as mock_insert:
        # All retries fail
        mock_insert.side_effect = Exception("Persistent error")

        with pytest.raises(Exception, match="Persistent error"):
            inserter.insert_rows(sample_wonderware_rows)

        # Should retry 3 times (initial + 2 retries based on tenacity config)
        assert mock_insert.call_count == 3


def test_insert_rows_skip_duplicates_option(inserter, sample_wonderware_rows, mock_insert_result):
    """Test that skip_duplicates option is passed to insert."""
    with patch('app.workflows.lib.wonderware_inserter.WonderwareHistoryTable.insert') as mock_insert:
        mock_insert.return_value = mock_insert_result

        inserter.insert_rows(sample_wonderware_rows)

        # Verify InsertOptions was passed
        call_args = mock_insert.call_args
        options = call_args[1]['options']
        assert options.skip_duplicates is True


def test_insert_rows_model_conversion(inserter):
    """Test that raw dicts are converted to WonderwareHistory models."""
    rows = [
        {
            'DateTime': '2025-02-06T12:00:00',
            'TagName': 'TagC',
            'Value': 99.9,
            'wwRetrievalMode': 'Delta',
        }
    ]

    with patch('app.workflows.lib.wonderware_inserter.WonderwareHistoryTable.insert') as mock_insert:
        mock_insert.return_value = MagicMock(successful=1, failed=0)

        inserter.insert_rows(rows)

        # Verify model was created correctly
        models = mock_insert.call_args[0][0]
        assert len(models) == 1
        assert isinstance(models[0], WonderwareHistory)
        assert models[0].TagName == 'TagC'
        assert models[0].Value == 99.9
