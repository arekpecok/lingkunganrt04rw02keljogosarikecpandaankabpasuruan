import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const isProd = process.env.NODE_ENV === 'production';
  const DB_PATH = path.resolve(__dirname, 'data', 'db.json');

  // Allow larger payload for images in gallery / UMKM
  app.use(express.json({ limit: '25mb' }));

  // API Endpoint to get all resident information
  app.get('/api/data', (_req, res) => {
    try {
      if (fs.existsSync(DB_PATH)) {
        const raw = fs.readFileSync(DB_PATH, 'utf-8');
        return res.json(JSON.parse(raw));
      }
      return res.status(404).json({ error: 'Database not initialized' });
    } catch (err) {
      console.error('Error reading db.json:', err);
      return res.status(500).json({ error: 'Failed to read data' });
    }
  });

  // API Endpoint to save all resident information directly to internal AI Studio file
  app.post('/api/data', (req, res) => {
    try {
      const data = req.body;
      data.updatedAt = new Date().toISOString();
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
      return res.json({ success: true, savedAt: data.updatedAt });
    } catch (err) {
      console.error('Error saving db.json:', err);
      return res.status(500).json({ error: 'Failed to save data' });
    }
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
