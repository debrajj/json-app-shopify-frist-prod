# Shopify Collection Manager

Manage Collection data (Collection, Group, List, Type) inside Shopify Admin with MongoDB storage and Shopify CDN for media.

## Features

- **Data Storage**: MongoDB + JSON backup files
- **Media Storage**: Shopify CDN via GraphQL API
- **Real-time Updates**: Socket.io for instant sync
- **CRUD Operations**: Full create, read, update, delete for all entities

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
   - MongoDB connection string
   - Shopify API credentials
   - Server settings

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Collections
- `GET /api/collection` - List all collections
- `POST /api/collection/new` - Create new collection
- `GET /api/collection/:id` - Get collection by ID
- `PUT /api/collection/:id` - Update collection
- `DELETE /api/collection/:id` - Delete collection

### Collection Groups
- `GET /api/collection-group` - List all groups
- `POST /api/collection-group/new` - Create new group
- `GET /api/collection-group/:id` - Get group by ID
- `PUT /api/collection-group/:id` - Update group
- `DELETE /api/collection-group/:id` - Delete group

### Collection Lists
- `GET /api/collection-list` - List all lists
- `POST /api/collection-list/new` - Create new list
- `GET /api/collection-list/:id` - Get list by ID
- `PUT /api/collection-list/:id` - Update list
- `DELETE /api/collection-list/:id` - Delete list

### Collection Types
- `GET /api/collection-type` - List all types
- `POST /api/collection-type/new` - Create new type
- `GET /api/collection-type/:id` - Get type by ID
- `PUT /api/collection-type/:id` - Update type
- `DELETE /api/collection-type/:id` - Delete type

### Upload
- `POST /api/upload` - Upload image to Shopify CDN

## Data Models

### Collection
```json
{
  "id": 1,
  "name": "",
  "link": "",
  "collection_type": "",
  "shopifyId": "",
  "collection_lists": [],
  "style": "",
  "isScrollable": false,
  "collection_groups": [],
  "image": "",
  "horizontal": false,
  "column": 1,
  "button": { "text": "", "link": "" }
}
```

### Collection Group
```json
{
  "id": 1,
  "reference": "",
  "name": "",
  "collections": [],
  "style": "",
  "page_builders": [],
  "background_image": "",
  "additionalData": {}
}
```

### Collection List
```json
{
  "id": 1,
  "name": "",
  "images": [],
  "reference": "",
  "text_1": "",
  "text_2": "",
  "text_3": "",
  "link": "",
  "shopifyId": "",
  "collections": [],
  "style": "",
  "media": {},
  "additionalData": {}
}
```

### Collection Type
```json
{
  "id": 1,
  "name": "",
  "identifier": ""
}
```

## Socket.io Events

- `collection:created` - New collection created
- `collection:updated` - Collection updated
- `collection:deleted` - Collection deleted
- `collectionGroup:created` - New group created
- `collectionGroup:updated` - Group updated
- `collectionGroup:deleted` - Group deleted
- `collectionList:created` - New list created
- `collectionList:updated` - List updated
- `collectionList:deleted` - List deleted
- `collectionType:created` - New type created
- `collectionType:updated` - Type updated
- `collectionType:deleted` - Type deleted
