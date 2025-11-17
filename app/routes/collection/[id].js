import express from 'express';
import { getCollectionById, updateCollection } from '../../models/Collection.js';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const collection = await getCollectionById(req.params.id);
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }
    res.json(collection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const updated = await updateCollection(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
