# MetricType (Type)

A metric's value type.

## Values

- `METRIC_TYPE_UNSPECIFIED`: Unspecified type
- `TYPE_INTEGER`: Integer type - values will be integers
- `TYPE_FLOAT`: Floating point type - values will be floats
- `TYPE_SECONDS`: A duration in seconds; a special floating point type
- `TYPE_MILLISECONDS`: A duration in milliseconds; a special floating point type
- `TYPE_MINUTES`: A duration in minutes; a special floating point type  
- `TYPE_HOURS`: A duration in hours; a special floating point type
- `TYPE_STANDARD`: A custom metric of standard type
- `TYPE_CURRENCY`: An amount of money; a special floating point type
- `TYPE_FEET`: A distance in feet; a special floating point type
- `TYPE_MILES`: A distance in miles; a special floating point type
- `TYPE_METERS`: A distance in meters; a special floating point type
- `TYPE_KILOMETERS`: A distance in kilometers; a special floating point type

## Usage

This is a **TYPE** used to indicate the data type of metric values. It helps in understanding how to interpret and format metric values in reports.

This file accompanies `MetricType.schema.json` for a programmatic definition.
