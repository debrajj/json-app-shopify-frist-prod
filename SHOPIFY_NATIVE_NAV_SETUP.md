# How to Add Navigation to Shopify Admin Sidebar

## The ui-nav-menu component does NOT create Shopify Admin sidebar navigation

The `ui-nav-menu` web component creates navigation **inside your app**, not in Shopify's main admin sidebar.

## To get navigation in Shopify Admin's native sidebar:

### Option 1: Use App Bridge Actions (Recommended)

Add this JavaScript to initialize navigation programmatically:

```javascript
import createApp from '@shopify/app-bridge';
import { NavigationMenu } from '@shopify/app-bridge/actions';

const app = createApp({
  apiKey: 'YOUR_API_KEY',
  host: host,
});

const navigationMenu = NavigationMenu.create(app, {
  items: [
    {
      label: 'Collections',
      destination: '/collections',
    },
    {
      label: 'Collection Groups',
      destination: '/collection-groups',
    },
    {
      label: 'Collection Lists',
      destination: '/collection-lists',
    },
    {
      label: 'Collection Types',
      destination: '/collection-types',
    },
  ],
});
```

### Option 2: Configure in shopify.app.toml (If supported)

Some Shopify CLI versions support this:

```toml
[[app.navigation]]
label = "Collections"
destination = "/collections"

[[app.navigation]]
label = "Collection Groups"
destination = "/collection-groups"

[[app.navigation]]
label = "Collection Lists"
destination = "/collection-lists"

[[app.navigation]]
label = "Collection Types"
destination = "/collection-types"
```

Then run: `shopify app deploy`

### Option 3: Partner Dashboard (Legacy - Being Deprecated)

1. Go to Shopify Partner Dashboard
2. Select your app
3. Configuration → App setup
4. Add navigation links manually

**Note:** This is being deprecated in favor of App Bridge navigation.

## Current Status

Your app currently has:
- ✅ Working in-app sidebar navigation (visible inside your app)
- ❌ Shopify Admin sidebar navigation (not yet configured)

The in-app sidebar works perfectly for navigation. To add Shopify Admin sidebar navigation, you need to implement Option 1 (App Bridge Actions).
