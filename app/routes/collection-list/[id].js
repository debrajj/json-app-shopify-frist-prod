import express from 'express';
import { getCollectionListById, updateCollectionList } from '../../models/CollectionList.js';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const list = await getCollectionListById(req.params.id);
    if (!list) {
      return res.status(404).json({ error: 'Collection list not found' });
    }
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const updated = await updateCollectionList(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
