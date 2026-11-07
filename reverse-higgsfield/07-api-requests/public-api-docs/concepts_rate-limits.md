> ## Documentation Index
> Fetch the complete documentation index at: https://docs.higgsfield.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Rate limits

> Design integrations for account and model concurrency limits.

Rate limits depend on the account and the selected model. View the limits assigned to your account in [Higgsfield Console](https://console.higgsfield.ai).

The primary generation limit is concurrency: the number of requests that may be processing at the same time. Some models can also have model-specific limits.

## When concurrency is reached

Generation requests above your concurrency limit are still accepted. The API returns a `request_id` with status `queued`, and the request starts automatically when one of your running requests reaches a terminal status.

## When the queue is full

The number of generations waiting to start is limited too. The queue limit is a multiple of your account's concurrency limit, and each output of a batch request counts separately. When the queue is full, a new generation request is rejected with `429 Too Many Requests` and a `Retry-After` header, and nothing is created or charged:

```json theme={"theme":{"light":"github-light","dark":"github-dark"}}
{
  "detail": {
    "code": "account_queue_full",
    "message": "Too many queued generations for this account",
    "retryable": true,
    "limit": 40,
    "retry_after_seconds": 30
  }
}
```

`limit` is the queue limit for your account. Wait for `Retry-After` seconds and submit again with the same [`Idempotency-Key`](https://docs.higgsfield.ai/docs/concepts/idempotency); queued requests leave the queue as soon as they start.

If queue admission is briefly unavailable, the API returns `503 Service Unavailable` with `"code": "admission_control_unavailable"` and `"retryable": true`. Retry with backoff.

## Endpoint-specific limits

Some non-generation endpoints reject requests above their limit instead of queuing them. They return `429 Too Many Requests` with a `Retry-After` header:

| Endpoint | Limit |
| - | - |
| `POST /v1/custom-references` | Number of Soul ID references training at the same time |

```json theme={"theme":{"light":"github-light","dark":"github-dark"}}
{
  "detail": "Maximum number of concurrent requests (2) has been reached"
}
```

## Client recommendations

* On `429`, wait for the number of seconds in `Retry-After` before submitting again.
* Limit generation submissions with a worker pool or semaphore so the queue stays short and never reaches its limit.
* Track each accepted `request_id` until it becomes terminal.
* Use backoff and jitter instead of retrying in a tight loop.
* Keep polling traffic separate from generation submission concurrency.
* Let us know in [Discord](https://discord.gg/BEea92KeR9) before a planned traffic increase if you need higher limits.

> [!NOTE]
>
> Successful responses do not yet include rate-limit headers with your remaining capacity. Treat the limits shown in your dashboard as the authoritative values for your account.


## Related topics

- [FAQ](https://docs.higgsfield.ai/docs/help/faq.md)
- [Capacity and concurrency](https://docs.higgsfield.ai/docs/enterprise/capacity.md)
- [Headers](https://docs.higgsfield.ai/docs/api-reference/headers.md)
- [Errors and retries](https://docs.higgsfield.ai/docs/concepts/errors.md)
- [Genjutsu — Restyle API](https://docs.higgsfield.ai/docs/models/genjutsu/restyle.md)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.