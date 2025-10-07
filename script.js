// script.js - logic for menu, cart, admin, reservations, exports (localStorage)
const KEY_MENU='ff_menu_v2'; const KEY_CART='ff_cart_v2'; const KEY_ORDERS='ff_orders_v2'; const KEY_SETTINGS='ff_settings_v2'; const KEY_REVIEWS='ff_reviews_v2'; const KEY_DEALS='ff_deals_v2'; const KEY_RES='ff_reserv_v2';

const $ = s=>document.querySelector(s);
const showToast = (t,ms=2200)=>{ const el=document.getElementById('toast'); el.textContent=t; el.style.display='block'; clearTimeout(el._t); el._t=setTimeout(()=>el.style.display='none',ms); }
function load(key,def){ try{ return JSON.parse(localStorage.getItem(key))||def }catch(e){ return def } }
function save(key,v){ localStorage.setItem(key,JSON.stringify(v)) }

function genId(){ return 'i'+Math.random().toString(36).slice(2,9) }

const SAMPLE_MENU = [ {id:genId(),name:'Zinger Burger',price:450,cat:'Burgers',img:''},{id:genId(),name:'Beef Burger',price:500,cat:'Burgers'},{id:genId(),name:'Masala Fries',price:180,cat:'Fries'},{id:genId(),name:'Cola',price:80,cat:'Drinks'} ];
if(!localStorage.getItem(KEY_MENU)) save(KEY_MENU,SAMPLE_MENU);

function init(){
  const s = load(KEY_SETTINGS,{});
  if(s.logo) document.getElementById('logoImg').src = s.logo;
  if(s.name) { document.getElementById('siteTitle').textContent = s.name; document.getElementById('siteNameInput').value = s.name }
  if(s.contact) document.getElementById('contactInput').value = s.contact;
  applyTheme(s.theme||'black-gold');
  document.getElementById('themeSel').value = s.theme||'black-gold';
  renderMenu(); renderCart(); renderDeals(); renderReviews(); renderAdminList();
}

function applyTheme(name){
  if(name==='black-gold'){ document.documentElement.style.setProperty('--accent','#bfa54a'); document.documentElement.style.setProperty('--accent2','#ff6b35'); document.body.style.background='linear-gradient(180deg,#050509,#071021)'; }
  else { document.documentElement.style.setProperty('--accent','#ffb300'); document.documentElement.style.setProperty('--accent2','#e53935'); document.body.style.background='linear-gradient(180deg,#120000,#2a0505)'; }
}

document.getElementById('themeSel').addEventListener('change',e=>{ applyTheme(e.target.value); const s=load(KEY_SETTINGS,{}); s.theme=e.target.value; save(KEY_SETTINGS,s); showToast('Theme updated') });

// Logo upload
document.getElementById('uploadLogoBtn').addEventListener('click',()=>document.getElementById('logoFile').click());
document.getElementById('logoFile').addEventListener('change', async (e)=>{ const f=e.target.files[0]; if(!f) return; const data = await fileToDataUrl(f); document.getElementById('logoImg').src = data; const s=load(KEY_SETTINGS,{}); s.logo=data; save(KEY_SETTINGS,s); showToast('Logo uploaded') });
function fileToDataUrl(file){ return new Promise(res=>{ const r=new FileReader(); r.onload=e=>res(e.target.result); r.readAsDataURL(file); }) }

// Menu CRUD
function loadMenu(){ return load(KEY_MENU,[]) }
function saveMenu(m){ save(KEY_MENU,m); renderMenu(); renderAdminList(); }
function renderMenu(){
  const menu = loadMenu(); const container = document.getElementById('menu'); container.innerHTML='';
  const q = document.getElementById('search').value.trim().toLowerCase();
  menu.filter(it=>!q||it.name.toLowerCase().includes(q)||it.cat?.toLowerCase().includes(q)).forEach(it=>{
    const el = document.createElement('div'); el.className='menu-item';
    el.innerHTML = `<div class="menu-thumb"><img src="${it.img||''}" alt="" style="max-width:100%;height:100%;object-fit:cover"></div>
      <div class="menu-meta"><div class="menu-title">${escapeHtml(it.name)}</div><div class="small muted">${escapeHtml(it.cat||'')}</div><div class="small muted">$${numberFormat(it.price)}</div></div>
      <div style="display:flex;flex-direction:column;gap:8px"><button class="btn" data-add="${it.id}">Add</button><button class="btn ghost" data-view="${it.id}">Details</button></div>`;
    container.appendChild(el);
  })
  container.querySelectorAll('[data-add]').forEach(b=>b.addEventListener('click',()=>addToCart(b.getAttribute('data-add'))))
  container.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{ const id=b.getAttribute('data-view'); const m=loadMenu().find(x=>x.id===id); alert(`${m.name} — $${m.price}\n${m.cat||''}`) }))
}
document.getElementById('search').addEventListener('input',renderMenu);
document.getElementById('addItem').addEventListener('click',()=>{
  const name=document.getElementById('itemName').value.trim(); const p=Number(document.getElementById('itemPrice').value); const cat=document.getElementById('itemCat').value.trim(); const img=document.getElementById('itemImg').value.trim();
  if(!name||!p){ showToast('Name and price required'); return }
  const m = loadMenu(); m.unshift({id:genId(),name,price:p,cat,img}); saveMenu(m); document.getElementById('itemName').value=''; document.getElementById('itemPrice').value=''; document.getElementById('itemCat').value=''; document.getElementById('itemImg').value=''; showToast('Item added')
})

function renderAdminList(){ const box=document.getElementById('adminList'); box.innerHTML=''; const menu=loadMenu();
  menu.forEach(it=>{ const r=document.createElement('div'); r.style.display='flex'; r.style.justifyContent='space-between'; r.style.alignItems='center'; r.style.padding='6px'; r.style.borderBottom='1px dashed rgba(0,0,0,0.06)'; r.innerHTML = `<div><strong>${escapeHtml(it.name)}</strong><div class="small muted">$${numberFormat(it.price)} — ${escapeHtml(it.cat||'')}</div></div><div style="display:flex;gap:6px"><button class="btn ghost" data-edit="${it.id}">Edit</button><button class="btn ghost" data-delete="${it.id}">Delete</button></div>`; box.appendChild(r) })
  box.querySelectorAll('[data-delete]').forEach(b=>b.addEventListener('click',()=>{ if(confirm('Delete item?')){ const id=b.getAttribute('data-delete'); saveMenu(loadMenu().filter(x=>x.id!==id)); showToast('Deleted') } }))
  box.querySelectorAll('[data-edit]').forEach(b=>b.addEventListener('click',()=>{ const id=b.getAttribute('data-edit'); const m=loadMenu().find(x=>x.id===id); const n=prompt('Name',m.name); if(n===null) return; const pr=prompt('Price',m.price); if(pr===null) return; m.name=n; m.price=Number(pr)||m.price; const c=prompt('Category',m.cat||''); if(c!==null) m.cat=c; const im=prompt('Image URL',m.img||''); if(im!==null) m.img=im; saveMenu(loadMenu()); showToast('Updated') }))
}

// Cart
function loadCart(){ return load(KEY_CART,{}) }
function saveCart(c){ save(KEY_CART,c); renderCart() }
function addToCart(id){ const c = loadCart(); c[id]=(c[id]||0)+1; saveCart(c); showToast('Added to cart') }
function renderCart(){ const list=document.getElementById('cartList'); list.innerHTML=''; const cart = loadCart(); const menu=loadMenu(); let total=0;
  Object.keys(cart).forEach(id=>{ const qty=cart[id]; const it=menu.find(m=>m.id===id); if(!it) return; const row=document.createElement('div'); row.className='row'; row.style.justifyContent='space-between'; row.innerHTML = `<div><strong>${escapeHtml(it.name)} x ${qty}</strong><div class="small muted">$${it.price} each</div></div><div style="display:flex;flex-direction:column;align-items:flex-end"><div class="small">$${numberFormat(it.price*qty)}</div><div style="display:flex;gap:6px;margin-top:6px"><button class="btn ghost" data-dec="${id}">-</button><button class="btn ghost" data-inc="${id}">+</button><button class="btn ghost" data-rem="${id}">Remove</button></div></div>`; list.appendChild(row); total += it.price*qty; })
  document.getElementById('cartTotal').textContent = '$'+numberFormat(total);
  list.querySelectorAll('[data-inc]').forEach(b=>b.addEventListener('click',()=>{ const id=b.getAttribute('data-inc'); const c=loadCart(); c[id]=(c[id]||0)+1; saveCart(c) }))
  list.querySelectorAll('[data-dec]').forEach(b=>b.addEventListener('click',()=>{ const id=b.getAttribute('data-dec'); const c=loadCart(); c[id]=Math.max(0,(c[id]||0)-1); if(c[id]===0) delete c[id]; saveCart(c) }))
  list.querySelectorAll('[data-rem]').forEach(b=>b.addEventListener('click',()=>{ const id=b.getAttribute('data-rem'); const c=loadCart(); delete c[id]; saveCart(c) }))
}

// Checkout + Orders
document.getElementById('checkout').addEventListener('click',()=>{
  const cart = loadCart(); if(Object.keys(cart).length===0){ showToast('Cart is empty'); return }
  const menu = loadMenu(); const items=[]; let total=0; Object.keys(cart).forEach(id=>{ const it=menu.find(m=>m.id===id); if(!it) return; items.push({id:it.id,name:it.name,price:it.price,qty:cart[id]}); total += it.price*cart[id]; })
  const order = {id:'o'+Date.now(),date:new Date().toISOString(),items,total,delivery:document.getElementById('deliveryMode').value,payment:document.getElementById('paymentMode').value};
  const orders = load(KEY_ORDERS,[]); orders.unshift(order); save(KEY_ORDERS,orders); localStorage.removeItem(KEY_CART); renderCart(); showToast('Order placed — saved locally');
  const w=window.open('','_blank'); w.document.write(buildReceipt(order)); w.document.close();
})
function buildReceipt(o){ let rows=''; o.items.forEach(it=> rows+=`<tr><td>${escapeHtml(it.name)}</td><td>${it.qty}</td><td>$${it.price}</td><td>$${it.price*it.qty}</td></tr>`); return `<!doctype html><html><head><meta charset="utf-8"><title>Receipt</title></head><body><h2>Receipt — ${document.getElementById('siteTitle').textContent}</h2><p>Order: ${o.id}<br>Date: ${new Date(o.date).toLocaleString()}</p><table border="1">${rows}</table><h3>Total: $${o.total}</h3></body></html>` }

// Deals
function renderDeals(){ const deals = load(KEY_DEALS,[]); const el=document.getElementById('dealsList'); el.innerHTML=''; deals.forEach(d=>{ const b=document.createElement('div'); b.className='tag'; b.textContent=d; el.appendChild(b) }) }
document.getElementById('addDeal').addEventListener('click',()=>{ const t=document.getElementById('dealText').value.trim(); if(!t) return; const d=load(KEY_DEALS,[]); d.unshift(t); save(KEY_DEALS,d); document.getElementById('dealText').value=''; renderDeals(); showToast('Deal added') })

// Reviews
document.getElementById('rvSubmit').addEventListener('click',()=>{ const n=document.getElementById('rvName').value.trim()||'Guest'; const r=document.getElementById('rvRating').value; const t=document.getElementById('rvText').value.trim(); if(!t){ showToast('Write a review'); return } const rev=load(KEY_REVIEWS,[]); rev.unshift({id:genId(),name:n,rating:r,text:t,date:new Date().toISOString()}); save(KEY_REVIEWS,rev); document.getElementById('rvName').value=''; document.getElementById('rvText').value=''; renderReviews(); showToast('Thanks for review') })
function renderReviews(){ const list=load(KEY_REVIEWS,[]); const el=document.getElementById('reviewsList'); el.innerHTML=''; list.forEach(rv=>{ const d=document.createElement('div'); d.style.padding='8px'; d.style.borderBottom='1px solid rgba(0,0,0,0.06)'; d.innerHTML = `<strong>${escapeHtml(rv.name)}</strong> <span class="small muted">${new Date(rv.date).toLocaleString()} — ${rv.rating}/5</span><div>${escapeHtml(rv.text)}</div>`; el.appendChild(d) }) }

// Reservations
document.getElementById('resSubmit').addEventListener('click',()=>{ const name=document.getElementById('resName').value.trim(); const phone=document.getElementById('resPhone').value.trim(); const date=document.getElementById('resDate').value; const time=document.getElementById('resTime').value; const guests=document.getElementById('resGuests').value||1; if(!name||!phone||!date||!time){ showToast('Fill reservation details'); return } const r=load(KEY_RES,[]); r.unshift({id:genId(),name,phone,date,time,guests,created:new Date().toISOString()}); save(KEY_RES,r); document.getElementById('resName').value=''; document.getElementById('resPhone').value=''; document.getElementById('resDate').value=''; document.getElementById('resTime').value=''; document.getElementById('resGuests').value=''; showToast('Reservation saved') })
function renderReservations(){ /* admin view can read KEY_RES */ }

// Admin & settings
document.getElementById('adminBtn').addEventListener('click',()=>{ const pw=prompt('Enter admin password (default 1234)'); if(pw===null) return; if(pw==='1234'){ document.getElementById('adminPanel').style.display='block'; const s=load(KEY_SETTINGS,{}); if(s.name) document.getElementById('siteNameInput').value=s.name; showToast('Admin mode') } else showToast('Wrong password') })
document.getElementById('saveSettings').addEventListener('click',()=>{ const s=load(KEY_SETTINGS,{}); s.name=document.getElementById('siteNameInput').value.trim(); s.contact=document.getElementById('contactInput').value.trim(); if(document.getElementById('logoImg').src) s.logo=document.getElementById('logoImg').src; save(KEY_SETTINGS,s); if(s.name) document.getElementById('siteTitle').textContent=s.name; showToast('Settings saved') })

// Exports
document.getElementById('doExport').addEventListener('click',()=>{ const from = document.getElementById('exportFrom').value? new Date(document.getElementById('exportFrom').value) : null; const to = document.getElementById('exportTo').value? new Date(document.getElementById('exportTo').value) : null; const type = document.getElementById('exportType').value; const orders = load(KEY_ORDERS,[]).filter(o=>{ const d=new Date(o.date); if(from && d<from) return false; if(to && d> new Date(to.getFullYear(),to.getMonth(),to.getDate()+1)) return false; return true }); if(type==='csv'){ const csv = ordersToCSV(orders); downloadData(csv,'orders_export.csv','text/csv') } else { const j = JSON.stringify(orders,null,2); downloadData(j,'orders_export.json','application/json') } })
function ordersToCSV(ords){ const lines=['order_id,date,total,delivery,payment,items']; ords.forEach(o=>{ const items = o.items.map(i=>`${i.name} x${i.qty}`).join('|'); lines.push(`${o.id},"${o.date}",${o.total},${o.delivery},${o.payment},"${items.replace(/"/g,'""')}"`) }); return lines.join('\n') }
function downloadData(txt,filename,type){ const a=document.createElement('a'); const blob=new Blob([txt],{type:type}); a.href=URL.createObjectURL(blob); a.download=filename; a.click(); URL.revokeObjectURL(a.href); }
document.getElementById('exportBtn').addEventListener('click',()=>{ const to=new Date(); const from=new Date(); from.setDate(to.getDate()-30); document.getElementById('exportFrom').value = from.toISOString().slice(0,10); document.getElementById('exportTo').value = to.toISOString().slice(0,10); document.getElementById('exportType').value='csv'; document.getElementById('doExport').click(); })

// Clear local data
document.getElementById('clearData').addEventListener('click',()=>{ if(!confirm('Clear all local data (menus, orders, reviews, reservations)?')) return; localStorage.removeItem(KEY_MENU); localStorage.removeItem(KEY_CART); localStorage.removeItem(KEY_ORDERS); localStorage.removeItem(KEY_REVIEWS); localStorage.removeItem(KEY_DEALS); localStorage.removeItem(KEY_RES); localStorage.removeItem(KEY_SETTINGS); save(KEY_MENU,SAMPLE_MENU); renderMenu(); renderCart(); renderDeals(); showToast('Local data cleared') })

// Helpers
function numberFormat(n){ return Number(n).toLocaleString('en-US') }
function escapeHtml(s){ return (s||'').toString().replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }

init();
