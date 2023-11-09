# shopify-order-proxy

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/greimela/shopify-order-proxy)

This is a lightweight proxy for BTCPayServer and Shopify. It ensures that BTCPayServer is not able to fetch Personal Identifiable Information (PII) using the order permissions it requires.

To use it, deploy it to Cloudflare Workers using the button above.
Then head over to Cloudflare and input three secrets:

- SHOPIFY_API_KEY: Your Shopify API key
- SHOPIFY_ADMIN_API_SECRET: Your Shopify Admin secret
- PROXY_SECRET: A secret you generate to protect access to this proxy
