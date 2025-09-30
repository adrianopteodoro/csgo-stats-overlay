const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(process.cwd(), 'data.db'));
db.pragma('journal_mode = WAL');

// Tabelas
db.exec(`
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY,
  created_at INTEGER NOT NULL,
  map TEXT,
  mode TEXT
);
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  type TEXT NOT NULL,
  payload TEXT NOT NULL,
  FOREIGN KEY(match_id) REFERENCES matches(id)
);
CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  match_id TEXT NOT NULL,
  ts INTEGER NOT NULL,
  kills INTEGER, deaths INTEGER, mvps INTEGER, assists INTEGER, score INTEGER, money INTEGER,
  FOREIGN KEY(match_id) REFERENCES matches(id)
);
`);

const insertMatch = db.prepare('INSERT OR IGNORE INTO matches (id, created_at, map, mode) VALUES (?, ?, ?, ?)');
const insertEvent = db.prepare('INSERT INTO events (match_id, ts, type, payload) VALUES (?, ?, ?, ?)');
const insertStats = db.prepare(`
  INSERT INTO stats (match_id, ts, kills, deaths, mvps, assists, score, money)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

module.exports = {
  createMatch({ id, map, mode }) {
    insertMatch.run(id, Date.now(), map || null, mode || null);
  },
  addEvent({ matchId, type, data }) {
    insertEvent.run(matchId, Date.now(), type, JSON.stringify(data));
  },
  lastEvents(matchId, limit = 50) {
    return db
      .prepare('SELECT * FROM events WHERE match_id = ? ORDER BY ts DESC LIMIT ?')
      .all(matchId, limit)
      .map(e => ({ ...e, payload: JSON.parse(e.payload) }));
  },
  addStats(matchId, s) {
    insertStats.run(
      matchId, Date.now(),
      s.kills ?? 0, s.deaths ?? 0, s.mvps ?? 0, s.assists ?? 0, s.score ?? 0, s.money ?? 0
    );
  }
};
