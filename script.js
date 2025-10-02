// 🛒 Update Cart Badge in Navbar
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.getElementById("cartCount");
  if (badge) {
    badge.innerText = cart.length;
    badge.style.display = cart.length > 0 ? "inline-flex" : "none";
  }
}
document.addEventListener("DOMContentLoaded", updateCartBadge);

// 🛒 Add item to cart (global)
function addToCart(name, price) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
  alert(`${name} added to cart ✅`);
}

// 🛒 Remove item from cart
function removeFromCart(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

// 📦 Clear entire cart
function clearCart() {
  localStorage.removeItem("cart");
  updateCartBadge();
}

// 🎉 Deals Popup (Optional)
function showDealPopup(message) {
  const popup = document.createElement("div");
  popup.className = "fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-bounce";
  popup.innerText = message;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 4000);
}

// 🍔 Auto Deals Example
document.addEventListener("DOMContentLoaded", () => {
  const dealsShown = sessionStorage.getItem("dealsShown");
  if (!dealsShown) {
    showDealPopup("🔥 Special Deal: Get 20% OFF on all buckets today!");
    sessionStorage.setItem("dealsShown", "true");
  }
});
