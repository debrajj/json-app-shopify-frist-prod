import express from 'express';
import { createCollectionList } from '../../models/CollectionList.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newList = await createCollectionList(req.body);
    res.json(newList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
