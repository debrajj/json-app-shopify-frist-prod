import { getDB } from './mongodb.js';

const COLLECTION_NAME = 'collection_lists';

export const CollectionListSchema = {
  id: 0,
  name: '',
  images: [],
  reference: '',
  text_1: '',
  text_2: '',
  text_3: '',
  link: '',
  shopifyId: '',
  collections: [],
  style: '',
  media: {},
  additionalData: {}
};

export async function getAllCollectionLists() {
  const db = await getDB();
  return await db.collection(COLLECTION_NAME).find({}).toArray();
}

export async function getCollectionListById(id) {
  const db = await getDB();
  return await db.collection(COLLECTION_NAME).findOne({ id: parseInt(id) });
}

export async function createCollectionList(data) {
  const db = await getDB();
  const lists = await getAllCollectionLists();
  const newId = lists.length > 0 ? Math.max(...lists.map(l => l.id)) + 1 : 1;
  
  const newList = { ...CollectionListSchema, ...data, id: newId };
  await db.collection(COLLECTION_NAME).insertOne(newList);
  return newList;
}

export async function updateCollectionList(id, data) {
  const db = await getDB();
  await db.collection(COLLECTION_NAME).updateOne(
    { id: parseInt(id) },
    { $set: data }
  );
  return await getCollectionListById(id);
}

export async function deleteCollectionList(id) {
  const db = await getDB();
  await db.collection(COLLECTION_NAME).deleteOne({ id: parseInt(id) });
}
