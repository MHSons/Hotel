
const DB = {
  settings: "ff_settings",
  menu: "ff_menu",
  deals: "ff_deals",
  cart: "ff_cart",
  orders: "ff_orders",
  users: "ff_users"
};

function read(key){ return JSON.parse(localStorage.getItem(key) || "null"); }
function write(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,8); }

function init(){
  if(!read(DB.users)) write(DB.users, [{id:"u_admin", username:"admin", password:"admin123", role:"admin"}]);
  if(!read(DB.settings)) write(DB.settings, {name:"Mellow Cheez", desc:"Delicious fast food", hero:"logo.png"});
  if(!read(DB.menu)) write(DB.menu, []);
  if(!read(DB.deals)) write(DB.deals, []);
  if(!read(DB.orders)) write(DB.orders, []);
}

// Login
document.getElementById("adminLoginBtn").addEventListener("click", ()=>{
  const u = document.getElementById("adminUser").value.trim();
  const p = document.getElementById("adminPass").value;
  const users = read(DB.users) || [];
  const found = users.find(x=>x.username===u && x.password===p);
  if(found){
    showAdmin();
  } else alert("Invalid credentials");
});

function showAdmin(){
  document.getElementById("adminLoginWrap").classList.add("d-none");
  document.getElementById("adminPanel").classList.remove("d-none");
  loadSettingsToForm();
  renderMenuList();
  renderDealsList();
  renderOrders();
}

// Settings
function loadSettingsToForm(){
  const s = read(DB.settings) || {};
  document.getElementById("settingName").value = s.name || "";
  document.getElementById("settingDesc").value = s.desc || "";
}
document.getElementById("saveSettings").addEventListener("click", ()=>{
  const s = read(DB.settings) || {};
  s.name = document.getElementById("settingName").value;
  s.desc = document.getElementById("settingDesc").value;
  // hero upload
  const f = document.getElementById("heroUpload").files[0];
  if(f){
    const reader = new FileReader();
    reader.onload = function(e){
      s.hero = e.target.result;
      write(DB.settings, s);
      alert("Saved");
    };
    reader.readAsDataURL(f);
  } else {
    write(DB.settings, s);
    alert("Saved");
  }
});

// Menu management
document.getElementById("addItemBtn").addEventListener("click", ()=>{
  const name = document.getElementById("newName").value.trim();
  const cat = document.getElementById("newCategory").value.trim();
  const price = parseFloat(document.getElementById("newPrice").value) || 0;
  const desc = document.getElementById("newDesc").value.trim();
  const f = document.getElementById("newImage").files[0];
  if(!name) return alert("Enter name");
  const item = {id: uid(), name, category:cat, price, desc, img:"logo.png"};
  if(f){
    const reader = new FileReader();
    reader.onload = function(e){
      item.img = e.target.result;
      saveMenuItem(item);
      clearMenuForm();
      renderMenuList();
    };
    reader.readAsDataURL(f);
  } else {
    saveMenuItem(item);
    clearMenuForm();
    renderMenuList();
  }
});

function saveMenuItem(item){
  const list = read(DB.menu) || [];
  list.unshift(item);
  write(DB.menu, list);
}

function clearMenuForm(){
  document.getElementById("newName").value = "";
  document.getElementById("newCategory").value = "";
  document.getElementById("newPrice").value = "";
  document.getElementById("newDesc").value = "";
  document.getElementById("newImage").value = "";
}

function renderMenuList(){
  const list = read(DB.menu) || [];
  const wrap = document.getElementById("adminMenuList");
  wrap.innerHTML = "";
  list.forEach(it=>{
    const el = document.createElement("div");
    el.className = "list-group-item d-flex align-items-center";
    el.innerHTML = `
      <img src="${it.img}" width="70" style="object-fit:cover;border-radius:6px;margin-right:12px">
      <div class="flex-grow-1">
        <strong>${it.name}</strong> <small class="text-muted">(${it.category})</small>
        <div class="small text-muted">$${it.price.toFixed(2)}</div>
        <div>${it.desc || ""}</div>
      </div>
      <div class="ms-3">
        <button class="btn btn-sm btn-outline-primary editItem" data-id="${it.id}">Edit</button>
        <button class="btn btn-sm btn-outline-danger delItem" data-id="${it.id}">Delete</button>
      </div>
    `;
    wrap.appendChild(el);
  });
  document.querySelectorAll(".delItem").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = e.target.dataset.id;
      if(!confirm("Delete item?")) return;
      let list = read(DB.menu) || [];
      list = list.filter(x=>x.id!==id);
      write(DB.menu, list);
      renderMenuList();
    });
  });
  document.querySelectorAll(".editItem").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = e.target.dataset.id;
      const list = read(DB.menu) || [];
      const it = list.find(x=>x.id===id);
      if(!it) return;
      const newName = prompt("Name", it.name);
      if(newName===null) return;
      it.name = newName;
      const newPrice = prompt("Price", it.price);
      if(newPrice!==null) it.price = parseFloat(newPrice) || it.price;
      write(DB.menu, list);
      renderMenuList();
    });
  });
}

// Deals management
document.getElementById("addDealBtn").addEventListener("click", ()=>{
  const title = document.getElementById("dealTitle").value.trim();
  const price = parseFloat(document.getElementById("dealPrice").value) || 0;
  const items = document.getElementById("dealItems").value.split(",").map(s=>s.trim()).filter(Boolean);
  if(!title) return alert("Title required");
  const deals = read(DB.deals) || [];
  deals.unshift({id: uid(), title, price, items, img:"logo.png"});
  write(DB.deals, deals);
  renderDealsList();
});

function renderDealsList(){
  const deals = read(DB.deals) || [];
  const wrap = document.getElementById("adminDealsList");
  wrap.innerHTML = "";
  deals.forEach(d=>{
    const el = document.createElement("div");
    el.className = "list-group-item d-flex align-items-center";
    el.innerHTML = `
      <img src="${d.img}" width="70" style="object-fit:cover;border-radius:6px;margin-right:12px">
      <div class="flex-grow-1">
        <strong>${d.title}</strong>
        <div class="small text-muted">$${d.price.toFixed(2)} • Includes: ${d.items.join(", ")}</div>
      </div>
      <div class="ms-3">
        <button class="btn btn-sm btn-outline-danger delDeal" data-id="${d.id}">Delete</button>
      </div>
    `;
    wrap.appendChild(el);
  });
  document.querySelectorAll(".delDeal").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = e.target.dataset.id;
      if(!confirm("Delete deal?")) return;
      let list = read(DB.deals) || [];
      list = list.filter(x=>x.id!==id);
      write(DB.deals, list);
      renderDealsList();
    });
  });
}

// Orders
function renderOrders(){
  const orders = read(DB.orders) || [];
  const wrap = document.getElementById("ordersList");
  wrap.innerHTML = "";
  if(orders.length===0) wrap.innerHTML = "<div class='text-muted'>No orders yet</div>";
  orders.forEach(o=>{
    const el = document.createElement("div");
    el.className = "card mb-2";
    el.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between">
          <div><strong>Order ${o.id}</strong><div class="small text-muted">${new Date(o.date).toLocaleString()}</div></div>
          <div><strong>$${o.total.toFixed(2)}</strong><div class="small">${o.status}</div></div>
        </div>
        <div class="mt-2">
          ${o.items.map(it=>`<div>${it.qty} × ${it.name} — $${it.price.toFixed(2)}</div>`).join("")}
        </div>
        <div class="mt-2">
          <button class="btn btn-sm btn-success markReady" data-id="${o.id}">Mark Ready</button>
          <button class="btn btn-sm btn-outline-danger delOrder" data-id="${o.id}">Delete</button>
        </div>
      </div>
    `;
    wrap.appendChild(el);
  });
  document.querySelectorAll(".markReady").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = e.target.dataset.id;
      const orders = read(DB.orders) || [];
      const o = orders.find(x=>x.id===id);
      if(o){ o.status = "ready"; write(DB.orders, orders); renderOrders(); }
    });
  });
  document.querySelectorAll(".delOrder").forEach(b=>{
    b.addEventListener("click", e=>{
      const id = e.target.dataset.id;
      if(!confirm("Delete order?")) return;
      let orders = read(DB.orders) || [];
      orders = orders.filter(x=>x.id!==id);
      write(DB.orders, orders);
      renderOrders();
    });
  });
}

document.getElementById("logoutBtn").addEventListener("click", ()=>{
  location.reload();
});

document.addEventListener("DOMContentLoaded", ()=>{
  init();
});
