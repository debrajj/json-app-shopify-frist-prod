import { getDB } from './mongodb.js';

const COLLECTION_NAME = 'collection_types';

export const CollectionTypeSchema = {
  id: 0,
  name: '',
  identifier: ''
};

export async function getAllCollectionTypes() {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).find({}).toArray();
}

export async function getCollectionTypeById(id) {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).findOne({ id: parseInt(id) });
}

export async function createCollectionType(data) {
  const db = getDB();
  const types = await getAllCollectionTypes();
  const newId = types.length > 0 ? Math.max(...types.map(t => t.id)) + 1 : 1;
  
  const newType = { ...CollectionTypeSchema, ...data, id: newId };
  await db.collection(COLLECTION_NAME).insertOne(newType);
  return newType;
}

export async function updateCollectionType(id, data) {
  const db = getDB();
  await db.collection(COLLECTION_NAME).updateOne(
    { id: parseInt(id) },
    { $set: data }
  );
  return await getCollectionTypeById(id);
}

export async function deleteCollectionType(id) {
  const db = getDB();
  await db.collection(COLLECTION_NAME).deleteOne({ id: parseInt(id) });
}
