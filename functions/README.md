# Writing Feed Serverless Function

This function provides cached access to YouTube and GoodGrow feeds, avoiding CORS proxy issues in production.

## Usage

- `GET /api/writing-feed?source=youtube` - Returns latest YouTube video
- `GET /api/writing-feed?source=goodgrow` - Returns latest GoodGrow project

## Caching

- Responses are cached for **10 minutes** (600 seconds)
- Cache is in-memory (per instance)
- Headers include `Cache-Control` and `X-Cache` (HIT/MISS)

## Deployment

### Koyeb

The function is configured in `koyeb.yaml`. Koyeb will automatically deploy it when you push.

### Other Platforms

- **Netlify**: Place in `netlify/functions/writing-feed.js` and export as `exports.handler`
- **Vercel**: Place in `api/writing-feed.js` and export as default
- **Cloudflare Workers**: Adapt the handler to Cloudflare's Request/Response format

## Fallback

The frontend falls back to CORS proxies if the serverless function fails, so the feed still works even if the function isn't deployed.
