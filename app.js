
// Simple frontend app using localStorage for data persistence.
// Data models: settings, menuItems, deals, cart, orders, users

const DB = {
  settings: "ff_settings",
  menu: "ff_menu",
  deals: "ff_deals",
  cart: "ff_cart",
  orders: "ff_orders",
  users: "ff_users"
};

function uid(){ return Date.now().toString(36) + Math.random().toString(36).slice(2,8); }

// Initialize sample data if empty
function initData(){
  if(!localStorage.getItem(DB.settings)){
    localStorage.setItem(DB.settings, JSON.stringify({
      name: "Mellow Cheez",
      desc: "Delicious fast food — burgers, fries, wraps, and cheesy deals.",
      hero: "logo.png"
    }));
  }
  if(!localStorage.getItem(DB.menu)){
    const sample = [
      {id: "m1", name:"Cheesy Burger", price:5.99, category:"Burger", desc:"Juicy patty with melted cheese", img:"logo.png"},
      {id: "m2", name:"Crispy Fries", price:2.49, category:"Sides", desc:"Golden fries", img:"logo.png"},
      {id: "m3", name:"Chicken Wrap", price:4.99, category:"Wraps", desc:"Spicy chicken wrap", img:"logo.png"}
    ];
    localStorage.setItem(DB.menu, JSON.stringify(sample));
  }
  if(!localStorage.getItem(DB.deals)){
    const sample = [
      {id:"d1", title:"Burger + Fries", price:7.00, items:["m1","m2"], img:"logo.png"}
    ];
    localStorage.setItem(DB.deals, JSON.stringify(sample));
  }
  if(!localStorage.getItem(DB.users)){
    const users = [{id:"u_admin", username:"admin", password:"admin123", role:"admin"}];
    localStorage.setItem(DB.users, JSON.stringify(users));
  }
  if(!localStorage.getItem(DB.orders)) localStorage.setItem(DB.orders, JSON.stringify([]));
  if(!localStorage.getItem(DB.cart)) localStorage.setItem(DB.cart, JSON.stringify([]));
}

function read(key){ return JSON.parse(localStorage.getItem(key) || "null"); }
function write(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

function renderSettings(){
  const s = read(DB.settings);
  if(s){
    document.getElementById("restName").innerText = s.name || "Restaurant";
    document.getElementById("restDesc").innerText = s.desc || "";
    document.getElementById("heroImg").src = s.hero || "logo.png";
  }
}

function renderMenu(filter=""){
  const menu = read(DB.menu) || [];
  const container = document.getElementById("menuList");
  container.innerHTML = "";
  const q = filter.trim().toLowerCase();
  menu.filter(it => !q || (it.name+it.desc+it.category).toLowerCase().includes(q))
      .forEach(it=>{
    const col = document.createElement("div"); col.className = "col-md-4";
    col.innerHTML = `
      <div class="card menu-card card-hover">
        <div class="row g-0">
          <div class="col-4 p-2">
            <img src="${it.img}" class="img-fluid" />
          </div>
          <div class="col-8">
            <div class="card-body">
              <h5>${it.name}</h5>
              <p class="small text-muted">${it.category} • $${it.price.toFixed(2)}</p>
              <p class="mb-1">${it.desc || ""}</p>
              <button class="btn btn-sm btn-primary addBtn" data-id="${it.id}">Add</button>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
  document.querySelectorAll(".addBtn").forEach(b=>{
    b.addEventListener("click", e=>{
      addToCart(e.target.dataset.id);
    });
  });
}

function renderDeals(){
  const deals = read(DB.deals) || [];
  const container = document.getElementById("dealsList");
  container.innerHTML = "";
  deals.forEach(d=>{
    const col = document.createElement("div"); col.className = "col-md-4";
    col.innerHTML = `
      <div class="card card-hover">
        <img src="${d.img}" class="card-img-top" style="max-height:180px;object-fit:cover">
        <div class="card-body">
          <h5>${d.title}</h5>
          <p class="small text-muted">$${d.price.toFixed(2)}</p>
          <p class="mb-1">Includes: ${d.items.join(", ")}</p>
          <button class="btn btn-sm btn-warning addDealBtn" data-id="${d.id}">Add Deal</button>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
  document.querySelectorAll(".addDealBtn").forEach(b=>{
    b.addEventListener("click", e=>{
      addDealToCart(e.target.dataset.id);
    });
  });
}

function cartCount(){
  const cart = read(DB.cart) || [];
  document.getElementById("cartCount").innerText = cart.reduce((s,i)=>s+i.qty,0);
}

function addToCart(itemId){
  const menu = read(DB.menu) || [];
  const item = menu.find(m=>m.id===itemId);
  if(!item) return alert("Item not found");
  const cart = read(DB.cart) || [];
  const existing = cart.find(c=>c.id===itemId && !c.deal);
  if(existing) existing.qty++;
  else cart.push({id:itemId, name:item.name, price:item.price, qty:1, img:item.img, deal:false});
  write(DB.cart, cart);
  cartCount();
  showToast("Added to cart");
}

function addDealToCart(dealId){
  const deals = read(DB.deals) || [];
  const d = deals.find(x=>x.id===dealId);
  if(!d) return alert("Deal not found");
  const cart = read(DB.cart) || [];
  cart.push({id:dealId, name:d.title, price:d.price, qty:1, img:d.img, deal:true});
  write(DB.cart, cart);
  cartCount();
  showToast("Deal added to cart");
}

function showToast(msg){
  const el = document.getElementById("orderMsg");
  el.className = "alert alert-success";
  el.innerText = msg;
  el.classList.remove("d-none");
  setTimeout(()=>el.classList.add("d-none"), 2000);
}

function showCartModal(){
  const cart = read(DB.cart) || [];
  const container = document.getElementById("cartItems");
  container.innerHTML = "";
  let total = 0;
  cart.forEach((c, idx)=>{
    total += c.price * c.qty;
    const row = document.createElement("div");
    row.className = "d-flex align-items-center border p-2 mb-2";
    row.innerHTML = `
      <img src="${c.img}" width="60" style="object-fit:cover;border-radius:6px;margin-right:12px">
      <div class="flex-grow-1">
        <strong>${c.name}</strong><br><small>$${c.price.toFixed(2)} • qty: </small>
        <input type="number" min="1" value="${c.qty}" class="cart-qty form-control d-inline-block" style="width:80px" data-idx="${idx}">
      </div>
      <div class="ms-3">
        <button class="btn btn-sm btn-outline-danger removeCart" data-idx="${idx}">Remove</button>
      </div>
    `;
    container.appendChild(row);
  });
  document.getElementById("cartTotal").innerText = total.toFixed(2);
  // attach events
  document.querySelectorAll(".cart-qty").forEach(inp=>{
    inp.addEventListener("change", e=>{
      const i = parseInt(e.target.dataset.idx);
      const v = Number(e.target.value) || 1;
      const cart = read(DB.cart) || [];
      cart[i].qty = Math.max(1, v);
      write(DB.cart, cart); showCartModal(); cartCount();
    });
  });
  document.querySelectorAll(".removeCart").forEach(b=>{
    b.addEventListener("click", e=>{
      const i = parseInt(e.target.dataset.idx);
      const cart = read(DB.cart) || [];
      cart.splice(i,1);
      write(DB.cart, cart); showCartModal(); cartCount();
    });
  });
  const modalEl = new bootstrap.Modal(document.getElementById("cartModal"));
  modalEl.show();
}

function clearCart(){
  if(!confirm("Clear cart?")) return;
  write(DB.cart, []);
  cartCount();
  showCartModal();
}

function placeOrder(){
  const cart = read(DB.cart) || [];
  if(cart.length===0) return alert("Cart empty");
  const orders = read(DB.orders) || [];
  const order = {id: uid(), items: cart, total: cart.reduce((s,i)=>s+i.price*i.qty,0), date:new Date().toISOString(), status:"new"};
  orders.unshift(order);
  write(DB.orders, orders);
  write(DB.cart, []);
  cartCount();
  showToast("Order placed! Order ID: " + order.id);
  // close modal if open
  const modal = bootstrap.Modal.getInstance(document.getElementById("cartModal"));
  if(modal) modal.hide();
}

function checkoutBtn(){
  // Simulate checkout by placing order
  placeOrder();
}

document.addEventListener("DOMContentLoaded", ()=>{
  initData();
  renderSettings();
  renderMenu();
  renderDeals();
  cartCount();

  document.getElementById("searchInput").addEventListener("input", e=>{
    renderMenu(e.target.value);
  });

  document.getElementById("cartBtn").addEventListener("click", showCartModal);
  document.getElementById("clearCart").addEventListener("click", clearCart);
  document.getElementById("placeOrderBtn").addEventListener("click", placeOrder);
  document.getElementById("checkoutBtn").addEventListener("click", checkoutBtn);
});
