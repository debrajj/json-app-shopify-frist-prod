# Add Navigation to Shopify App - Step by Step

## Your app navigation is configured in code but needs to be added in Shopify Partner Dashboard

### Steps:

1. **Go to Shopify Partner Dashboard**
   - Visit: https://partners.shopify.com/
   - Login with: debrajecomcure@gmail.com

2. **Find Your App**
   - Click on "Apps" in the left sidebar
   - Find and click on your app: **collection-manager**
   - (Client ID: 6d5593dbc8c7a2c4691d0a7b6ea29a18)

3. **Go to Configuration**
   - Click on "Configuration" tab at the top
   - Scroll down to find **"App navigation"** section

4. **Add Navigation Links**
   
   Click **"Add link"** button and add these 4 links one by one:

   **Link 1:**
   ```
   Label: Collections
   Destination: /collections
   ```

   **Link 2:**
   ```
   Label: Collection Groups
   Destination: /collection-groups
   ```

   **Link 3:**
   ```
   Label: Collection Lists
   Destination: /collection-lists
   ```

   **Link 4:**
   ```
   Label: Collection Types
   Destination: /collection-types
   ```

5. **Save Configuration**
   - Click **"Save"** button at the top right

6. **Test in Shopify Admin**
   - Go to: https://testing-appx.myshopify.com/admin
   - Click "Apps" in sidebar
   - Click your "Collection Manager" app
   - You should now see 4 navigation links in the left sidebar!

## Important Notes:

- The navigation links will appear in the **left sidebar** when you open your app in Shopify Admin
- Each link will load the same app but show different content
- The sidebar navigation is built into the app itself (app.html)

## If Navigation Still Doesn't Show:

1. Make sure "Embedded app" is enabled in app settings
2. Try reinstalling the app in your test store
3. Clear browser cache and reload
4. Check that application_url is correct: https://shopify-json-frist-mongodb.vercel.app
