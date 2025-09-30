require('dotenv').config();
const path = require('path');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const db = require('./server/db');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CORS_ORIGIN || '*' }
});

// segurança
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '256kb' }));
app.use(rateLimit({ windowMs: 10 * 1000, max: 100 }));

// estáticos do overlay
app.use(express.static(path.join(__dirname, 'client', 'public')));

// helper p/ sanitizar __proto__/constructor/prototype
function safeClone(obj) {
  return JSON.parse(JSON.stringify(obj, (k, v) => {
    if (k === '__proto__' || k === 'constructor' || k === 'prototype') return undefined;
    return v;
  }));
}

// Endpoint do GameState Integration (CS:GO/CS2)
app.post('/gsi', (req, res) => {
  const payload = safeClone(req.body || {});
  const map = payload?.map?.name || null;
  const mode = payload?.map?.mode || null;
  const matchId = payload?.matchid || payload?.provider?.timestamp || 'default';

  db.createMatch({ id: matchId, map, mode });
  db.addEvent({ matchId, type: 'gsi', data: payload });

  // Stats resumidos para o HUD
  const ms = payload?.player?.match_stats || {};
  const state = payload?.player?.state || {};
  const stats = {
    kills: Number(ms.kills ?? 0),
    deaths: Number(ms.deaths ?? 0),
    mvps: Number(ms.mvps ?? 0),
    assists: Number(ms.assists ?? 0),
    score: Number(ms.score ?? 0),
    money: Number(state.money ?? 0)
  };
  db.addStats(matchId, stats);

  io.emit('gsi:update', { matchId, map, mode, payload });
  io.emit('stats:update', { matchId, ...stats });

  res.status(204).end();
});

// histórico (opcional)
app.get('/api/matches/:id/events', (req, res) => {
  res.json(db.lastEvents(req.params.id, Number(req.query.limit) || 50));
});

// simples hello
app.get('/healthz', (_req, res) => res.json({ ok: true }));

io.on('connection', socket => {
  socket.emit('hello', { ok: true });
});

const PORT = Number(process.env.PORT) || 3000;
server.listen(PORT, () => {
  console.log(`Overlay up at http://localhost:${PORT}`);
});
