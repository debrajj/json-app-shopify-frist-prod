import express from 'express';
import { getAllCollectionLists, deleteCollectionList } from '../../models/CollectionList.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const lists = await getAllCollectionLists();
    res.json(lists);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteCollectionList(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
