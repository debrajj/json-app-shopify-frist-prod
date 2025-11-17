import express from 'express';
import { getAllCollectionGroups, deleteCollectionGroup } from '../../models/CollectionGroup.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const groups = await getAllCollectionGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteCollectionGroup(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
