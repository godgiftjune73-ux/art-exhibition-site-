/* ===== Utility Functions ===== */
function getArtworks() {
  return JSON.parse(localStorage.getItem("artworks") || "[]");
}

function saveArtworks(data) {
  localStorage.setItem("artworks", JSON.stringify(data));
}

function getCart() {
  return JSON.parse(localStorage.getItem("cart") || "[]");
}

function saveCart(data) {
  localStorage.setItem("cart", JSON.stringify(data));
}

/* ===== Sample Artworks (only added if empty) ===== */
if (getArtworks().length === 0) {
  saveArtworks([
    { title: "Sunset Bliss", artist: "Alice", medium: "Painting", price: 150, image: "https://picsum.photos/300?1" },
    { title: "Urban Life", artist: "Bob", medium: "Photography", price: 200, image: "https://picsum.photos/300?2" },
    { title: "Dreamscape", artist: "Clara", medium: "Digital", price: 100, image: "https://picsum.photos/300?3" }
  ]);
}

/* ===== Update Cart Count ===== */
function updateCartCount() {
  const count = getCart().length;
  const cartCount = document.getElementById("cart-count");
  if (cartCount) cartCount.textContent = count;
}

/* ===== Render Featured (Homepage) ===== */
function renderFeatured() {
  const container = document.getElementById("featured-gallery");
  if (!container) return;
  const artworks = getArtworks().slice(0, 3);
  container.innerHTML = artworks.map((a, i) => `
    <div class="card">
      <img src="${a.image}" alt="${a.title}">
      <h3>${a.title}</h3>
      <p>by ${a.artist}</p>
      <p>$${a.price}</p>
      <button onclick="openModal(${i})">View</button>
    </div>
  `).join("");
}

/* ===== Render Gallery (Gallery Page) ===== */
function renderGallery() {
  const container = document.getElementById("gallery");
  if (!container) return;

  let artworks = getArtworks();
  const search = document.getElementById("search");
  const filterMedium = document.getElementById("filter-medium");

  function update() {
    let filtered = artworks;
    if (search && search.value) {
      const term = search.value.toLowerCase();
      filtered = filtered.filter(a =>
        a.title.toLowerCase().includes(term) ||
        a.artist.toLowerCase().includes(term)
      );
    }
    if (filterMedium && filterMedium.value) {
      filtered = filtered.filter(a => a.medium === filterMedium.value);
    }
    container.innerHTML = filtered.map((a, i) => `
      <div class="card">
        <img src="${a.image}" alt="${a.title}">
        <h3>${a.title}</h3>
        <p>by ${a.artist}</p>
        <p>${a.medium}</p>
        <p>$${a.price}</p>
        <button onclick="openModal(${i})">View</button>
      </div>
    `).join("");
  }

  if (search) search.addEventListener("input", update);
  if (filterMedium) filterMedium.addEventListener("change", update);

  update();
}

/* ===== Modal Logic ===== */
function openModal(index) {
  const modal = document.getElementById("art-modal");
  if (!modal) return;
  const artwork = getArtworks()[index];
  document.getElementById("modal-img").src = artwork.image;
  document.getElementById("modal-title").textContent = artwork.title;
  document.getElementById("modal-artist").textContent = "by " + artwork.artist;
  document.getElementById("modal-medium").textContent = artwork.medium;
  document.getElementById("modal-price").textContent = artwork.price;
  document.getElementById("modal-add").onclick = () => {
    const cart = getCart();
    cart.push(artwork);
    saveCart(cart);
    updateCartCount();
    modal.classList.add("hidden");
  };
  modal.classList.remove("hidden");

  const closeBtn = document.getElementById("close-modal");
  if (closeBtn) closeBtn.onclick = () => modal.classList.add("hidden");
}

/* ===== Dashboard Logic ===== */
function dashboardInit() {
  const loginBtn = document.getElementById("login-btn");
  const artistNameInput = document.getElementById("artist-name");
  const dashboardSection = document.getElementById("dashboard-section");
  const loginSection = document.getElementById("login-section");
  const artistDisplay = document.getElementById("artist-display");
  const uploadForm = document.getElementById("upload-form");
  const artistListings = document.getElementById("artist-listings");

  let currentArtist = localStorage.getItem("artist");

  function showDashboard() {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    artistDisplay.textContent = currentArtist;
    renderListings();
  }

  function renderListings() {
    const myArtworks = getArtworks().filter(a => a.artist === currentArtist);
    artistListings.innerHTML = myArtworks.map(a => `
      <div class="card">
        <img src="${a.image}" alt="${a.title}">
        <h3>${a.title}</h3>
        <p>${a.medium}</p>
        <p>$${a.price}</p>
      </div>
    `).join("");
  }

  if (currentArtist) showDashboard();

  if (loginBtn) {
    loginBtn.onclick = () => {
      if (artistNameInput.value.trim()) {
        currentArtist = artistNameInput.value.trim();
        localStorage.setItem("artist", currentArtist);
        showDashboard();
      }
    };
  }

  if (uploadForm) {
    uploadForm.onsubmit = (e) => {
      e.preventDefault();
      const title = document.getElementById("title").value.trim();
      const medium = document.getElementById("medium").value.trim();
      const price = parseFloat(document.getElementById("price").value);
      const image = document.getElementById("image-url").value.trim();

      if (title && medium && price && image) {
        const artworks = getArtworks();
        artworks.push({ title, artist: currentArtist, medium, price, image });
        saveArtworks(artworks);
        renderListings();
        uploadForm.reset();
      }
    };
  }
}

/* ===== Cart Page Logic ===== */
function cartInit() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (!cartItems) return;

  function renderCart() {
    const cart = getCart();
    cartItems.innerHTML = cart.map((a, i) => `
      <div class="card">
        <img src="${a.image}" alt="${a.title}">
        <h3>${a.title}</h3>
        <p>by ${a.artist}</p>
        <p>$${a.price}</p>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `).join("");
    cartTotal.textContent = cart.reduce((sum, a) => sum + a.price, 0);
  }

  window.removeFromCart = function(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    updateCartCount();
    renderCart();
  };

  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      alert("Thank you for your purchase!");
      saveCart([]);
      updateCartCount();
      renderCart();
    };
  }

  renderCart();
}

/* ===== Global Init ===== */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  updateCartCount();
  renderFeatured();
  renderGallery();
  dashboardInit();
  cartInit();
});
