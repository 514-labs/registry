from setuptools import setup, find_packages

setup(
    name="qvd-to-clickhouse",
    version="0.1.0",
    description="QVD to ClickHouse data pipeline with universal file system support",
    packages=find_packages(),
    install_requires=[
        "moose-cli>=0.6.103",
        "moose-lib>=0.6.103",
        "pydantic>=2.11.0",
        "pyqvd>=2.2.0",
        "pandas>=2.0.0",
        "fsspec>=2024.1.0",
        "s3fs>=2024.1.0",
        "requests>=2.31.0",
        "tenacity>=9.0.0",
        "python-dotenv>=1.0.0",
    ],
    python_requires=">=3.12",
)
