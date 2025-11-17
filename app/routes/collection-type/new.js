import express from 'express';
import { createCollectionType } from '../../models/CollectionType.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newType = await createCollectionType(req.body);
    res.json(newType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
