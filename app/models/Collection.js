import { getDB } from './mongodb.js';

const COLLECTION_NAME = 'collections';

export const CollectionSchema = {
  id: 0,
  name: '',
  link: '',
  collection_type: '',
  shopifyId: '',
  collection_lists: [],
  style: '',
  isScrollable: false,
  collection_groups: [],
  image: '',
  horizontal: false,
  column: 1,
  button: {
    text: '',
    link: ''
  }
};

export async function getAllCollections() {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).find({}).toArray();
}

export async function getCollectionById(id) {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).findOne({ id: parseInt(id) });
}

export async function createCollection(data) {
  const db = getDB();
  const collections = await getAllCollections();
  const newId = collections.length > 0 ? Math.max(...collections.map(c => c.id)) + 1 : 1;
  
  const newCollection = { ...CollectionSchema, ...data, id: newId };
  await db.collection(COLLECTION_NAME).insertOne(newCollection);
  return newCollection;
}

export async function updateCollection(id, data) {
  const db = getDB();
  await db.collection(COLLECTION_NAME).updateOne(
    { id: parseInt(id) },
    { $set: data }
  );
  return await getCollectionById(id);
}

export async function deleteCollection(id) {
  const db = getDB();
  await db.collection(COLLECTION_NAME).deleteOne({ id: parseInt(id) });
}
