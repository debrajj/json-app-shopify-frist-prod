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

const upload = multer({ dest: 'public/assets/' });

app.use(cors({
  origin: process.env.ADMIN_PANEL_URL || '*'
}));
app.use(express.json());
app.use(express.static('public'));

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

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`MongoDB connected`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
