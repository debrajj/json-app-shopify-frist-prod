import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { createCollection } = await import('../../models/Collection.js');
    const { getIO } = await import('../../utils/socket.js');
    
    const newCollection = await createCollection(req.body);
    getIO().emit('collection:created', newCollection);
    res.json(newCollection);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
