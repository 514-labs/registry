"""
Unit tests for Wonderware data models.
"""

import pytest
from datetime import datetime
from app.ingest.wonderware_models import WonderwareHistory, WonderwareHistoryAggregated


def test_wonderware_history_model_creation():
    """Test creating WonderwareHistory model with required fields."""
    data = {
        'DateTime': datetime(2025, 2, 6, 12, 0, 0),
        'TagName': 'TagA',
        'wwRetrievalMode': 'Delta',
    }

    model = WonderwareHistory(**data)

    assert model.DateTime == datetime(2025, 2, 6, 12, 0, 0)
    assert model.TagName == 'TagA'
    assert model.wwRetrievalMode == 'Delta'
    assert model.Value is None  # Optional field defaults to None


def test_wonderware_history_model_with_all_fields():
    """Test creating WonderwareHistory model with all fields."""
    data = {
        'DateTime': datetime(2025, 2, 6, 12, 0, 0),
        'TagName': 'TagA',
        'Value': 123.45,
        'VValue': 'test',
        'Quality': 192,
        'QualityDetail': 0,
        'OpcQuality': 1,
        'wwTagKey': 1,
        'wwRowCount': 1,
        'wwResolution': 1,
        'wwEdgeDetection': 'None',
        'wwRetrievalMode': 'Delta',
        'wwTimeDeadband': 0.5,
        'wwValueDeadband': 1.0,
        'wwTimeZone': 'UTC',
        'wwVersion': '1.0',
        'wwCycleCount': 1,
        'wwTimeStampRule': 'Rule1',
        'wwInterpolationType': 'Linear',
        'wwQualityRule': 'Good',
        'wwStateCalc': 'Calc1',
        'StateTime': datetime(2025, 2, 6, 12, 0, 0),
        'PercentGood': 100.0,
        'wwParameters': 'params',
        'StartDateTime': datetime(2025, 2, 6, 11, 0, 0),
        'SourceTag': 'SourceA',
        'SourceServer': 'Server1',
        'wwFilter': 'filter1',
        'wwValueSelector': 'selector1',
        'wwMaxStates': 10,
        'wwOption': 'option1',
        'wwExpression': 'expr1',
        'wwUnit': 'unit1',
    }

    model = WonderwareHistory(**data)

    assert model.Value == 123.45
    assert model.VValue == 'test'
    assert model.Quality == 192
    assert model.wwUnit == 'unit1'


def test_wonderware_history_aggregated_model():
    """Test creating WonderwareHistoryAggregated model."""
    data = {
        'TagName': 'TagA',
        'minute_timestamp': datetime(2025, 2, 6, 12, 0, 0),
        'first_value': 100.0,
        'avg_value': 105.5,
        'min_value': 100.0,
        'max_value': 110.0,
        'count': 60,
        'avg_quality': 192.0,
        'min_quality': 192,
    }

    model = WonderwareHistoryAggregated(**data)

    assert model.TagName == 'TagA'
    assert model.minute_timestamp == datetime(2025, 2, 6, 12, 0, 0)
    assert model.first_value == 100.0
    assert model.avg_value == 105.5
    assert model.count == 60


def test_wonderware_history_aggregated_model_minimal():
    """Test creating WonderwareHistoryAggregated with minimal fields."""
    data = {
        'TagName': 'TagB',
        'minute_timestamp': datetime(2025, 2, 6, 12, 1, 0),
        'count': 30,
    }

    model = WonderwareHistoryAggregated(**data)

    assert model.TagName == 'TagB'
    assert model.count == 30
    assert model.first_value is None
    assert model.avg_value is None


def test_wonderware_history_model_validation():
    """Test that model validation catches missing required fields."""
    with pytest.raises(ValueError):
        # Missing required field 'DateTime'
        WonderwareHistory(TagName='TagA', wwRetrievalMode='Delta')


def test_wonderware_history_table_config():
    """Test that OlapTable config is properly set."""
    from app.ingest.wonderware_models import WonderwareHistoryTable

    assert WonderwareHistoryTable.table_name == 'WonderwareHistory'
    assert WonderwareHistoryTable.config.order_by_fields == ['TagName', 'DateTime']
    assert WonderwareHistoryTable.config.partition_by == 'toYYYYMM(DateTime)'
    assert WonderwareHistoryTable.config.ttl == 'DateTime + INTERVAL 90 DAY'


def test_wonderware_history_aggregated_table_config():
    """Test that aggregated table config is properly set."""
    from app.ingest.wonderware_models import WonderwareHistoryAggregatedTable

    assert WonderwareHistoryAggregatedTable.table_name == 'WonderwareHistoryAggregated'
    assert WonderwareHistoryAggregatedTable.config.order_by_fields == ['TagName', 'minute_timestamp']
    assert WonderwareHistoryAggregatedTable.config.ttl == 'minute_timestamp + INTERVAL 730 DAY'
