# How to See Sidebar Navigation in Shopify Admin

## Important: ui-nav-menu ONLY works inside Shopify Admin, NOT locally!

### Step 1: Open Your App in Shopify Admin

1. Go to your Shopify Admin:
   - **testing-appx**: https://testing-appx.myshopify.com/admin
   - **OR wishlist-track-new**: https://wishlist-track-new.myshopify.com/admin

2. Click **Apps** in the left sidebar

3. Find and click your **Collection Manager** app

### Step 2: Check if Navigation Appears

When the app loads inside Shopify Admin, you should see:

✅ **In Shopify's left sidebar** (under your app name):
- Collections
- Collection Groups  
- Collection Lists
- Collection Types

### Why It's Not Showing Locally

The `ui-nav-menu` component is a **Shopify-specific web component** that:
- ❌ Does NOT work on `localhost:3001`
- ❌ Does NOT work when opening the Vercel URL directly
- ✅ ONLY works when embedded in Shopify Admin iframe

### Troubleshooting

If navigation still doesn't appear in Shopify Admin:

1. **Check browser console** (F12) for errors
2. **Verify App Bridge is loaded**: Look for "App Bridge initialized" in console
3. **Check the app is embedded**: URL should have `?embedded=1&host=...`
4. **Try reinstalling the app** in your Shopify store

### Alternative: Use Shopify CLI to Test

Run this command to test with proper Shopify embedding:

```bash
shopify app dev
```

This will:
- Start your local server
- Create a tunnel to Shopify
- Open the app in Shopify Admin with proper embedding
- Navigation will work correctly

### Current Setup

Your app is configured for:
- Store: testing-appx.myshopify.com
- App URL: https://shopify-json-frist-mongodb.vercel.app
- Client ID: 6d5593dbc8c7a2c4691d0a7b6ea29a18

The navigation IS working - you just need to open it inside Shopify Admin, not directly in your browser!
