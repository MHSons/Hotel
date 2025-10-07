
const MENU = [
  { id: 'b1', category: 'Burgers', title: 'Classic Burger', price: 450, img: 'images/burger1.jpg' },
  { id: 'b2', category: 'Burgers', title: 'Cheese Burger', price: 550, img: 'images/burger2.jpg' },
  { id: 'f1', category: 'Sides', title: 'Crispy Fries', price: 199, img: 'images/fries1.jpg' },
  { id: 'd1', category: 'Drinks', title: 'Cold Drink', price: 99, img: 'images/drink1.jpg' }
];
let cart = JSON.parse(localStorage.getItem('mc_cart')||'[]');
function saveCart(){ localStorage.setItem('mc_cart', JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){ const el=document.getElementById('cartCount'); if(el) el.textContent = cart.reduce((s,i)=>s+i.qty,0); }
function renderMenu(){ const grid=document.getElementById('menuGrid'); if(!grid) return; grid.innerHTML=''; MENU.forEach(i=>{ const card=document.createElement('div'); card.className='card'; card.innerHTML = `<img src="${i.img}" alt="${i.title}"><h4 style="margin-top:8px">${i.title}</h4><div style="color:#777">Rs ${i.price}</div><div style="margin-top:8px"><button onclick="addToCart('${i.id}')" class="btn">Add</button></div>`; grid.appendChild(card); }); }
function addToCart(id){ const item=MENU.find(m=>m.id===id); const existing=cart.find(c=>c.id===id); if(existing) existing.qty++; else cart.push({...item, qty:1}); saveCart(); alert(item.title+' added to cart'); }
function init(){ renderMenu(); updateCartCount(); }
document.addEventListener('DOMContentLoaded', init);
