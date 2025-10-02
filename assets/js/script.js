// ===== MENU MANAGEMENT =====
function loadMenu() {
  let menu = JSON.parse(localStorage.getItem("menu")) || [];
  let menuList = document.getElementById("menuList");
  let menuTableBody = document.getElementById("menuTableBody");

  // For menu.html
  if (menuList) {
    menuList.innerHTML = "";
    menu.forEach(item => {
      menuList.innerHTML += `
        <div class="bg-white rounded-lg shadow-md p-4 text-center">
          <img src="${item.image || 'assets/img/placeholder.png'}" class="h-40 w-full object-cover rounded mb-3">
          <h3 class="text-xl font-bold">${item.name}</h3>
          <p class="text-gray-600">${item.category}</p>
          <p class="text-red-600 font-semibold">Rs. ${item.price}</p>
        </div>
      `;
    });
  }

  // For admin.html
  if (menuTableBody) {
    menuTableBody.innerHTML = "";
    menu.forEach((item, index) => {
      menuTableBody.innerHTML += `
        <tr class="border-b">
          <td class="p-2">${item.name}</td>
          <td class="p-2">Rs. ${item.price}</td>
          <td class="p-2">${item.category}</td>
          <td class="p-2"><img src="${item.image || 'assets/img/placeholder.png'}" class="h-12"></td>
          <td class="p-2">
            <button onclick="deleteMenuItem(${index})" class="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
          </td>
        </tr>
      `;
    });
  }
}

// Add Menu Item
document.getElementById("menuForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  let menu = JSON.parse(localStorage.getItem("menu")) || [];

  let newItem = {
    name: document.getElementById("itemName").value,
    price: document.getElementById("itemPrice").value,
    category: document.getElementById("itemCategory").value,
    image: document.getElementById("itemImage").value
  };

  menu.push(newItem);
  localStorage.setItem("menu", JSON.stringify(menu));
  this.reset();
  loadMenu();
});

// Delete Menu Item
function deleteMenuItem(index) {
  let menu = JSON.parse(localStorage.getItem("menu")) || [];
  menu.splice(index, 1);
  localStorage.setItem("menu", JSON.stringify(menu));
  loadMenu();
}

// Load menu when page loads
window.onload = loadMenu;
