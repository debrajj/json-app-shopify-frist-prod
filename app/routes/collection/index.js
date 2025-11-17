import express from 'express';
import { getAllCollections, deleteCollection } from '../../models/Collection.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    console.log('Fetching collections...');
    const collections = await getAllCollections();
    console.log(`Found ${collections.length} collections`);
    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteCollection(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
