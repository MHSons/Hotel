/* ============================
   Mellow Cheez — script.js
   Handles localStorage, pages, admin, cart, export & QR.
   ============================ */

/* ----- Storage Keys ----- */
const KEY_MENU = 'r_menu';
const KEY_DEALS = 'r_deals';
const KEY_GALLERY = 'r_gallery';
const KEY_ORDERS = 'r_orders';
const KEY_CONTACTS = 'r_contacts';
const KEY_CART = 'r_cart';

/* ----- Utils ----- */
function uuid(prefix='id'){
  return prefix + '-' + Date.now().toString(36) + '-' + Math.floor(Math.random()*10000);
}
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function load(key){ try { return JSON.parse(localStorage.getItem(key)) || []; } catch(e){ return []; } }

/* ----- Initialize defaults if empty ----- */
(function ensureDefaults(){
  if(!localStorage.getItem(KEY_MENU)){
    const sample = [
      { id: 1, name: "Small Pizza", category: "Pizza", desc: "Small size pizza", price: 500, image: "" },
      { id: 2, name: "Grill Burger", category: "Burger", desc: "Juicy burger", price: 400, image: "" },
      { id: 3, name: "Loaded Fries", category: "Sides", desc: "Fries with cheese", price: 350, image: "" }
    ];
    save(KEY_MENU, sample);
  }
  if(!localStorage.getItem(KEY_DEALS)){
    const sample = [
      { id: 1, name: "Burger Combo", desc: "Burger + Fries + Drink", price: 750, image: "" }
    ];
    save(KEY_DEALS, sample);
  }
  if(!localStorage.getItem(KEY_GALLERY)){
    save(KEY_GALLERY, []);
  }
  if(!localStorage.getItem(KEY_ORDERS)){
    save(KEY_ORDERS, []);
  }
  if(!localStorage.getItem(KEY_CONTACTS)){
    save(KEY_CONTACTS, []);
  }
  if(!localStorage.getItem(KEY_CART)){
    save(KEY_CART, []);
  }
})();

/* ----- Getters/Setters for each dataset ----- */
function getMenu(){ return load(KEY_MENU); }
function setMenu(v){ save(KEY_MENU, v); }
function getDeals(){ return load(KEY_DEALS); }
function setDeals(v){ save(KEY_DEALS, v); }
function getGallery(){ return load(KEY_GALLERY); }
function setGallery(v){ save(KEY_GALLERY, v); }
function getOrders(){ return load(KEY_ORDERS); }
function setOrders(v){ save(KEY_ORDERS, v); }
function getContacts(){ return load(KEY_CONTACTS); }
function setContacts(v){ save(KEY_CONTACTS, v); }
function getCart(){ return load(KEY_CART); }
function setCart(v){ save(KEY_CART, v); }

/* ----- Admin initialization ----- */
function initAdmin(){
  renderMenuAdmin();
  renderDealsAdmin();
  renderOrdersAdmin();
  renderContactsAdmin();
  renderGalleryAdmin();

  // Menu add
  const mAdd = document.getElementById('m_add');
  if(mAdd) mAdd.onclick = () => {
    const name = document.getElementById('m_name').value.trim();
    const category = document.getElementById('m_category').value.trim();
    const price = parseFloat(document.getElementById('m_price').value) || 0;
    const image = document.getElementById('m_image').value.trim();
    if(!name || !price){ alert('Provide name and price'); return; }
    const menu = getMenu();
    const id = (menu.length? (Math.max(...menu.map(x=>x.id))+1) : 1);
    menu.push({ id, name, category, price, desc:'', image });
    setMenu(menu);
    document.getElementById('m_name').value=''; document.getElementById('m_price').value=''; document.getElementById('m_image').value='';
    renderMenuAdmin();
    alert('Menu item added');
  };

  document.getElementById('m_clear').onclick = () => {
    document.getElementById('m_name').value=''; document.getElementById('m_category').value=''; document.getElementById('m_price').value=''; document.getElementById('m_image').value='';
    document.getElementById('m_update').classList.add('hidden');
    document.getElementById('m_add').classList.remove('hidden');
  };

  // Deals add
  const dAdd = document.getElementById('d_add');
  if(dAdd) dAdd.onclick = () => {
    const name = document.getElementById('d_name').value.trim();
    const desc = document.getElementById('d_desc').value.trim();
    const price = parseFloat(document.getElementById('d_price').value) || 0;
    const image = document.getElementById('d_image').value.trim();
    if(!name || !price){ alert('Provide name and price'); return; }
    const deals = getDeals();
    const id = (deals.length? (Math.max(...deals.map(x=>x.id))+1) : 1);
    deals.push({ id, name, desc, price, image });
    setDeals(deals);
    document.getElementById('d_name').value=''; document.getElementById('d_desc').value=''; document.getElementById('d_price').value=''; document.getElementById('d_image').value='';
    renderDealsAdmin();
    alert('Deal added');
  };
  document.getElementById('d_clear').onclick = () => {
    document.getElementById('d_name').value=''; document.getElementById('d_desc').value=''; document.getElementById('d_price').value=''; document.getElementById('d_image').value='';
    document.getElementById('d_update').classList.add('hidden');
    document.getElementById('d_add').classList.remove('hidden');
  };

  // Gallery add
  const gAdd = document.getElementById('g_add');
  if(gAdd) gAdd.onclick = () => {
    const url = document.getElementById('g_url').value.trim();
    if(!url){ alert('Provide image URL'); return; }
    const gallery = getGallery();
    const id = uuid('g');
    gallery.push({ id, url });
    setGallery(gallery);
    document.getElementById('g_url').value='';
    renderGalleryAdmin();
    alert('Gallery image added');
  };
}

/* ----- Admin render functions ----- */
function renderMenuAdmin(){
  const container = document.getElementById('menuTable');
  if(!container) return;
  const menu = getMenu();
  container.innerHTML = '';
  menu.forEach(it => {
    const el = document.createElement('div');
    el.className = 'flex items-center justify-between border p-2 rounded';
    el.innerHTML = `
      <div>
        <div class="font-semibold">${it.name}</div>
        <div class="text-sm text-gray-600">${it.category||''} • Rs ${it.price}</div>
      </div>
      <div class="flex gap-2">
        <button class="px-2 py-1 border rounded" onclick="editMenu(${it.id})">Edit</button>
        <button class="px-2 py-1 bg-red-500 text-white rounded" onclick="deleteMenu(${it.id})">Delete</button>
      </div>`;
    container.appendChild(el);
  });
}

function editMenu(id){
  const menu = getMenu();
  const item = menu.find(m=>m.id===id);
  if(!item) return;
  document.getElementById('m_name').value = item.name;
  document.getElementById('m_category').value = item.category || '';
  document.getElementById('m_price').value = item.price;
  document.getElementById('m_image').value = item.image || '';
  document.getElementById('m_add').classList.add('hidden');
  const mUpdate = document.getElementById('m_update');
  mUpdate.classList.remove('hidden');
  mUpdate.onclick = () => {
    item.name = document.getElementById('m_name').value.trim();
    item.category = document.getElementById('m_category').value.trim();
    item.price = parseFloat(document.getElementById('m_price').value) || 0;
    item.image = document.getElementById('m_image').value.trim();
    setMenu(menu);
    mUpdate.classList.add('hidden'); document.getElementById('m_add').classList.remove('hidden');
    renderMenuAdmin();
    alert('Menu updated');
  };
}
function deleteMenu(id){
  if(!confirm('Delete this menu item?')) return;
  let menu = getMenu();
  menu = menu.filter(m=>m.id!==id);
  setMenu(menu);
  renderMenuAdmin();
}

/* Deals admin functions */
function renderDealsAdmin(){
  const container = document.getElementById('dealsTable');
  if(!container) return;
  const deals = getDeals();
  container.innerHTML = '';
  deals.forEach(d => {
    const el = document.createElement('div');
    el.className = 'flex items-center justify-between border p-2 rounded';
    el.innerHTML = `
      <div>
        <div class="font-semibold">${d.name}</div>
        <div class="text-sm text-gray-600">${d.desc||''} • Rs ${d.price}</div>
      </div>
      <div class="flex gap-2">
        <button class="px-2 py-1 border rounded" onclick="editDeal(${d.id})">Edit</button>
        <button class="px-2 py-1 bg-red-500 text-white rounded" onclick="deleteDeal(${d.id})">Delete</button>
      </div>`;
    container.appendChild(el);
  });
}
function editDeal(id){
  const deals = getDeals();
  const d = deals.find(x=>x.id===id);
  if(!d) return;
  document.getElementById('d_name').value = d.name;
  document.getElementById('d_desc').value = d.desc;
  document.getElementById('d_price').value = d.price;
  document.getElementById('d_image').value = d.image||'';
  document.getElementById('d_add').classList.add('hidden');
  const upd = document.getElementById('d_update');
  upd.classList.remove('hidden');
  upd.onclick = () => {
    d.name = document.getElementById('d_name').value.trim();
    d.desc = document.getElementById('d_desc').value.trim();
    d.price = parseFloat(document.getElementById('d_price').value) || 0;
    d.image = document.getElementById('d_image').value.trim();
    setDeals(deals);
    upd.classList.add('hidden'); document.getElementById('d_add').classList.remove('hidden');
    renderDealsAdmin();
    alert('Deal updated');
  };
}
function deleteDeal(id){
  if(!confirm('Delete this deal?')) return;
  let deals = getDeals();
  deals = deals.filter(d=>d.id!==id);
  setDeals(deals);
  renderDealsAdmin();
}

/* Gallery admin */
function renderGalleryAdmin(){
  const container = document.getElementById('galleryList');
  if(!container) return;
  const gallery = getGallery();
  container.innerHTML = '';
  gallery.forEach(g => {
    const el = document.createElement('div');
    el.className = 'relative';
    el.innerHTML = `<img src="${g.url}" class="h-24 w-full object-cover rounded border" onerror="this.style.display='none'">
                    <button class="absolute top-1 right-1 bg-red-500 text-white px-1 rounded" onclick="deleteGalleryItem('${g.id}')">x</button>`;
    container.appendChild(el);
  });
}
function deleteGalleryItem(id){
  if(!confirm('Delete this image?')) return;
  let gallery = getGallery();
  gallery = gallery.filter(g=>g.id!==id);
  setGallery(gallery);
  renderGalleryAdmin();
}

/* ----- Orders admin UI ----- */
function renderOrdersAdmin(){
  const container = document.getElementById('ordersList');
  if(!container) return;
  const orders = getOrders().slice().reverse();
  container.innerHTML = '';
  if(!orders.length) container.innerHTML = '<div class="p-3 bg-gray-50 rounded">No orders yet.</div>';
  orders.forEach(o => {
    const div = document.createElement('div');
    div.className = 'border rounded p-3 flex justify-between items-start gap-3';
    div.innerHTML = `
      <div>
        <div class="font-bold">ID: ${o.id} — ${o.name} — Rs ${o.total}</div>
        <div class="text-sm text-gray-600">Type: ${o.type} — ${new Date(o.timestamp).toLocaleString()}</div>
        <div class="mt-2">${o.items.map(it=>`<div>${it.name} x ${it.qty} = Rs ${it.price*it.qty}</div>`).join('')}</div>
      </div>
      <div class="flex flex-col items-end gap-2">
        <select onchange="changeOrderStatus('${o.id}', this.value)" class="p-1 border rounded">
          <option ${o.status==='Pending'?'selected':''}>Pending</option>
          <option ${o.status==='Preparing'?'selected':''}>Preparing</option>
          <option ${o.status==='Completed'?'selected':''}>Completed</option>
        </select>
        <div id="qr-${o.id}"></div>
        <div class="flex gap-2">
          <button class="px-2 py-1 border rounded" onclick="printSingleOrder('${o.id}')">Print</button>
          <button class="px-2 py-1 border rounded" onclick="deleteOrder('${o.id}')">Delete</button>
        </div>
      </div>`;
    container.appendChild(div);
    // generate QR
    setTimeout(()=> {
      const qrHolder = document.getElementById(`qr-${o.id}`);
      if(qrHolder){
        qrHolder.innerHTML = '';
        new QRCode(qrHolder, { text: JSON.stringify({id:o.id, name:o.name, total:o.total}), width:100, height:100 });
      }
    }, 50);
  });
}

/* Orders operations */
function changeOrderStatus(id, status){
  const orders = getOrders();
  const idx = orders.findIndex(o=>o.id===id);
  if(idx===-1) return;
  orders[idx].status = status;
  setOrders(orders);
  renderOrdersAdmin();
}
function deleteOrder(id){
  if(!confirm('Delete this order?')) return;
  let orders = getOrders();
  orders = orders.filter(o=>o.id!==id);
  setOrders(orders);
  renderOrdersAdmin();
}
function printSingleOrder(id){
  const orders = getOrders();
  const o = orders.find(x=>x.id===id);
  if(!o){ alert('Order not found'); return; }
  const el = document.createElement('div');
  el.style.padding='20px';
  el.innerHTML = `<h2>Mellow Cheez — Order ${o.id}</h2>
    <div>Name: ${o.name}</div>
    <div>Phone: ${o.phone}</div>
    <div>Type: ${o.type}</div>
    <div>Address: ${o.address || '-'}</div>
    <hr>
    <div>${o.items.map(i=>`<div>${i.name} x ${i.qty} — Rs ${i.price*i.qty}</div>`).join('')}</div>
    <hr><div><strong>Total: Rs ${o.total}</strong></div>`;
  document.body.appendChild(el);
  html2pdf().from(el).save(`Order_${o.id}.pdf`).then(()=> el.remove());
}

/* ----- Contacts admin UI ----- */
function renderContactsAdmin(){
  const container = document.getElementById('contactsList');
  if(!container) return;
  const contacts = getContacts().slice().reverse();
  container.innerHTML = '';
  if(!contacts.length) container.innerHTML = '<div class="p-2 bg-gray-50 rounded">No contacts.</div>';
  contacts.forEach(c => {
    const d = document.createElement('div');
    d.className = 'border p-2 rounded';
    d.innerHTML = `<div class="font-semibold">${c.name} — ${new Date(c.timestamp).toLocaleString()}</div>
                   <div class="text-sm">${c.email||''}</div>
                   <div class="mt-1">${c.message || c.msg || ''}</div>`;
    container.appendChild(d);
  });
}

/* ----- CRUD for orders & contacts from pages ----- */
function saveOrder(order){
  const orders = getOrders();
  orders.push(order);
  setOrders(orders);
  renderOrdersAdmin();
  alert('Order saved (locally). Admin can export it.');
}
function saveContact(contact){
  const contacts = getContacts();
  contacts.push(contact);
  setContacts(contacts);
  renderContactsAdmin();
}

/* ----- Export functions ----- */
function exportToCSV(filename, data){
  if(!data || !data.length){ alert('No data to export'); return; }
  const keys = Object.keys(data[0]);
  const lines = [keys.join(',')].concat(data.map(row => keys.map(k => `"${String(row[k]||'').replace(/"/g,'""')}"`).join(',')));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
}
function exportOrdersCSV(){ const data = getOrders(); exportToCSV(`orders_${Date.now()}.csv`, data); }
function exportContactsCSV(){ const data = getContacts(); exportToCSV(`contacts_${Date.now()}.csv`, data); }

function exportOrdersXLSX(){
  const data = getOrders();
  if(!data.length){ alert('No orders'); return; }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Orders');
  XLSX.writeFile(wb, `orders_${Date.now()}.xlsx`);
}
function exportContactsXLSX(){
  const data = getContacts();
  if(!data.length){ alert('No contacts'); return; }
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Contacts');
  XLSX.writeFile(wb, `contacts_${Date.now()}.xlsx`);
}

function exportOrdersPDF(){
  const orders = getOrders();
  if(!orders.length){ alert('No orders'); return; }
  const el = document.createElement('div');
  el.style.padding='20px';
  el.innerHTML = `<h2>Mellow Cheez — Orders export</h2>`;
  orders.forEach(o=> {
    el.innerHTML += `<div style="margin-bottom:10px">
      <div><strong>${o.id}</strong> — ${o.name} — Rs ${o.total}</div>
      <div class="small">${new Date(o.timestamp).toLocaleString()}</div>
      <div>${o.items.map(i=>`${i.name} x ${i.qty} = Rs ${i.qty*i.price}`).join('<br>')}</div>
    </div><hr>`;
  });
  document.body.appendChild(el);
  html2pdf().from(el).save(`orders_${Date.now()}.pdf`).then(()=> el.remove());
}
function exportContactsPDF(){
  const contacts = getContacts();
  if(!contacts.length){ alert('No contacts'); return; }
  const el = document.createElement('div');
  el.style.padding='20px';
  el.innerHTML = `<h2>Contacts export</h2>`;
  contacts.forEach(c=> {
    el.innerHTML += `<div style="margin-bottom:8px"><strong>${c.name}</strong> (${c.email||''}) — ${new Date(c.timestamp).toLocaleString()}<div>${c.message||c.msg||''}</div></div><hr>`;
  });
  document.body.appendChild(el);
  html2pdf().from(el).save(`contacts_${Date.now()}.pdf`).then(()=> el.remove());
}

function printOrders(){
  const orders = getOrders();
  if(!orders.length){ alert('No orders'); return; }
  const el = document.createElement('div');
  el.style.padding='20px';
  el.innerHTML = `<h2>Orders</h2>` + orders.map(o=>`<div><strong>${o.id}</strong> - ${o.name} - Rs ${o.total}</div>`).join('');
  document.body.appendChild(el);
  window.print();
  el.remove();
}

/* ----- Clear all data (use with caution) ----- */
function clearAllData(){
  if(!confirm('Clear all stored data (menu, deals, gallery, orders, contacts, cart)?')) return;
  localStorage.removeItem(KEY_MENU);
  localStorage.removeItem(KEY_DEALS);
  localStorage.removeItem(KEY_GALLERY);
  localStorage.removeItem(KEY_ORDERS);
  localStorage.removeItem(KEY_CONTACTS);
  localStorage.removeItem(KEY_CART);
  location.reload();
}

/* ----- Cart functions (for order page) ----- */
function addItemToCartById(id){
  const menu = getMenu();
  const it = menu.find(m=>m.id === id);
  if(!it) return;
  const cart = getCart();
  const existing = cart.find(c=>c.id === id && c.type === 'menu');
  if(existing) existing.qty++;
  else cart.push({ id: it.id, name: it.name, price: it.price, qty: 1, type:'menu' });
  setCart(cart);
}
function addDealToCartById(id){
  const deals = getDeals();
  const d = deals.find(x=>x.id===id);
  if(!d) return;
  const cart = getCart();
  const existing = cart.find(c=>c.id === id && c.type === 'deal');
  if(existing) existing.qty++;
  else cart.push({ id: d.id, name: d.name, price: d.price, qty: 1, type:'deal' });
  setCart(cart);
}
function renderOrderMenu(){
  const container = document.getElementById('order-menu');
  if(!container) return;
  container.innerHTML = '';
  const menu = getMenu();
  menu.forEach(it=>{
    const card = document.createElement('div');
    card.className = 'bg-white p-3 rounded shadow';
    card.innerHTML = `<h4 class="font-semibold">${it.name}</h4>
      <div class="text-sm text-gray-600">${it.category||''}</div>
      <div class="mt-2 font-semibold">Rs ${it.price}</div>
      <div class="mt-2">
        <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="addToCart(${it.id})">Add</button>
      </div>`;
    container.appendChild(card);
  });
  const deals = getDeals();
  deals.forEach(d=>{
    const card = document.createElement('div');
    card.className = 'bg-white p-3 rounded shadow';
    card.innerHTML = `<h4 class="font-semibold">${d.name}</h4>
      <div class="text-sm text-gray-600">${d.desc||''}</div>
      <div class="mt-2 font-semibold">Rs ${d.price}</div>
      <div class="mt-2">
        <button class="bg-yellow-500 text-white px-3 py-1 rounded" onclick="addDealToCart(${d.id})">Add Deal</button>
      </div>`;
    container.appendChild(card);
  });
}

function renderCartUI(){
  const list = document.getElementById('cart-list');
  if(!list) return;
  const cart = getCart();
  list.innerHTML = '';
  if(!cart.length) list.innerHTML = '<div class="text-sm text-gray-600">Cart empty</div>';
  let total = 0;
  cart.forEach((it, idx) => {
    total += it.price * it.qty;
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between';
    row.innerHTML = `<div>${it.name} x <input type="number" min="1" value="${it.qty}" style="width:50px" onchange="updateQty(${idx}, this.value)"> </div>
                     <div>Rs ${it.price * it.qty}</div>`;
    list.appendChild(row);
  });
  document.getElementById('cart-total').innerText = total;
}
function updateQty(index, qty){
  const cart = getCart();
  cart[index].qty = parseInt(qty) || 1;
  setCart(cart);
  renderCartUI();
}
function clearCart(){ setCart([]); }
function addToCart(id){ addItemToCartById(id); renderCartUI(); }
function addDealToCart(id){ addDealToCartById(id); renderCartUI(); }

/* ----- Order ID generator ----- */
function generateOrderId(){
  const now = new Date();
  const dt = now.getFullYear().toString() + (now.getMonth()+1).toString().padStart(2,'0') + now.getDate().toString().padStart(2,'0');
  const ts = now.getTime().toString().slice(-5);
  return 'ORD-' + dt + '-' + ts + '-' + Math.floor(Math.random()*9000 + 1000);
}

/* ----- Order saving wrapper already defined earlier as saveOrder() ----- */

/* ----- Menu/Deals/Gallery helper functions for other pages ----- */
// these are exposed as global getMenu/getDeals/getGallery above.

/* ----- Contacts saving wrapper saveContact() above ----- */

/* ----- on load to render admin lists if on admin page ----- */
window.addEventListener('load', () => {
  // If admin present, initAdmin() will call render functions.
  // But ensure orders/contacts rendered for any page that has those elements.
  if(document.getElementById('ordersList')) renderOrdersAdmin();
  if(document.getElementById('contactsList')) renderContactsAdmin();
  if(document.getElementById('menuTable')) renderMenuAdmin();
  if(document.getElementById('dealsTable')) renderDealsAdmin();
  if(document.getElementById('galleryList')) renderGalleryAdmin();

  // If menu grid present (menu.html), it will be rendered in that file's inline script.
});
