import express from 'express';
import { getAllCollectionTypes, deleteCollectionType } from '../../models/CollectionType.js';
import { getIO } from '../../utils/socket.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const types = await getAllCollectionTypes();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteCollectionType(req.params.id);
    getIO().emit('collectionType:deleted', { id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
