import express from 'express';
import { getCollectionListById, updateCollectionList } from '../../models/CollectionList.js';
import { getIO } from '../../utils/socket.js';

const router = express.Router();

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
    getIO().emit('collectionList:updated', updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
