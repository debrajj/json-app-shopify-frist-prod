# Deploy Navigation to Shopify Admin

## The navigation is configured but needs to be deployed to Shopify.

### Method 1: Using Shopify CLI (Recommended)

Run this command to deploy your app configuration:

```bash
shopify app deploy
```

Or if you need to push the config only:

```bash
shopify app config push
```

### Method 2: Manual Configuration in Partner Dashboard

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com/)
2. Select your app: **collection-manager**
3. Go to **Configuration** → **App setup**
4. Scroll to **App navigation** section
5. Click **Add link** for each section:

   **Link 1:**
   - Label: `Collections`
   - Destination: `/collections`

   **Link 2:**
   - Label: `Collection Groups`
   - Destination: `/collection-groups`

   **Link 3:**
   - Label: `Collection Lists`
   - Destination: `/collection-lists`

   **Link 4:**
   - Label: `Collection Types`
   - Destination: `/collection-types`

6. Click **Save**

### Method 3: Update via API

If you have the app ID, you can update via Shopify Partners API, but CLI is easier.

### After Deployment

1. Go to your Shopify Admin: `https://testing-appx.myshopify.com/admin`
2. Click on **Apps** in the sidebar
3. Click on your **Collection Manager** app
4. You should now see the 4 navigation links in the left sidebar

### Troubleshooting

If navigation still doesn't appear:
- Make sure your app is installed in the store
- Reinstall the app if needed
- Clear browser cache
- Check that `embedded = true` in shopify.app.toml
