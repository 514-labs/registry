from setuptools import setup, find_packages

setup(
    name="wonderware-to-clickhouse",
    version="1.0.0",
    description="Wonderware/AVEVA Historian to ClickHouse data pipeline",
    author="514 Labs",
    author_email="info@514.dev",
    packages=find_packages(),
    install_requires=[
        "moose-cli>=0.6.230",
        "moose-lib>=0.6.230",
        "pydantic>=2.11.0",
        "sqlalchemy>=2.0.0",
        "python-tds>=1.16.0",
        "tenacity>=9.0.0",
        "python-dotenv>=1.0.0",
        "redis>=5.0.0",
    ],
    python_requires=">=3.13",
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Programming Language :: Python :: 3.13",
    ],
)
