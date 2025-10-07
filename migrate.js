
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const DB_FILE = path.join(__dirname, "data.db");
if(fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);
const db = new sqlite3.Database(DB_FILE);
db.serialize(async ()=>{
  db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password_hash TEXT, role TEXT)`);
  db.run(`CREATE TABLE settings (id INTEGER PRIMARY KEY, name TEXT, description TEXT, logo_url TEXT)`);
  db.run(`CREATE TABLE menu (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, price REAL, description TEXT, img_url TEXT)`);
  db.run(`CREATE TABLE deals (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, price REAL, items_json TEXT, img_url TEXT)`);
  db.run(`CREATE TABLE orders (id INTEGER PRIMARY KEY AUTOINCREMENT, items_json TEXT, total REAL, status TEXT, customer TEXT, created_at TEXT)`);

  const pw = await bcrypt.hash("admin123", 10);
  db.run("INSERT INTO users (username, password_hash, role) VALUES (?,?,?)", ["admin", pw, "admin"]);
  db.run("INSERT INTO settings (id, name, description, logo_url) VALUES (1,?,?,?)", ["Mellow Cheez", "Delicious fast food", "public/logo.png"]);
  db.run("INSERT INTO menu (name, category, price, description, img_url) VALUES (?,?,?,?,?)", ["Cheesy Burger", "Burger", 5.99, "Juicy patty with melted cheese", "public/logo.png"]);
  db.run("INSERT INTO menu (name, category, price, description, img_url) VALUES (?,?,?,?,?)", ["Crispy Fries", "Sides", 2.49, "Golden fries", "public/logo.png"]);
  db.run("INSERT INTO deals (title, price, items_json, img_url) VALUES (?,?,?,?)", ["Burger + Fries", 7.00, JSON.stringify([1,2]), "public/logo.png"]);
  console.log("Migration finished.");
  db.close();
});
