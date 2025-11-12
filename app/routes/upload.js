import express from 'express';
import { uploadToShopifyCDN } from '../utils/shopify.js';
import { readFile, unlink } from 'fs/promises';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileBuffer = await readFile(req.file.path);
    const fileData = {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      buffer: fileBuffer
    };

    const cdnUrl = await uploadToShopifyCDN(fileData);
    
    await unlink(req.file.path);
    
    res.json({ url: cdnUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
