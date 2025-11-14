import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';


const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Adatbázis kapcsolat
const db = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'products',
  port: 3306
});

db.connect(err => {
  if (err) {
    console.error('❌ DB hiba:', err);
  } else {
    console.log('✅ Adatbázis csatlakoztatva');
  }
});

// Load local products JSON to build a fallback name->img mapping
let localImageMap = {};
try {
  const dataPath = path.join(__dirname, 'data', 'products.json');
  const raw = fs.readFileSync(dataPath, { encoding: 'utf8' });
  const localProducts = JSON.parse(raw);
  // Map by name to media/<index+1>.jpeg (matches existing media files)
  localProducts.forEach((p, idx) => {
    if (p.name) {
      localImageMap[p.name] = `/media/${idx + 1}.jpeg`;
    }
  });
} catch (e) {
  // ignore if file missing
  console.warn('⚠️ Could not build local image map:', e.message);
}

// API endpoint
app.get('/api/products', (req, res) => {
  const search = (req.query.search || '').trim();
  const like = `%${search}%`;
  const sql = search
    ? ['SELECT name, description, price, img_url FROM product WHERE name LIKE ?', [like]]
    : ['SELECT name, description, price, img_url FROM product', []];

  db.query(sql[0], sql[1], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'DB lekérdezés hiba' });
      return;
    }

    // Attach fallback img_url from local mapping when DB row doesn't include one
    const transformed = results.map((row, idx) => {
      const r = { ...row };
      if (!r.img_url) {
        // try by exact name match
        if (r.name && localImageMap[r.name]) {
          r.img_url = localImageMap[r.name];
        } else {
          // fallback to media by index (1-based)
          r.img_url = `/media/${idx + 1}.jpeg`;
        }
      }
      // ensure description field exists (some data sources use 'desc')
      if (!r.description && r.desc) r.description = r.desc;
      return r;
    });

    res.json(transformed);
  });
});

// Szerver indítása
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Szerver fut a http://localhost:${PORT}`));