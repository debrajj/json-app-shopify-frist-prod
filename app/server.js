import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import cors from 'cors';
import { connectDB } from './models/mongodb.js';
import { setIO } from './utils/socket.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.ADMIN_PANEL_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

setIO(io);

// Use memory storage for Vercel (serverless environment)
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

app.use(cors({
  origin: process.env.ADMIN_PANEL_URL || '*'
}));
app.use(express.json());

// Serve static files with absolute path for Vercel
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(join(__dirname, '../public')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const PORT = process.env.PORT || 4000;

// Import routes
import collectionRoutes from './routes/collection/index.js';
import collectionNewRoute from './routes/collection/new.js';
import collectionEditRoute from './routes/collection/[id].js';
import collectionGroupRoutes from './routes/collection-group/index.js';
import collectionGroupNewRoute from './routes/collection-group/new.js';
import collectionGroupEditRoute from './routes/collection-group/[id].js';
import collectionListRoutes from './routes/collection-list/index.js';
import collectionListNewRoute from './routes/collection-list/new.js';
import collectionListEditRoute from './routes/collection-list/[id].js';
import collectionTypeRoutes from './routes/collection-type/index.js';
import collectionTypeNewRoute from './routes/collection-type/new.js';
import collectionTypeEditRoute from './routes/collection-type/[id].js';
import uploadRoute from './routes/upload.js';

// Collection routes
app.use('/api/collections/new', collectionNewRoute);
app.use('/api/collections/:id', collectionEditRoute);
app.use('/api/collections', collectionRoutes);

// Collection Group routes
app.use('/api/collection-groups/new', collectionGroupNewRoute);
app.use('/api/collection-groups/:id', collectionGroupEditRoute);
app.use('/api/collection-groups', collectionGroupRoutes);

// Collection List routes
app.use('/api/collection-lists/new', collectionListNewRoute);
app.use('/api/collection-lists/:id', collectionListEditRoute);
app.use('/api/collection-lists', collectionListRoutes);

// Collection Type routes
app.use('/api/collection-types/new', collectionTypeNewRoute);
app.use('/api/collection-types/:id', collectionTypeEditRoute);
app.use('/api/collection-types', collectionTypeRoutes);

// Upload route
app.use('/api/upload', upload.single('image'), uploadRoute);

// Serve HTML pages - single app with navigation
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/app.html'));
});

app.get('/collections', (req, res) => {
  res.sendFile(join(__dirname, '../public/app.html'));
});

app.get('/collection-groups', (req, res) => {
  res.sendFile(join(__dirname, '../public/app.html'));
});

app.get('/collection-lists', (req, res) => {
  res.sendFile(join(__dirname, '../public/app.html'));
});

app.get('/collection-types', (req, res) => {
  res.sendFile(join(__dirname, '../public/app.html'));
});

// Top navigation pages
app.get('/templates', (req, res) => {
  res.sendFile(join(__dirname, '../public/templates.html'));
});

app.get('/settings', (req, res) => {
  res.sendFile(join(__dirname, '../public/settings.html'));
});

// Initialize database and start server
async function startServer() {
  try {
    await connectDB();
    console.log('MongoDB connected');
    
    // Only start server if not in Vercel environment
    if (process.env.VERCEL !== '1') {
      httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err);
  }
}

startServer();

// Export for Vercel
export default app;
