import express from 'express';
import { createCollectionType } from '../../models/CollectionType.js';
import { getIO } from '../../utils/socket.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newType = await createCollectionType(req.body);
    getIO().emit('collectionType:created', newType);
    res.json(newType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
