> ## Documentation Index
> Fetch the complete documentation index at: https://docs.higgsfield.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Idempotent requests

> Retry generation submissions safely without creating duplicate requests.

Generation submissions accept an optional `Idempotency-Key` header. Use it when a network failure or timeout leaves you unsure whether a request was accepted.

Generate one unique key for each intended generation and keep it until you receive the initial response:

```bash theme={"theme":{"light":"github-light","dark":"github-dark"}}
export IDEMPOTENCY_KEY=$(uuidgen | tr '[:upper:]' '[:lower:]')

curl --request POST \
  --url https://api.higgsfield.ai/higgsfield-ai/soul/v2/standard \
  --header "Authorization: Key ${HF_API_KEY_ID}:${HF_API_KEY_SECRET}" \
  --header "Content-Type: application/json" \
  --header "Idempotency-Key: ${IDEMPOTENCY_KEY}" \
  --data '{
    "prompt": "A quiet alpine lake at sunrise, editorial photography"
  }'
```

If the response is lost, repeat the same request with the same key. Higgsfield returns the original `request_id` without creating or charging for another generation.

## Key rules

* Keys must contain 1–255 visible ASCII characters without whitespace. UUIDs are recommended.
* A key identifies one generation intent within your account. API key rotation does not change that identity.
* Reuse the key only when the endpoint, JSON body, webhook, and [`Hf-Expires-After`](https://docs.higgsfield.ai/docs/enterprise/data-retention) header are unchanged.
* JSON object field order does not matter. Array order, omitted fields, explicit `null` values, and different URLs do matter.
* A completed, failed, NSFW, or canceled request keeps its identity. Retrying does not restart it.
* A request rejected before acceptance, such as an authentication or validation failure, does not consume the key.

> [!WARNING]
>
> Create a new key when you deliberately want a new generation, even if its parameters are identical to an earlier request.

## Parameter mismatch

Reusing a key with different request parameters returns `422 Unprocessable Entity`:

```json theme={"theme":{"light":"github-light","dark":"github-dark"}}
{
  "detail": "Idempotency-Key was already used with different request parameters"
}
```

Do not handle this response by generating a new key automatically. First determine whether the changed request represents a deliberate new generation or a client bug.

## Retry after an ambiguous failure

1. Create the key before sending the generation request.
2. Store the key with your local operation or job record.
3. After a network error, timeout, or `5xx`, retry the same endpoint and parameters with the same key.
4. Store the returned `request_id` and use its `status_url` for subsequent checks.

The replay response is an acceptance receipt and can contain `"status": "queued"` even when the original request has already finished. Read `status_url` for its current status and output.

Idempotency keys apply to generation submission endpoints in the Model API reference. Status polling, cancellation, uploads, estimates, and webhook deliveries use their existing retry behavior.


## Related topics

- [Recraft V4.1 Pro — Text to image API](https://docs.higgsfield.ai/docs/models/recraft-v4-1-pro/generate.md)
- [Recraft V4.1 Utility Pro — Text to image API](https://docs.higgsfield.ai/docs/models/recraft-v4-1-utility-pro/text-to-image.md)
- [Recraft V4.1 Utility — Text to image API](https://docs.higgsfield.ai/docs/models/recraft-v4-1-utility/text-to-image.md)
- [Recraft V4.1 — Text to image API](https://docs.higgsfield.ai/docs/models/recraft-v4-1/text-to-image.md)
- [Wan 3.0 — Reference to video API](https://docs.higgsfield.ai/docs/models/wan-3/reference-to-video.md)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.