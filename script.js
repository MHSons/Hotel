// Save Menu
function addMenu() {
  let menu = JSON.parse(localStorage.getItem("menu")) || [];
  let name = document.getElementById("menuName").value;
  let price = document.getElementById("menuPrice").value;
  menu.push({ name, price });
  localStorage.setItem("menu", JSON.stringify(menu));
  alert("Menu item added!");
}

// Load Menu
function loadMenu() {
  let menu = JSON.parse(localStorage.getItem("menu")) || [];
  let html = "";
  menu.forEach(item => {
    html += `<p>${item.name} - $${item.price}</p>`;
  });
  document.getElementById("menuList").innerHTML = html;
}

// Save Deal
function addDeal() {
  let deals = JSON.parse(localStorage.getItem("deals")) || [];
  let name = document.getElementById("dealName").value;
  let items = document.getElementById("dealItems").value;
  let price = document.getElementById("dealPrice").value;
  deals.push({ name, items, price });
  localStorage.setItem("deals", JSON.stringify(deals));
  alert("Deal added!");
}

// Load Deals
function loadDeals() {
  let deals = JSON.parse(localStorage.getItem("deals")) || [];
  let html = "";
  deals.forEach(d => {
    html += `<p><b>${d.name}</b> - ${d.items} - $${d.price}</p>`;
  });
  document.getElementById("dealList").innerHTML = html;
}

// Save Gallery
function addGallery() {
  let gallery = JSON.parse(localStorage.getItem("gallery")) || [];
  let url = document.getElementById("galleryUrl").value;
  gallery.push(url);
  localStorage.setItem("gallery", JSON.stringify(gallery));
  alert("Image added!");
}

// Load Gallery
function loadGallery() {
  let gallery = JSON.parse(localStorage.getItem("gallery")) || [];
  let html = "";
  gallery.forEach(img => {
    html += `<img src="${img}" width="150"> `;
  });
  document.getElementById("galleryList").innerHTML = html;
}

// Save Order
function saveOrder() {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let name = document.getElementById("customerName").value;
  let phone = document.getElementById("customerPhone").value;
  let order = document.getElementById("customerOrder").value;
  orders.push({ name, phone, order });
  localStorage.setItem("orders", JSON.stringify(orders));
  alert("Order saved!");
}

// Save Contact
function saveContact() {
  let contacts = JSON.parse(localStorage.getItem("contacts")) || [];
  let name = document.getElementById("contactName").value;
  let msg = document.getElementById("contactMsg").value;
  contacts.push({ name, msg });
  localStorage.setItem("contacts", JSON.stringify(contacts));
  alert("Message saved!");
}
