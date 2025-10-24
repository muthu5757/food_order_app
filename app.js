document.addEventListener('DOMContentLoaded', () => {
  const foodItems = [
  { id: 1, name: 'Margherita Pizza', price: 199, cat: 'Pizza', img: 'images/margheritapizza.jpg' },
  { id: 2, name: 'Cheese Burst Pizza', price: 249, cat: 'Pizza', img: 'images/CheeseBurstPizza.jpg' },
  { id: 3, name: 'Veggie Burger', price: 159, cat: 'Burger', img: 'images/vegb.jpg' },
  { id: 4, name: 'Chicken Burger', price: 189, cat: 'Burger', img: 'images/chickbur.jpg' },
  { id: 5, name: 'French Fries', price: 99, cat: 'Snacks', img: 'images/ff.jpg' },
  { id: 6, name: 'Coca Cola', price: 49, cat: 'Drinks', img: 'images/cc.jpg' },
  { id: 7, name: 'Cold Coffee', price: 89, cat: 'Drinks', img: 'images/ccof.jpg' },
  { id: 8, name: 'Chocolate Cake', price: 119, cat: 'Dessert', img: 'images/chococ.jpg' },
  { id: 9, name: 'Ice Cream Sundae', price: 99, cat: 'Dessert', img: 'images/ics.jpg' },
  { id: 10, name: 'Pasta Alfredo', price: 179, cat: 'Pasta', img: 'images/pastap.jpg' },
  { id: 11, name: 'Spicy Noodles', price: 129, cat: 'Chinese', img: 'images/sn.jpg' },
  { id: 12, name: 'Tandoori Chicken', price: 249, cat: 'Indian', img: 'images/tc.jpg' },
  { id: 13, name: 'Paneer Butter Masala', price: 199, cat: 'Indian', img: 'images/pbm.jpg' },
  { id: 14, name: 'Mojito', price: 79, cat: 'Drinks', img: 'images/moj.jpg' },
  { id: 15, name: 'Veg Sandwich', price: 99, cat: 'Snacks', img: 'images/vdgsand.jpg' },
  { id: 16, name: 'Chicken Biryani', price: 229, cat: 'Indian', img: 'images/cb.jpg' }
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
      return `<div class='bg-white rounded shadow p-5 text-center'>
    <div class='overflow-hidden rounded h-48'>
      <img src='${item.img}' class='w-full h-full object-cover'/>
    </div>
    <h3 class='font-semibold mt-2'>${item.name}</h3>
    <p>₹${item.price}</p>
    ${
      inCart 
      ? `<div class='flex justify-center gap-2 mt-1'>
          <button onclick='updateQty(${item.id},-1)' class='bg-orange-400 px-2 rounded text-white'>-</button>
          <span>${inCart.qty}</span>
          <button onclick='updateQty(${item.id},1)' class='bg-orange-400 px-2 rounded text-white'>+</button>
        </div>`
      : `<button onclick='addToCart(${item.id})' class='bg-orange-500 text-white px-3 py-1 rounded mt-1'>Add to Cart</button>`
    }
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

   if ("Notification" in window) {
    if (Notification.permission === "default") { // not granted or denied yet
      Notification.requestPermission();
    }
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
      totalEl.textContent = 'Total: ₹' + total + ' (Cash On Delivery Only !)';
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
