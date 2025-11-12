import express from 'express';
import { createCollectionGroup } from '../../models/CollectionGroup.js';
import { getIO } from '../../utils/socket.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newGroup = await createCollectionGroup(req.body);
    getIO().emit('collectionGroup:created', newGroup);
    res.json(newGroup);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
