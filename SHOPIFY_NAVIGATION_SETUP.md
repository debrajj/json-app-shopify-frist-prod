# Shopify Admin Navigation Setup

## App Navigation Structure

Add these 4 navigation links to your Shopify app configuration to display all collection management sections:

### 1. Collections
- **Label**: Collections
- **URL**: `/collections`
- **Description**: Manage main collections

### 2. Collection Groups
- **Label**: Collection Groups
- **URL**: `/collection-groups`
- **Description**: Manage collection groups

### 3. Collection Lists
- **Label**: Collection Lists
- **URL**: `/collection-lists`
- **Description**: Manage collection lists

### 4. Collection Types
- **Label**: Collection Types
- **URL**: `/collection-types`
- **Description**: Manage collection types

## Configuration in shopify.app.toml

Add this to your `shopify.app.toml` file:

```toml
[app_proxy]
url = "https://your-app-url.com"
subpath = "apps/collection-manager"
prefix = "apps"

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

## Or via Partner Dashboard

1. Go to Shopify Partner Dashboard
2. Select your app
3. Navigate to "App setup" → "Embedded app"
4. Add navigation links:
   - Collections → `/collections`
   - Collection Groups → `/collection-groups`
   - Collection Lists → `/collection-lists`
   - Collection Types → `/collection-types`
