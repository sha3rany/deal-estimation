import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 3001;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const cleanUrl = req.url.split('?')[0];
  let filePath = path.join(DIST_DIR, cleanUrl === '/' ? 'index.html' : cleanUrl);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(res);
});

const wss = new WebSocketServer({ server });
const rooms = new Map();

wss.on('connection', (ws) => {
  ws.roomCode = null;
  ws.peerId = null;

  ws.on('message', (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === 'join') {
        ws.roomCode = msg.roomCode;
        ws.peerId = msg.peerId;
        if (!rooms.has(ws.roomCode)) rooms.set(ws.roomCode, new Set());
        rooms.get(ws.roomCode).add(ws);
      }

      if (ws.roomCode && rooms.has(ws.roomCode)) {
        for (const client of rooms.get(ws.roomCode)) {
          if (client !== ws && client.readyState === 1) {
            if (!msg.targetPeerId || msg.targetPeerId === client.peerId) {
              client.send(JSON.stringify(msg));
            }
          }
        }
      }
    } catch (err) {
      console.error('WS error:', err.message);
    }
  });

  ws.on('close', () => {
    if (ws.roomCode && rooms.has(ws.roomCode)) {
      const room = rooms.get(ws.roomCode);
      room.delete(ws);
      if (room.size === 0) rooms.delete(ws.roomCode);
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Deal Estimation running on port ${PORT}`);
});
