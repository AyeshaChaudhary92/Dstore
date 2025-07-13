// Load products from products.xml when #products exists
document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("products")) {
    loadXMLProducts();  // Rename and create a new function
  }

  if (document.getElementById("cart-items")) {
    displayCart(); // For checkout.html
  }
});

function loadXMLProducts() {
  fetch("products.xml")
    .then(res => res.text())
    .then(data => {
      const parser = new DOMParser();
      const xml = parser.parseFromString(data, "application/xml");
      const products = xml.getElementsByTagName("product");
      const container = document.getElementById("xml-products");

      container.innerHTML = ""; // Clear before inserting

      for (let i = 0; i < products.length; i++) {
        const name = products[i].getElementsByTagName("name")[0].textContent;
        const price = products[i].getElementsByTagName("price")[0].textContent;
        const image = products[i].getElementsByTagName("image")[0].textContent;

        const productCard = `
          <div class="product-card">
            <img src="${image}" alt="${name}">
            <h3>${name}</h3>
            <p>$${parseFloat(price).toFixed(2)}</p>
            <button onclick="addToCartXML('${name}', ${parseFloat(price)})">Add to Cart</button>
          </div>
        `;
        container.innerHTML += productCard;
      }
    })
    .catch(err => console.error("XML Product Load Error:", err));
}




// Save product to cart (localStorage)
function addToCartXML(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ name, price, qty: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}




// === Display Cart ===
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const container = document.getElementById("cart-items");
  const totalDiv = document.getElementById("total");
  let total = 0;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    totalDiv.textContent = "";
    return;
  }

  container.innerHTML = `
    <table>
      <tr>
        <th>Product</th>
        <th>Qty</th>
        <th>Price</th>
        <th>Subtotal</th>
        <th>Action</th>
      </tr>
      ${cart
        .map((item, index) => {
          const subtotal = item.qty * item.price;
          total += subtotal;
          return `
            <tr>
              <td>${item.name}</td>
              <td>
                <button onclick="updateQty(${index}, -1)">➖</button>
                ${item.qty}
                <button onclick="updateQty(${index}, 1)">➕</button>
              </td>
              <td>$${item.price.toFixed(2)}</td>
              <td>$${subtotal.toFixed(2)}</td>
              <td><button onclick="removeItem(${index})">🗑️ Remove</button></td>
            </tr>
          `;
        })
        .join("")}
    </table>
    <button onclick="clearCart()" style="margin-top: 20px;">🧹 Clear Cart</button>
    <button onclick="placeOrder()" style="margin-top: 20px; margin-left: 10px;">✅ Place Order</button>
  `;

  totalDiv.textContent = `Total: $${total.toFixed(2)}`;
}

// === Update Quantity ===
function updateQty(index, change) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart[index].qty += change;

  if (cart[index].qty < 1) {
    cart.splice(index, 1); // Remove item if qty < 1
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// === Remove Item ===
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem("cart"));
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// === Clear Cart ===
function clearCart() {
  if (confirm("Are you sure you want to clear your cart?")) {
    localStorage.removeItem("cart");
    displayCart();
  }
}

// === Place Order ===
function placeOrder() {
  alert("Thank you for your order!");
  localStorage.removeItem("cart");
  displayCart();
}










// Load MEN Products
fetch('data/men-products.json')
  .then(res => res.json())
  .then(data => {
    const menSection = document.getElementById('men-products-section');
    data.forEach(product => {
      menSection.innerHTML += `
        <div class="product-card">
          <img src="${product.image}" alt="${product.name}">
          <h3>${product.name}</h3>
          <p>$${product.price.toFixed(2)}</p>
          <button onclick="addToCart(${product.id}, 'men')">Add to Cart</button>
        </div>
      `;
    });
  });

// Dummy cart function
function addToCart(id, category) {
  alert(`Product ${id} from ${category} category added to cart.`);
}


// Save item to localStorage
function addToCart(name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}



document.addEventListener("DOMContentLoaded", () => {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartSection = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const checkoutArea = document.getElementById("checkoutArea");

  function updateCartUI() {
    if (cart.length === 0) {
      cartSection.innerHTML = "<p>Your cart is empty.</p>";
      cartTotal.innerHTML = "";
      checkoutArea.innerHTML = "";
      return;
    }

    let total = 0;
    cartSection.innerHTML = "";

    cart.forEach((item, index) => {
      const quantity = item.quantity || 1;
      const itemTotal = item.price * quantity;
      total += itemTotal;

      cartSection.innerHTML += `
        <div class="cart-item">
          <span>${item.name}</span>
          <span>Rs ${itemTotal.toFixed(2)}</span>
          <div>
            <button onclick="changeQuantity(${index}, -1)">−</button>
            <span>${quantity}</span>
            <button onclick="changeQuantity(${index}, 1)">+</button>
            <button onclick="removeItem(${index})">🗑️</button>
          </div>
        </div>
      `;
    });

    cartTotal.innerHTML = `<strong>Total:</strong> Rs ${total.toFixed(2)}`;
    checkoutArea.innerHTML = `<button onclick="goToCheckout()">Proceed to Checkout</button>`;
  }

  window.changeQuantity = function (index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  };

  window.removeItem = function (index) {
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  };

  window.goToCheckout = function () {
    alert("Redirecting to checkout page...");
    // window.location.href = "checkout.html";
  };

  updateCartUI();
});






// Update cart count on page load
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();
});

function addToCart(productId) {
  // Get existing cart
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Add product
  cart.push(productId);
  localStorage.setItem("cart", JSON.stringify(cart));

  // Update counter
  updateCartCount();

  // Optional: show notification
  showNotification("Product added to cart!");
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const countElement = document.getElementById("cart-count");
  countElement.textContent = cart.length;
}



