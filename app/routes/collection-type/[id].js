import express from 'express';
import { getCollectionTypeById, updateCollectionType } from '../../models/CollectionType.js';
import { getIO } from '../../utils/socket.js';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const type = await getCollectionTypeById(req.params.id);
    if (!type) {
      return res.status(404).json({ error: 'Collection type not found' });
    }
    res.json(type);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const updated = await updateCollectionType(req.params.id, req.body);
    getIO().emit('collectionType:updated', updated);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
