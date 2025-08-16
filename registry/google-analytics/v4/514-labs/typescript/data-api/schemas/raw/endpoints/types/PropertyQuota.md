# PropertyQuota (Type)

Current state of all quotas for this Analytics Property. If any quota for a property is exhausted, all requests to that property will return Resource Exhausted errors.

## Properties

- `tokensPerDay`: Standard Analytics Properties can use up to 200,000 tokens per day; Analytics 360 Properties can use 2,000,000 tokens per day
  - `consumed`: The number of tokens consumed for this resource quota
  - `remaining`: The number of tokens remaining for this resource quota
- `tokensPerHour`: Standard Analytics Properties can use up to 40,000 tokens per hour; Analytics 360 Properties can use 400,000 tokens per hour
- `concurrentRequests`: Standard Analytics Properties can send up to 10 concurrent requests; Analytics 360 Properties can send up to 50 concurrent requests
- `serverErrorsPerProjectPerHour`: Standard Analytics Properties and Analytics 360 Properties can use up to 10% of their tokens per project per hour
- `potentiallyThresholdedRequestsPerHour`: Analytics Properties can use up to 120 requests per hour

## Usage

This is a **TYPE** returned in report responses when `returnPropertyQuota` is set to true. It helps you monitor your API usage and avoid hitting quota limits.

Each quota type includes:
- `consumed`: How many tokens/requests have been used
- `remaining`: How many tokens/requests are still available

This file accompanies `PropertyQuota.schema.json` for a programmatic definition.
