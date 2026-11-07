> ## Documentation Index
> Fetch the complete documentation index at: https://docs.higgsfield.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Authentication

> Authenticate server-side API requests with your Higgsfield key and secret.

Create and manage API credentials in [Higgsfield Console](https://console.higgsfield.ai). Each credential consists of a key ID and a secret.

## Authorization header

Send both values in the `Authorization` header:

```http theme={"theme":{"light":"github-light","dark":"github-dark"}}
Authorization: Key YOUR_KEY_ID:YOUR_KEY_SECRET
```

```bash theme={"theme":{"light":"github-light","dark":"github-dark"}}
curl https://api.higgsfield.ai/requests/REQUEST_ID/status \
  --header "Authorization: Key ${HF_API_KEY_ID}:${HF_API_KEY_SECRET}"
```

The API also accepts the legacy `hf-api-key` and `hf-secret` headers. New integrations should use the `Authorization` header.

## Keep credentials server-side

> [!WARNING]
>
> Do not call the API directly from browser or mobile application code. Anyone who can inspect the application can extract its API secret and use your account.

* Store credentials in a secrets manager or encrypted environment variables.
* Use separate credentials for development and production.
* Never include credentials in URLs, logs, screenshots, or support messages.
* Rotate a credential immediately if it may have been exposed.

## Authentication errors

Missing, malformed, or invalid credentials return `401 Unauthorized`:

```json theme={"theme":{"light":"github-light","dark":"github-dark"}}
{
  "detail": "Invalid credentials"
}
```

Authentication identifies the account, but individual models may have separate access restrictions. A model unavailable to the authenticated account can return `404`, `423`, or `503` depending on its operational state.


## Related topics

- [FAQ](https://docs.higgsfield.ai/docs/help/faq.md)
- [How the API works](https://docs.higgsfield.ai/docs/how-to/introduction.md)
- [Recraft V4.1 Pro — Text to image API](https://docs.higgsfield.ai/docs/models/recraft-v4-1-pro/generate.md)
- [Recraft V4.1 Utility Pro — Text to image API](https://docs.higgsfield.ai/docs/models/recraft-v4-1-utility-pro/text-to-image.md)
- [Recraft V4.1 Utility — Text to image API](https://docs.higgsfield.ai/docs/models/recraft-v4-1-utility/text-to-image.md)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.