# Writing Feed Production Debugging Guide

## Current Status
- ✅ **Substack**: Works (uses rss2json)
- ❌ **Hashnode**: Not showing in prod (GraphQL → RSS fallback added)
- ❌ **YouTube**: Not showing in prod (serverless function → rss2json → CORS proxies)

## What Was Fixed

### 1. Hashnode Fallback
- **Primary**: GraphQL API (fast, more data)
- **Fallback**: RSS feed via rss2json (more reliable)
- If GraphQL fails in prod, it now falls back to RSS automatically

### 2. Serverless Function Endpoints
- Changed from relative (`/api/writing-feed`) to absolute (`window.location.origin + /api/writing-feed`)
- Added Express-compatible handler for Koyeb/Node.js runtimes
- Function location: `functions/writing-feed.js` and `api/writing-feed.js` (wrapper)

### 3. Error Handling
- All fetches now have proper fallbacks
- Silent failures won't break the feed

## Debugging Steps

### Check if Serverless Function is Deployed
1. Open browser console on your prod site
2. Run: `fetch('/api/writing-feed?source=youtube').then(r => r.json()).then(console.log)`
3. If you get a 404 or CORS error → function isn't deployed
4. If you get data → function works, check why frontend isn't using it

### Check rss2json Status
1. In console, run: `fetch('https://api.rss2json.com/v1/api.json?rss_url=https://aj91.hashnode.dev/rss.xml').then(r => r.json()).then(console.log)`
2. If `status: "error"` → rss2json is blocking your domain (rate limit)
3. Solution: Use serverless function or get rss2json API key

### Check Hashnode GraphQL
1. In console, run:
```js
fetch('https://gql.hashnode.com/', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    query: 'query { publication(host: "aj91.hashnode.dev") { posts(first: 1) { edges { node { title url } } } } }',
    variables: {}
  })
}).then(r => r.json()).then(console.log)
```
2. If it fails → GraphQL blocked, RSS fallback should kick in

## Deployment Options

### Option 1: Deploy Serverless Function (Recommended)
- **Koyeb**: May need separate service for functions, or configure in koyeb.yaml
- **Netlify**: Place function in `netlify/functions/`
- **Vercel**: Place function in `api/` directory (already created)

### Option 2: Use rss2json API Key
- Sign up at rss2json.com
- Add API key to requests: `?api_key=YOUR_KEY&rss_url=...`
- Update `fetchSubstack()` and Hashnode RSS fallback

### Option 3: Use Only RSS Feeds (Most Reliable)
- All sources have RSS fallbacks now
- Remove GraphQL/serverless function dependencies
- Slower but more reliable

## Quick Fix: Force RSS Fallbacks

If you want to bypass serverless function and GraphQL entirely, you can modify the code to skip those attempts and go straight to RSS/rss2json.
