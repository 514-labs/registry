"""Mock database connections for unit testing."""
from typing import List, Tuple, Any, Optional
from unittest.mock import MagicMock


class MockCursor:
    """Mock database cursor for testing."""

    def __init__(self):
        self.execute_calls: List[Tuple[str, Optional[Tuple]]] = []
        self._results: List[List[Tuple]] = []
        self._current_result_index = 0
        self.rowcount = 0
        self.description = None

    def set_results(self, results: List[Tuple]):
        """Set results to be returned by fetchall()."""
        self._results.append(results)

    def execute(self, query: str, params: Optional[Tuple] = None):
        """Track execute calls and prepare results."""
        self.execute_calls.append((query, params))
        self.rowcount = 0

    def fetchall(self) -> List[Tuple]:
        """Return mock results."""
        if self._current_result_index < len(self._results):
            result = self._results[self._current_result_index]
            self._current_result_index += 1
            self.rowcount = len(result)
            return result
        return []

    def fetchone(self) -> Optional[Tuple]:
        """Return single mock result."""
        results = self.fetchall()
        return results[0] if results else None

    def close(self):
        """Close cursor."""
        pass

    def __enter__(self):
        """Support context manager."""
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """Close on context exit."""
        self.close()
        return False


class MockConnection:
    """Mock database connection for testing."""

    def __init__(self):
        self.cursors: List[MockCursor] = []
        self._commit_count = 0
        self._rollback_count = 0
        self._closed = False

    def cursor(self) -> MockCursor:
        """Create and return a mock cursor."""
        cursor = MockCursor()
        self.cursors.append(cursor)
        return cursor

    def commit(self):
        """Mock commit."""
        self._commit_count += 1

    def rollback(self):
        """Mock rollback."""
        self._rollback_count += 1

    def close(self):
        """Mock close."""
        self._closed = True

    @property
    def is_closed(self) -> bool:
        """Check if connection is closed."""
        return self._closed

    @property
    def commit_count(self) -> int:
        """Get number of commits."""
        return self._commit_count

    @property
    def rollback_count(self) -> int:
        """Get number of rollbacks."""
        return self._rollback_count


def create_mock_connection() -> MockConnection:
    """Factory function to create mock connections."""
    return MockConnection()


def create_mock_cursor_with_results(results: List[Tuple]) -> MockCursor:
    """Create a mock cursor with predefined results."""
    cursor = MockCursor()
    cursor.set_results(results)
    return cursor
