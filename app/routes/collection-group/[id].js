import express from 'express';
import { getCollectionGroupById, updateCollectionGroup } from '../../models/CollectionGroup.js';

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  try {
    const group = await getCollectionGroupById(req.params.id);
    if (!group) {
      return res.status(404).json({ error: 'Collection group not found' });
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const updated = await updateCollectionGroup(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
