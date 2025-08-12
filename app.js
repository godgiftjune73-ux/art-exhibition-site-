// Load artworks in gallery
function loadGallery() {
    const gallery = document.getElementById("gallery");
    if (!gallery) return;

    const artworks = JSON.parse(localStorage.getItem("artworks") || "[]");

    gallery.innerHTML = artworks.map((art, index) => `
        <div class="card">
            <img src="${art.image}" alt="${art.title}">
            <h3>${art.title}</h3>
            <p>$${art.price}</p>
            <button onclick="addToCart(${index})">Add to Cart</button>
            <a href="https://buy.stripe.com/test_14AdR93q8bhweZN8DLcZa00" target="_blank" class="buy-btn">Buy Now</a>
        </div>
    `).join("");
}

// Add artwork from dashboard
document.getElementById("uploadForm")?.addEventListener("submit", function(e) {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const price = parseFloat(document.getElementById("price").value);
    const image = document.getElementById("image").value;

    const artworks = JSON.parse(localStorage.getItem("artworks") || "[]");
    artworks.push({ title, price, image });
    localStorage.setItem("artworks", JSON.stringify(artworks));

    alert("Artwork added!");
    window.location.href = "gallery.html";
});

// Cart functions
function addToCart(index) {
    const artworks = JSON.parse(localStorage.getItem("artworks") || "[]");
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    cart.push(artworks[index]);
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
}

function loadCart() {
    const cartItems = document.getElementById("cartItems");
    if (!cartItems) return;

    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="card">
            <img src="${item.image}" alt="${item.title}">
            <h3>${item.title}</h3>
            <p>$${item.price}</p>
        </div>
    `).join("");
}

// Checkout button
document.getElementById("checkoutBtn")?.addEventListener("click", function() {
    window.open("https://buy.stripe.com/test_14AdR93q8bhweZN8DLcZa00", "_blank");
});

// Run correct loader
loadGallery();
loadCart();
