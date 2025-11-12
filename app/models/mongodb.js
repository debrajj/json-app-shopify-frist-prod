import { MongoClient } from 'mongodb';

let client;
let db;

export async function connectDB() {
  if (db) return db;
  
  client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db();
  console.log('MongoDB connected');
  return db;
}

export function getDB() {
  if (!db) throw new Error('Database not connected');
  return db;
}

export async function closeDB() {
  if (client) await client.close();
}
