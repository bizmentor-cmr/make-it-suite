> ## Documentation Index
> Fetch the complete documentation index at: https://docs.higgsfield.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Client libraries

> Use the official Python and TypeScript SDKs.

Official SDKs handle authentication, submission, polling, cancellation, and file uploads. Use them only in trusted server-side environments.

> [card] [Python](https://github.com/higgsfield-ai/higgsfield-client)
>
> Synchronous and asynchronous APIs for Python 3.8+.

> [card] [Node.js and TypeScript](https://github.com/higgsfield-ai/higgsfield-js)
>
> Typed server-side client with automatic polling and retries.

## Python

### Install

```bash theme={"theme":{"light":"github-light","dark":"github-dark"}}
pip install higgsfield-client
```

### Configure credentials

```bash theme={"theme":{"light":"github-light","dark":"github-dark"}}
export HF_KEY="your-api-key-id:your-api-key-secret"
```

### Submit and wait

```python Synchronous theme={"theme":{"light":"github-light","dark":"github-dark"}}
import higgsfield_client

result = higgsfield_client.subscribe(
    "higgsfield-ai/soul/v2/standard",
    arguments={
        "prompt": "Editorial portrait in soft daylight",
    },
)

print(result["images"][0]["url"])
```

```python Asynchronous theme={"theme":{"light":"github-light","dark":"github-dark"}}
import asyncio

import higgsfield_client


async def main():
    result = await higgsfield_client.subscribe_async(
        "higgsfield-ai/soul/v2/standard",
        arguments={
            "prompt": "Editorial portrait in soft daylight",
        },
    )
    print(result["images"][0]["url"])


asyncio.run(main())
```

Use `submit` or `submit_async` when you need a request controller for explicit polling, status checks, or cancellation. The Python SDK also provides `upload`, `upload_file`, and `upload_image` helpers.

## Node.js and TypeScript

### Install

```bash theme={"theme":{"light":"github-light","dark":"github-dark"}}
npm install @higgsfield/client
```

### Configure credentials

```bash theme={"theme":{"light":"github-light","dark":"github-dark"}}
export HF_CREDENTIALS="your-api-key-id:your-api-key-secret"
```

### Submit and wait

```typescript theme={"theme":{"light":"github-light","dark":"github-dark"}}
import { config, higgsfield } from "@higgsfield/client/v2";

config({
  credentials: process.env.HF_CREDENTIALS,
});

const result = await higgsfield.subscribe(
  "higgsfield-ai/soul/v2/standard",
  {
    input: {
      prompt: "Editorial portrait in soft daylight",
    },
    withPolling: true,
  },
);

if (result.status === "completed") {
  console.log(result.images?.[0]?.url);
}
```

The v2 TypeScript client is server-side only and blocks browser use to prevent credential exposure.

## Choose an integration style

| Requirement | Recommended API |
| - | - |
| Script or prototype | `subscribe` / `subscribe_async` |
| Worker with explicit lifecycle control | `submit` / `submit_async` |
| Existing request ID | `status`, `result`, or `cancel` |
| Production event-driven integration | Submit with a webhook and keep status polling as recovery |

See the [Python SDK repository](https://github.com/higgsfield-ai/higgsfield-client) and [TypeScript SDK repository](https://github.com/higgsfield-ai/higgsfield-js) for the complete client APIs.


## Related topics

- [FAQ](https://docs.higgsfield.ai/docs/help/faq.md)
- [Support](https://docs.higgsfield.ai/docs/help/support.md)
- [Webhooks](https://docs.higgsfield.ai/docs/how-to/webhooks.md)
- [Webhook security](https://docs.higgsfield.ai/docs/enterprise/webhook-security.md)
- [Rate limits](https://docs.higgsfield.ai/docs/concepts/rate-limits.md)


This documentation is built and hosted on [Mintlify](https://mintlify.com), a developer documentation platform.