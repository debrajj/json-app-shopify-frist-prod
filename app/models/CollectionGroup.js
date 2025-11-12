import { getDB } from './mongodb.js';

const COLLECTION_NAME = 'collection_groups';

export const CollectionGroupSchema = {
  id: 0,
  reference: '',
  name: '',
  collections: [],
  style: '',
  page_builders: [],
  background_image: '',
  additionalData: {}
};

export async function getAllCollectionGroups() {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).find({}).toArray();
}

export async function getCollectionGroupById(id) {
  const db = getDB();
  return await db.collection(COLLECTION_NAME).findOne({ id: parseInt(id) });
}

export async function createCollectionGroup(data) {
  const db = getDB();
  const groups = await getAllCollectionGroups();
  const newId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;
  
  const newGroup = { ...CollectionGroupSchema, ...data, id: newId };
  await db.collection(COLLECTION_NAME).insertOne(newGroup);
  return newGroup;
}

export async function updateCollectionGroup(id, data) {
  const db = getDB();
  await db.collection(COLLECTION_NAME).updateOne(
    { id: parseInt(id) },
    { $set: data }
  );
  return await getCollectionGroupById(id);
}

export async function deleteCollectionGroup(id) {
  const db = getDB();
  await db.collection(COLLECTION_NAME).deleteOne({ id: parseInt(id) });
}
