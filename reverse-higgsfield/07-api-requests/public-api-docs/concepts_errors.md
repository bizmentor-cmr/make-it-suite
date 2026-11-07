> ## Documentation Index
> Fetch the complete documentation index at: https://docs.higgsfield.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Errors and retries

> Handle synchronous API errors and terminal generation failures.

Errors can occur before a request is accepted or later during generation.

## Synchronous errors

Most HTTP errors use the FastAPI error envelope:

```json theme={"theme":{"light":"github-light","dark":"github-dark"}}
{
  "detail": "Invalid credentials"
}
```

Validation errors may return a list in `detail`. Do not parse human-readable messages to make permanent business decisions.

| Status | Typical meaning | Retry? |
| - | - | :-: |
| `400` | Invalid parameters or rejected input | After correcting the request |
| `401` | Missing or invalid credentials | No |
| `403` | Insufficient balance | After adding funds |
| `404` | Request or model not found for this account | No |
| `409` | The request is still running; for example, deleting a request that is `queued` or `in_progress` | After it finishes |
| `422` | Request validation failed, an idempotency key was reused with different parameters, or `Hf-Expires-After` is out of range | No |
| `423` | Model is temporarily blocked | Later |
| `429` | The account's generation queue is full (`account_queue_full`) or an endpoint limit was reached; see [Rate limits](https://docs.higgsfield.ai/docs/concepts/rate-limits.md) | After `Retry-After` |
| `500` | Unexpected server error | Yes, with backoff |
| `503` | Model is disabled or not ready, or queue admission is temporarily unavailable (`admission_control_unavailable`) | Later, with backoff |

## Terminal failures

An accepted request can later finish with `failed` or `nsfw`:

```json theme={"theme":{"light":"github-light","dark":"github-dark"}}
{
  "status": "failed",
  "request_id": "d7e6c0f3-6699-4f6c-bb45-2ad7fd9158ff",
  "error": "Generation failed"
}
```

Failed and NSFW requests are not charged; any reserved amount is refunded.

## Safe retry policy

* Retry `GET` status requests after network failures and `5xx` responses.
* Do not retry authentication or validation failures without changing the request.
* Use exponential backoff with jitter.
* Set maximum attempts and a total retry deadline.
* Send an [`Idempotency-Key`](https://docs.higgsfield.ai/docs/concepts/idempotency) with every generation submission.
* After an ambiguous timeout, network failure, or `5xx`, repeat the same generation request with the same idempotency key.

Every API response includes an `X-Correlation-ID` header. Record it with the `request_id` and include both when contacting support.


## Related topics

- [Reliability and support](https://docs.higgsfield.ai/docs/enterprise/reliability-and-support.md)
- [Support](https://docs.higgsfield.ai/docs/help/support.md)
- [Idempotent requests](https://docs.higgsfield.ai/docs/concepts/idempotency.md)
- [Headers](https://docs.higgsfield.ai/docs/api-reference/headers.md)
- [Polling](https://docs.higgsfield.ai/docs/concepts/polling.md)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.