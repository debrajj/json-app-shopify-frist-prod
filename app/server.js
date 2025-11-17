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

// Initialize routes after io is set
async function startServer() {
  try {
    await connectDB();
    
    // Import routes dynamically after io is initialized
    const collectionRoutes = (await import('./routes/collection/index.js')).default;
    const collectionNewRoute = (await import('./routes/collection/new.js')).default;
    const collectionEditRoute = (await import('./routes/collection/[id].js')).default;
    const collectionGroupRoutes = (await import('./routes/collection-group/index.js')).default;
    const collectionGroupNewRoute = (await import('./routes/collection-group/new.js')).default;
    const collectionGroupEditRoute = (await import('./routes/collection-group/[id].js')).default;
    const collectionListRoutes = (await import('./routes/collection-list/index.js')).default;
    const collectionListNewRoute = (await import('./routes/collection-list/new.js')).default;
    const collectionListEditRoute = (await import('./routes/collection-list/[id].js')).default;
    const collectionTypeRoutes = (await import('./routes/collection-type/index.js')).default;
    const collectionTypeNewRoute = (await import('./routes/collection-type/new.js')).default;
    const collectionTypeEditRoute = (await import('./routes/collection-type/[id].js')).default;
    const uploadRoute = (await import('./routes/upload.js')).default;

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

    // Only start server if not in Vercel environment
    if (process.env.VERCEL !== '1') {
      httpServer.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`MongoDB connected`);
      });
    }
  } catch (err) {
    console.error('Failed to start server:', err);
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
  }
}

startServer();

// Export for Vercel
export default app;
