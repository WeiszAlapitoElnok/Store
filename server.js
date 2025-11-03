import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';


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

// API endpoint
app.get('/api/products', (req, res) => {
  db.query('SELECT name, description, price FROM product', (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'DB lekérdezés hiba' });
    } else {
      res.json(results);
    }
  });
});

// Szerver indítása
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Szerver fut a http://localhost:${PORT}`));