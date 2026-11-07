> ## Documentation Index
> Fetch the complete documentation index at: https://docs.higgsfield.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Headers

> Every request header, query parameter and response header the API uses.

## Request headers

| Header | Required | Applies to | Description |
| - | :-: | - | - |
| `Authorization` | Yes | All endpoints | `Key <key-id>:<key-secret>`. See [Authentication](https://docs.higgsfield.ai/docs/authentication.md). |
| `Content-Type` | For a body | Requests with a JSON body | `application/json`. |
| `Idempotency-Key` | No | Generation requests | 1–255 visible ASCII characters, a UUID is recommended. Retrying with the same key returns the original request instead of creating a new one. See [Idempotent requests](https://docs.higgsfield.ai/docs/concepts/idempotency.md). |
| `Hf-Expires-After` | No | Generation requests | Seconds to keep the request's data after it finishes, from 3600 to your account retention. It can only shorten retention; out-of-range values return `422`. See [Data retention and deletion](https://docs.higgsfield.ai/docs/enterprise/data-retention.md). |

`hf-api-key` and `hf-secret` are accepted as a legacy alternative to `Authorization`. New integrations should use `Authorization`.

## Query parameters

| Parameter | Applies to | Description |
| - | - | - |
| `hf_webhook` | Generation requests | URL-encoded HTTPS endpoint that receives the result when the request finishes. See [Webhooks](https://docs.higgsfield.ai/docs/how-to/webhooks.md). |

## Response headers

| Header | Returned | Description |
| - | - | - |
| `X-Correlation-ID` | Every response | Identifier Higgsfield assigns to this API call. Record it with the `request_id` and include both when contacting [support](https://docs.higgsfield.ai/docs/help/support.md). |
| `Retry-After` | `429` responses | Seconds to wait before retrying. See [Rate limits](https://docs.higgsfield.ai/docs/concepts/rate-limits.md). |
| `Cache-Control: no-store` | `403` responses for a disabled or expired API key | Do not cache the error. |

## Webhook delivery headers

Sent by Higgsfield with every [webhook](https://docs.higgsfield.ai/docs/how-to/webhooks.md) delivery to your endpoint.

| Header | Description |
| - | - |
| `webhook-id` | Event identifier, the same across retries of one event. Use it to deduplicate. |
| `webhook-timestamp` | Unix time in seconds when the delivery was signed. |
| `webhook-signature` | One or more space-separated `v1,<base64>` signatures. See [Verify signatures](https://docs.higgsfield.ai/docs/how-to/webhooks.md#verify-signatures). |
| `X-Webhook-Secret-Key` | Legacy: the secret passed with the webhook in the request body, for integrations that set one. It will be retired; verify signatures instead. |


## Related topics

- [Authentication](https://docs.higgsfield.ai/docs/authentication.md)
- [FAQ](https://docs.higgsfield.ai/docs/help/faq.md)
- [File uploads](https://docs.higgsfield.ai/docs/concepts/file-uploads.md)
- [Data retention and deletion](https://docs.higgsfield.ai/docs/enterprise/data-retention.md)
- [Webhooks](https://docs.higgsfield.ai/docs/how-to/webhooks.md)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.