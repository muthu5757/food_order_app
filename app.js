document.addEventListener('DOMContentLoaded', () => {
  const foodItems = [
    { id: 1, name: 'Margherita Pizza', price: 199, cat: 'Pizza', img: 'images/food1.jpg' },
    { id: 2, name: 'Cheese Burger', price: 149, cat: 'Burger', img: 'images/food1.jpg' },
    { id: 3, name: 'Coca Cola', price: 49, cat: 'Drinks', img: 'images/food1.jpg' },
    { id: 4, name: 'Chocolate Cake', price: 99, cat: 'Dessert', img: 'images/food1.jpg' }
  ];

  const listEl = document.getElementById('food-list');
  const searchEl = document.getElementById('search');
  const categoryBtns = document.querySelectorAll('.category-btn');

  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let currentCategory = 'All';

  function displayItems() {
    if (!listEl) return;
    let filtered = foodItems.filter(item => 
      (currentCategory === 'All' || item.cat === currentCategory) &&
      (!searchEl.value || item.name.toLowerCase().includes(searchEl.value.toLowerCase()))
    );
    listEl.innerHTML = filtered.map(item => {
      const inCart = cart.find(c => c.id === item.id);
      return `<div class='bg-white rounded shadow p-2 text-center'>
        <img src='${item.img}' class='w-full h-28 object-cover rounded'/>
        <h3 class='font-semibold mt-2'>${item.name}</h3>
        <p>₹${item.price}</p>
        ${inCart ? 
          `<div class='flex justify-center gap-2 mt-1'>
             <button onclick='updateQty(${item.id},-1)' class='bg-orange-400 px-2 rounded text-white'>-</button>
             <span>${inCart.qty}</span>
             <button onclick='updateQty(${item.id},1)' class='bg-orange-400 px-2 rounded text-white'>+</button>
           </div>`
          :
          `<button onclick='addToCart(${item.id})' class='bg-orange-500 text-white px-3 py-1 rounded mt-1'>Add to Cart</button>`}
      </div>`;
    }).join('');
  }

  function showOrderNotification() {
  // Check if the Notification API is supported
    if ("Notification" in window) {
      // Request permission inside user action
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("QuickEats 🍔", {
            body: `Your order has been placed successfully! 🎉`,
            icon: "images/icon-192x192.png"
          });
        } else {
          console.log("Notification permission denied.");
        }
      });
    } else {
      console.log("This browser does not support notifications.");
    }
  }

  window.addToCart = (id) => {
    const item = foodItems.find(i => i.id === id);
    cart.push({ ...item, qty: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    displayItems();
  };

  window.updateQty = (id, delta) => {
    cart = cart.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayItems();
  };

  if (categoryBtns) {
    categoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.dataset.cat;
        displayItems();
      });
    });
  }

  if (searchEl) {
    searchEl.addEventListener('input', displayItems);
  }

  // CART PAGE
  const cartEl = document.getElementById('cart-items');
  if (cartEl) {
    const totalEl = document.getElementById('cart-total');
    function renderCart() {
      cartEl.innerHTML = cart.map(c => 
        `<div class='flex justify-between border-b p-2'>
          <span>${c.name} (${c.qty})</span><span>₹${c.price * c.qty}</span>
        </div>`
      ).join('');
      const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
      totalEl.textContent = 'Total: ₹' + total;
    }
    renderCart();

    document.getElementById('orderForm').addEventListener('submit', (e) => {
      e.preventDefault();
      showOrderNotification();
      alert('Order placed successfully 🎉');
      let history = JSON.parse(localStorage.getItem('orders')) || [];
      history.push({ date: new Date().toLocaleString(), items: cart });
      localStorage.setItem('orders', JSON.stringify(history));
      cart = [];
      localStorage.removeItem('cart');
      renderCart();
    });
  }

  // SETTINGS PAGE
  const historyEl = document.getElementById('orderHistory');
  if (historyEl) {
    const history = JSON.parse(localStorage.getItem('orders')) || [];
    historyEl.innerHTML = history.map(h => `<li>${h.date} - ${h.items.length} items</li>`).join('');
  }

  // Carousel
  const carousel = document.getElementById('carousel');
  if (carousel) {
    let index = 0;
    setInterval(() => {
      index = (index + 1) % 3;
      carousel.style.transform = `translateX(-${index * 100}%)`;
    }, 3000);
  }

  // Loading
  const loading = document.getElementById('loading');
  if (loading) setTimeout(() => loading.style.display = 'none', 1000);

  displayItems();
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const installBtn = document.getElementById('installBtn');
  installBtn.classList.remove('hidden');

  installBtn.addEventListener('click', async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      alert('🎉 QuickEats installed successfully!');
    }
    installBtn.classList.add('hidden');
  });
});

window.addEventListener('appinstalled', () => {
  document.getElementById('installBtn').classList.add('hidden');
});
