const API_URL = "YOUR_SCRIPT_URL";

// Load Menu
async function loadMenu() {
  const res = await fetch(API_URL);
  const items = await res.json();
  const menuDiv = document.getElementById("menu-list");
  items.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<div><b>${item.name}</b><br>${item.desc}</div><div>Rs ${item.price}</div>`;
    menuDiv.appendChild(div);
  });
}

// Order Page
function initOrderPage() {
  document.getElementById("orderForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      type: "order",
      name: form.name.value,
      phone: form.phone.value,
      address: form.address.value,
      items: [], // (you can extend to add cart items)
      total: document.getElementById("orderTotal").innerText
    };
    const res = await fetch(API_URL, {
      method:"POST",
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    document.getElementById("orderMsg").innerText = data.status==="success" ? "Order placed!" : "Error!";
  });
}

// Contact Page
function initContactPage() {
  document.getElementById("contactForm").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      type: "contact",
      name: form.name.value,
      email: form.email.value,
      message: form.message.value
    };
    const res = await fetch(API_URL, {
      method:"POST",
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    document.getElementById("contactMsg").innerText = data.status==="success" ? "Message sent!" : "Error!";
  });
}
