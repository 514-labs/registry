# MetricHeader (Type)

Describes a metric column in the report response.

## Properties

- `name`: The metric's name
- `type`: The metric's data type (see MetricType)

## Usage

This is a **TYPE** that appears in report responses to describe the metric columns. Each MetricHeader corresponds to a metric requested in the report and helps identify the metric values in each row of the response.

The number of MetricHeaders in a response equals the number of metrics requested in the report.

This file accompanies `MetricHeader.schema.json` for a programmatic definition.
