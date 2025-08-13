#!/usr/bin/env python3
"""
Setup script for Shopify Python Connector.
"""

from setuptools import setup, find_packages

setup(
    name="shopify-connector",
    version="0.1.8",
    description="Shopify connector implementing the API Connector Specification",
    author="FiveOneFour",
    license="MIT",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.12",
    install_requires=[
        "pydantic>=2.0.0",
        "requests>=2.28.0",
        "httpx>=0.24.0",
        "structlog>=23.0.0",
        "prometheus-client>=0.17.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.0.0",
            "pytest-mock>=3.10.0",
            "pytest-asyncio>=0.21.0",
            "black>=23.0.0",
            "isort>=5.12.0",
            "mypy>=1.0.0",
            "build>=1.2.2.post1",
        ]
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.12",
    ],
)
