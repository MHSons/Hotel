const APPS_SCRIPT_URL = "GOOGLE_APPS_SCRIPT_URL"; // Replace with your Google Apps Script URL

let menu = [];
let cart = [];

async function loadMenu(){
  try {
    const res = await fetch('menu.json');
    menu = await res.json();
    renderMenu();
  } catch (e) {
    document.getElementById('menu-items').innerText = "Failed to load menu.";
  }
}

function renderMenu(){
  const container = document.getElementById('menu-items');
  container.innerHTML = '';
  menu.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `<div><strong>${item.name}</strong><div style="font-size:12px">${item.desc}</div></div>
                     <div><div>Rs ${item.price}</div><button data-id="${item.id}">Add</button></div>`;
    container.appendChild(div);
  });
  container.querySelectorAll('button').forEach(btn => btn.onclick = () => addToCart(parseInt(btn.dataset.id)));
}

function addToCart(id){
  const item = menu.find(m=>m.id===id);
  if(!item) return;
  const existing = cart.find(c=>c.id===id);
  if(existing) existing.qty++;
  else cart.push({...item, qty:1});
  renderCart();
}

function renderCart(){
  const list = document.getElementById('cart-list');
  list.innerHTML = '';
  let total = 0;
  cart.forEach(ci => {
    total += ci.price * ci.qty;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `<div>${ci.name} x ${ci.qty}</div><div>Rs ${ci.price * ci.qty}</div>`;
    list.appendChild(div);
  });
  document.getElementById('totalAmount').innerText = total;
}

document.getElementById('orderForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const phone = form.phone.value.trim();
  const address = form.address.value.trim();
  if(!name || !phone || !address || cart.length===0){ alert('Please complete form and add items'); return; }
  const total = cart.reduce((s,i)=>s + i.price*i.qty, 0);
  const payload = { name, phone, address, items: cart, total };
  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {'Content-Type':'application/json'}
    });
    const data = await res.json();
    if(data.status === 'success') {
      document.getElementById('msg').innerText = "Order received! Thank you.";
      cart = [];
      renderCart();
      form.reset();
    } else {
      document.getElementById('msg').innerText = "Error saving order: " + (data.message||'');
    }
  } catch (err) {
    document.getElementById('msg').innerText = "Network error: " + err;
  }
});

loadMenu();
