> ## Documentation Index
> Fetch the complete documentation index at: https://docs.higgsfield.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Billing and retention

> Understand charging, refunds, estimation, and output retention.

Higgsfield charges successful generation requests to your account balance. The exact cost depends on the selected model and parameters.

## Balance expiration

Funds added to your account balance expire one year after they are added. Plan purchases and usage with this expiration period in mind.

## Estimate a request

Use the estimate endpoint with the same model parameters before submitting generation:

```bash theme={"theme":{"light":"github-light","dark":"github-dark"}}
curl --request POST \
  --url https://api.higgsfield.ai/estimate/higgsfield-ai/soul/v2/standard \
  --header "Authorization: Key ${HF_API_KEY_ID}:${HF_API_KEY_SECRET}" \
  --header "Content-Type: application/json" \
  --data '{
    "prompt": "Editorial portrait in soft daylight"
  }'
```

```json theme={"theme":{"light":"github-light","dark":"github-dark"}}
{
  "usd": "0.094"
}
```

> [!NOTE]
>
> The values above illustrate the response format. Use the estimate returned for your authenticated account as the authoritative amount.

## Failed and moderated requests

Requests ending as `failed` or `nsfw` are not charged. If an amount was reserved when the request was accepted, it is refunded automatically.

## Canceled requests

A request can be canceled only before processing starts. A successfully canceled queued request is refunded.

## Output retention

Request files are kept for seven days after the request finishes, then deleted. The status response and the webhook include `expires_at`, the time of deletion. Download completed files to your own storage for long-term retention.

To keep data for less time, send the `Hf-Expires-After` header (one hour or more) or ask Higgsfield to set a retention period for your account. To remove a finished request immediately, call `DELETE /requests/{request_id}`. Billing records are kept in both cases. See [Data retention and deletion](https://docs.higgsfield.ai/docs/enterprise/data-retention.md).


## Related topics

- [Data retention and deletion](https://docs.higgsfield.ai/docs/enterprise/data-retention.md)
- [FAQ](https://docs.higgsfield.ai/docs/help/faq.md)
- [Organizations and roles](https://docs.higgsfield.ai/docs/enterprise/organizations.md)
- [Delete request data](https://docs.higgsfield.ai/docs/api-reference/requests/delete-request-data.md)
- [Usage and billing](https://docs.higgsfield.ai/docs/enterprise/usage-and-billing.md)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.