
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || "replace_this_secret";

// DB
const DB_FILE = path.join(__dirname, "data.db");
const db = new sqlite3.Database(DB_FILE);

// Middleware
app.use(cors());
app.use(express.json({limit: "10mb"}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "frontend")));

// Multer for image uploads
const uploadDir = path.join(__dirname, "uploads");
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g,"_"))
});
const upload = multer({storage});

// Auth helpers
function generateToken(user){ return jwt.sign({id:user.id, username:user.username, role:user.role}, JWT_SECRET, {expiresIn:"8h"}); }
function authMiddleware(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({error:"Missing token"});
  const token = h.split(" ")[1];
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  }catch(e){ return res.status(401).json({error:"Invalid token"}); }
}

// --- Routes --- //

// Health
app.get("/api/health", (req,res)=> res.json({ok:true, time: Date.now()}));

// Public: get settings, menu, deals
app.get("/api/settings", (req,res)=> {
  db.get("SELECT * FROM settings LIMIT 1", (err,row)=> {
    if(err) return res.status(500).json({error:err.message});
    res.json(row || {});
  });
});

app.get("/api/menu", (req,res)=> {
  db.all("SELECT * FROM menu ORDER BY id DESC", (err,rows)=> {
    if(err) return res.status(500).json({error:err.message});
    res.json(rows || []);
  });
});

app.get("/api/deals", (req,res)=> {
  db.all("SELECT * FROM deals ORDER BY id DESC", (err,rows)=> {
    if(err) return res.status(500).json({error:err.message});
    res.json(rows || []);
  });
});

// Orders (public create)
app.post("/api/orders", (req,res)=>{
  const {items, customer} = req.body;
  if(!items || !Array.isArray(items) || items.length===0) return res.status(400).json({error:"No items"});
  const total = items.reduce((s,i)=>s + (i.price || 0) * (i.qty || 1), 0);
  const stmt = db.prepare("INSERT INTO orders (items_json, total, status, customer, created_at) VALUES (?,?,?,?,?)");
  stmt.run(JSON.stringify(items), total, "new", JSON.stringify(customer || {}), new Date().toISOString(), function(err){
    if(err) return res.status(500).json({error:err.message});
    db.get("SELECT * FROM orders WHERE id = ?", [this.lastID], (e,row)=>{
      if(e) return res.status(500).json({error:e.message});
      res.json(row);
    });
  });
});

// Admin: login
app.post("/api/admin/login", (req,res)=>{
  const {username, password} = req.body;
  if(!username || !password) return res.status(400).json({error:"Missing"});
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err,user)=>{
    if(err) return res.status(500).json({error:err.message});
    if(!user) return res.status(401).json({error:"Invalid"});
    const match = await bcrypt.compare(password, user.password_hash);
    if(!match) return res.status(401).json({error:"Invalid"});
    const token = generateToken(user);
    res.json({token, user:{id:user.id, username:user.username, role:user.role}});
  });
});

// Admin: protected routes
app.use("/api/admin", authMiddleware);

// Upload image
app.post("/api/admin/upload", upload.single("image"), (req,res)=>{
  if(!req.file) return res.status(400).json({error:"No file"});
  const url = "/uploads/" + path.basename(req.file.path);
  res.json({url});
});

// Settings CRUD
app.get("/api/admin/settings", (req,res)=>{
  db.get("SELECT * FROM settings LIMIT 1", (err,row)=> { if(err) return res.status(500).json({error:err.message}); res.json(row || {}); });
});
app.post("/api/admin/settings", (req,res)=>{
  const {name, description, logo_url} = req.body;
  db.run("UPDATE settings SET name=?, description=?, logo_url=? WHERE id=1", [name, description, logo_url], function(err){
    if(err) return res.status(500).json({error:err.message});
    res.json({ok:true});
  });
});

// Menu CRUD
app.post("/api/admin/menu", (req,res)=>{
  const {name, category, price, description, img_url} = req.body;
  db.run("INSERT INTO menu (name, category, price, description, img_url) VALUES (?,?,?,?,?)", [name, category, price || 0, description, img_url], function(err){
    if(err) return res.status(500).json({error:err.message});
    db.get("SELECT * FROM menu WHERE id = ?", [this.lastID], (e,row)=>{ if(e) return res.status(500).json({error:e.message}); res.json(row); });
  });
});
app.put("/api/admin/menu/:id", (req,res)=>{
  const id = req.params.id;
  const {name, category, price, description, img_url} = req.body;
  db.run("UPDATE menu SET name=?, category=?, price=?, description=?, img_url=? WHERE id=?", [name, category, price, description, img_url, id], function(err){
    if(err) return res.status(500).json({error:err.message});
    res.json({ok:true});
  });
});
app.delete("/api/admin/menu/:id", (req,res)=>{
  const id = req.params.id;
  db.run("DELETE FROM menu WHERE id=?", [id], function(err){ if(err) return res.status(500).json({error:err.message}); res.json({ok:true}); });
});

// Deals CRUD
app.post("/api/admin/deals", (req,res)=>{
  const {title, price, items, img_url} = req.body;
  db.run("INSERT INTO deals (title, price, items_json, img_url) VALUES (?,?,?,?)", [title, price || 0, JSON.stringify(items||[]), img_url], function(err){
    if(err) return res.status(500).json({error:err.message});
    db.get("SELECT * FROM deals WHERE id = ?", [this.lastID], (e,row)=>{ if(e) return res.status(500).json({error:e.message}); res.json(row); });
  });
});
app.delete("/api/admin/deals/:id", (req,res)=>{
  db.run("DELETE FROM deals WHERE id=?", [req.params.id], function(err){ if(err) return res.status(500).json({error:err.message}); res.json({ok:true}); });
});

// Orders management
app.get("/api/admin/orders", (req,res)=>{
  db.all("SELECT * FROM orders ORDER BY id DESC", (err,rows)=>{ if(err) return res.status(500).json({error:err.message}); res.json(rows); });
});
app.put("/api/admin/orders/:id/status", (req,res)=>{
  const {status} = req.body;
  db.run("UPDATE orders SET status=? WHERE id=?", [status, req.params.id], function(err){ if(err) return res.status(500).json({error:err.message}); res.json({ok:true}); });
});
app.delete("/api/admin/orders/:id", (req,res)=>{
  db.run("DELETE FROM orders WHERE id=?", [req.params.id], function(err){ if(err) return res.status(500).json({error:err.message}); res.json({ok:true}); });
});

// Serve frontend (if user opens root)
app.get("/", (req,res)=>{
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, ()=>console.log("Server listening on", PORT));
