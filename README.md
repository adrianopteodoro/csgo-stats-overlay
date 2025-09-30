# 🎯 CS:GO / CS2 Stats Overlay

Um overlay simples em Node.js para exibir informações em tempo real do CS:GO / CS2, usando o **GameState Integration (GSI)**.

⚡ Mostra:
- **K/D/M** (Kills / Deaths / MVPs)  
- **K/D ratio**  
- **Money ($)**  
- **HP e Armor**  
- **Arma ativa**  
- **Mapa e modo**  

---

## 🚀 Funcionalidades

- Recebe dados via **GameState Integration** (`/gsi` endpoint).  
- Envia atualizações para o front-end via **Socket.IO**.  
- HUD leve em HTML/JS (pode ser usado como browser source no OBS).  
- Substituição segura do NeDB → **SQLite (better-sqlite3)**.  
- Inclui proteções básicas: Helmet, CORS, Rate-limit, sanitização contra *prototype pollution*.  

---

## 📦 Requisitos

- Node.js **20.x** (`.nvmrc` incluso)  
- NPM ou Yarn  
- CS:GO ou CS2 instalado  

---

## 🔧 Instalação

```bash
git clone https://github.com/adrianopteodoro/csgo-stats-overlay.git
cd csgo-stats-overlay
npm install
```

Para rodar em dev (com nodemon):

```bash
npm run dev
```

Ou em produção:

```bash
npm start
```

Por padrão sobe em: [http://localhost:3000](http://localhost:3000)

---

## 🎮 Configuração do GameState Integration

Crie o arquivo:

```
gamestate_integration_csgostats.cfg
```

No diretório:

- **CS:GO** → `.../csgo/cfg/gamestate_integration/`  
- **CS2** → `.../game/csgo/cfg/gamestate_integration/`  

Conteúdo:

```cfg
"CSGO Stats Overlay"
{
  "uri" "http://127.0.0.1:3000/gsi"
  "timeout" "1.0"
  "buffer" "0.1"
  "throttle" "0.1"
  "heartbeat" "3.0"

  "data"
  {
    "provider" "1"
    "player_state" "1"
    "player_weapons" "1"
    "map" "1"
    "round" "1"
    "player_match_stats" "1"
  }
}
```

---

## 🖥️ Uso no OBS

1. Adicione uma **Browser Source** no OBS.  
2. URL: `http://localhost:3000`  
3. Configure largura/altura conforme layout desejado.  
4. O HUD ficará transparente, exibindo somente os stats.  

---

## 📊 Estrutura de dados no banco (`data.db`)

O overlay grava informações no SQLite:

- **matches** → partidas identificadas (id, mapa, modo)  
- **events** → payloads brutos recebidos do GSI  
- **stats** → snapshots de kills, deaths, mvps, assists, score e money  

---

## 🛡️ Segurança

- Entrada JSON sanitizada (`__proto__`, `constructor`, `prototype` removidos).  
- Helmet para headers seguros.  
- Rate limit básico configurado.  
- Dependências auditadas (`npm audit`).  

---

## 📄 Licença

Consulte o arquivo LICENSE para mais detalhes.
