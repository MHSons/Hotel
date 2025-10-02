/* 🌐 app.js — Cart + Checkout System */

// 🥡 Dummy menu data (aap backend se load bhi kar sakte hain later)
const menu = [
  { id: 1, name: "Classic Burger", price: 450, category: "Burgers", img: "img/burger1.jpg" },
  { id: 2, name: "Cheese Burger", price: 550, category: "Burgers", img: "img/burger2.jpg" },
  { id: 3, name: "Chicken Zinger", price: 600, category: "Burgers", img: "img/burger3.jpg" },
  { id: 4, name: "Fries Box", price: 250, category: "Sides", img: "img/fries.jpg" },
  { id: 5, name: "Coke 500ml", price: 120, category: "Drinks", img: "img/coke.jpg" },
  { id: 6, name: "Cold Coffee", price: 300, category: "Drinks", img: "img/coffee.jpg" }
];

let cart = JSON.parse(localStorage.getItem("fb_cart")) || [];

// 🧠 Render categories
const categoriesDiv = document.getElementById("categories");
const uniqueCats = ["All", ...new Set(menu.map(item => item.category))];
uniqueCats.forEach(cat => {
  const btn = document.createElement("button");
  btn.textContent = cat;
  btn.className = "px-4 py-2 bg-gray-200 rounded hover:bg-red-600 hover:text-white";
  btn.onclick = () => renderMenu(cat);
  categoriesDiv.appendChild(btn);
});

// 🍔 Render menu items
function renderMenu(filter = "All") {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";
  menu
    .filter(item => filter === "All" || item.category === filter)
    .forEach(item => {
      const card = document.createElement("div");
      card.className = "bg-white rounded shadow p-3 flex flex-col";
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="rounded mb-2 h-40 object-cover">
        <h4 class="font-bold text-lg">${item.name}</h4>
        <p class="text-gray-500">Rs ${item.price}</p>
        <button class="mt-auto bg-red-600 text-white px-3 py-2 rounded" onclick="addToCart(${item.id})">
          Add to Cart
        </button>
      `;
      grid.appendChild(card);
    });
}
renderMenu();

// 🛒 Add to Cart
function addToCart(id) {
  const product = menu.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  renderCartCount();
}

// 💾 Save & render cart
function saveCart() {
  localStorage.setItem("fb_cart", JSON.stringify(cart));
}
function renderCartCount() {
  document.getElementById("cartCount").textContent = cart.reduce((a, c) => a + c.qty, 0);
}
renderCartCount();

// 🛍️ Show Cart Modal
const cartModal = document.getElementById("cartModal");
document.getElementById("cartBtn").onclick = () => {
  renderCart();
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
};
document.getElementById("closeCart").onclick = () => cartModal.classList.add("hidden");

function renderCart() {
  const list = document.getElementById("cartItems");
  list.innerHTML = "";
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b pb-2";
    div.innerHTML = `
      <div>
        <h5 class="font-semibold">${item.name}</h5>
        <p class="text-sm">Rs ${item.price} × ${item.qty}</p>
      </div>
      <div class="flex gap-2 items-center">
        <button onclick="updateQty(${item.id}, -1)" class="px-2 bg-gray-200 rounded">-</button>
        <button onclick="updateQty(${item.id}, 1)" class="px-2 bg-gray-200 rounded">+</button>
        <button onclick="removeItem(${item.id})" class="px-2 bg-red-600 text-white rounded">x</button>
      </div>
    `;
    list.appendChild(div);
  });
  document.getElementById("cartTotal").textContent = total;
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  }
  saveCart();
  renderCart();
  renderCartCount();
}
function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
  renderCartCount();
}

document.getElementById("clearCart").onclick = () => {
  cart = [];
  saveCart();
  renderCart();
  renderCartCount();
};

// 💳 Checkout
const checkoutModal = document.getElementById("checkoutModal");
document.getElementById("checkoutBtn").onclick = () => {
  cartModal.classList.add("hidden");
  checkoutModal.classList.remove("hidden");
  checkoutModal.classList.add("flex");
};
document.getElementById("cancelCheckout").onclick = () => checkoutModal.classList.add("hidden");

document.getElementById("checkoutForm").onsubmit = e => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  const orderText = cart.map(i => `${i.name} × ${i.qty}`).join(", ");
  const total = cart.reduce((a, c) => a + c.price * c.qty, 0);
  const message = `🍔 *New Order*%0A👤 ${data.name}%0A📞 ${data.phone}%0A🏠 ${data.address}%0A💳 ${data.payment}%0A🧾 ${orderText}%0A💰 Total: Rs ${total}`;

  // Save to localStorage for admin panel
  const orders = JSON.parse(localStorage.getItem("fb_orders")) || [];
  orders.push({ ...data, cart, total, time: new Date().toISOString() });
  localStorage.setItem("fb_orders", JSON.stringify(orders));

  // Clear cart
  cart = [];
  saveCart();
  renderCartCount();

  // Open WhatsApp
  window.open(`https://wa.me/923000000000?text=${message}`, "_blank");
  alert("✅ Order placed successfully!");
  checkoutModal.classList.add("hidden");
};
