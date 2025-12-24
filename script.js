/* =====================================================
   TravelGo script.js  (FULL VERSION)
   Demo only – no real payment / backend
===================================================== */

/* ---------- Utility ---------- */
const $ = (id) => document.getElementById(id);
const money = (n) => "$" + n.toLocaleString("en-US");

/* ---------- Tour Data ---------- */
const TOURS = [
  {
    id: "JPN-001",
    title: "Tokyo + Fuji 5D4N",
    region: "Japan",
    page: "japan.html",
    days: 5,
    theme: "City",
    rating: 4.8,
    price: 32900,
    img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80",
    desc: "City highlights, Mt. Fuji day trip, and free time for shopping.",
    includes: ["Hotel 4 nights", "Airport transfer", "Mt. Fuji tour"]
  },
  {
    id: "JPN-002",
    title: "Hokkaido Snow & Onsen 6D5N",
    region: "Japan",
    page: "japan.html",
    days: 6,
    theme: "Nature",
    rating: 4.9,
    price: 48900,
    img: "https://images.unsplash.com/photo-1545243424-0ce743321e11?auto=format&fit=crop&w=1400&q=80",
    desc: "Winter scenery, hot springs, and local seafood.",
    includes: ["Hotel 5 nights", "Onsen pass", "Coach transport"]
  },
  {
    id: "KOR-001",
    title: "Seoul Food & Shopping 4D3N",
    region: "Korea",
    page: "korea.html",
    days: 4,
    theme: "Food",
    rating: 4.6,
    price: 19900,
    img: "https://images.unsplash.com/photo-1534270804882-6b5048b1c1fc?auto=format&fit=crop&w=1400&q=80",
    desc: "Markets, cafes, and shopping streets.",
    includes: ["Hotel 3 nights", "Transport card", "Food map"]
  },
  {
    id: "SEA-001",
    title: "Bangkok Night Market 4D3N",
    region: "SEA",
    page: "sea.html",
    days: 4,
    theme: "Food",
    rating: 4.7,
    price: 17900,
    img: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1400&q=80",
    desc: "Street food, temples, and night markets.",
    includes: ["Hotel 3 nights", "Airport pickup", "Market guide"]
  },
  {
    id: "EUR-001",
    title: "Paris + Rome 8D7N",
    region: "Europe",
    page: "europe.html",
    days: 8,
    theme: "City",
    rating: 4.7,
    price: 89900,
    img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1400&q=80",
    desc: "Classic Europe route for first-time travelers.",
    includes: ["Hotel 7 nights", "Rail pass", "City tour"]
  },
  {
    id: "USA-001",
    title: "New York + Los Angeles 7D6N",
    region: "America",
    page: "america.html",
    days: 7,
    theme: "City",
    rating: 4.8,
    price: 89900,
    img: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1400&q=80",
    desc: "Iconic US cities, culture, and west coast experience.",
    includes: [
      "Hotel 6 nights",
      "Domestic flight",
      "City highlights tour"
    ]
  },
  {
    id: "USA-002",
    title: "Grand Canyon + Las Vegas 6D5N",
    region: "America",
    page: "america.html",
    days: 6,
    theme: "Nature",
    rating: 4.9,
    price: 79900,
    img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80",
    desc: "National parks and desert landscapes.",
    includes: [
      "Hotel 5 nights",
      "Coach transport",
      "National park ticket"
    ]
  }

];

/* ---------- State ---------- */
let visibleCount = 6;
let currentTours = [...TOURS];
let cart = loadCart();

/* ---------- LocalStorage ---------- */
function saveCart() {
  localStorage.setItem("travelgo_cart", JSON.stringify(cart));
}

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("travelgo_cart")) || [];
  } catch {
    return [];
  }
}

/* ---------- Render Tours ---------- */
function renderTours(list) {
  const grid = $("tourGrid");
  if (!grid) return;

  grid.innerHTML = "";

  list.slice(0, visibleCount).forEach(t => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    col.innerHTML = `
      <div class="card tg-tour-card border-0 shadow-sm h-100">
        <img src="${t.img}" class="tg-tour-img" alt="${t.title}">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start">
            <h5 class="mb-1">${t.title}</h5>
            <a href="./${t.page}" class="badge text-bg-light border">${t.region}</a>
          </div>

          <div class="d-flex gap-2 my-2">
            <span class="badge text-bg-light border">${t.days} days</span>
            <span class="badge text-bg-light border">${t.theme}</span>
            <span class="badge text-bg-light border">★ ${t.rating}</span>
          </div>

          <p class="text-secondary small">${t.desc}</p>

          <div class="d-flex justify-content-between align-items-center">
            <div>
              <div class="small text-secondary">From</div>
              <div class="fw-bold h5 mb-0">${money(t.price)}</div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-outline-dark btn-sm rounded-pill"
                data-action="detail" data-id="${t.id}">Details</button>
              <button class="btn btn-primary btn-sm rounded-pill"
                data-action="add" data-id="${t.id}">+ Add</button>
            </div>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });

  if ($("loadMoreBtn")) {
    $("loadMoreBtn").style.display =
      list.length > visibleCount ? "inline-block" : "none";
  }
}

/* ---------- Modal ---------- */
function openDetail(id) {
  const t = TOURS.find(x => x.id === id);
  if (!t) return;

  $("tourModalTitle").textContent = t.title;
  $("tourModalImg").src = t.img;
  $("tourModalDesc").textContent = t.desc;
  $("tourModalPrice").textContent = money(t.price);
  $("tourModalRating").textContent = `${t.rating} / 5`;

  const ul = $("tourModalIncludes");
  ul.innerHTML = "";
  t.includes.forEach(i => {
    const li = document.createElement("li");
    li.textContent = i;
    ul.appendChild(li);
  });

  $("tourModalAddBtn").onclick = () => addToCart(id);

  new bootstrap.Modal($("tourModal")).show();
}

/* ---------- Cart ---------- */
function addToCart(id) {
  if (cart.some(i => i.id === id)) {
    toast("Already added.");
    return;
  }
  const t = TOURS.find(x => x.id === id);
  cart.push({ id: t.id, title: t.title, price: t.price, img: t.img });
  saveCart();
  renderCart();
  toast("Added to My Trip");
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  if ($("cartCount")) $("cartCount").textContent = cart.length;

  const list = $("cartList");
  if (!list) return;
  list.innerHTML = "";

  let total = 0;
  cart.forEach(i => {
    total += i.price;
    const div = document.createElement("div");
    div.className = "card border-0 shadow-sm";
    div.innerHTML = `
      <div class="card-body d-flex gap-3 align-items-center">
        <img src="${i.img}" style="width:60px;height:45px;object-fit:cover;border-radius:10px">
        <div class="flex-grow-1">
          <div class="fw-semibold small">${i.title}</div>
          <div class="small text-secondary">${money(i.price)}</div>
        </div>
        <button class="btn btn-sm btn-outline-dark rounded-pill"
          data-remove="${i.id}">Remove</button>
      </div>
    `;
    list.appendChild(div);
  });

  if ($("cartTotal")) $("cartTotal").textContent = money(total);

  list.querySelectorAll("[data-remove]").forEach(btn => {
    btn.onclick = () => removeFromCart(btn.dataset.remove);
  });
}

/* ---------- Toast ---------- */
function toast(msg) {
  $("toastBody").textContent = msg;
  new bootstrap.Toast($("demoToast")).show();
}

/* ---------- Events ---------- */
document.addEventListener("click", e => {
  const btn = e.target.closest("button");
  if (!btn) return;

  if (btn.dataset.action === "detail") openDetail(btn.dataset.id);
  if (btn.dataset.action === "add") addToCart(btn.dataset.id);
});

$("loadMoreBtn")?.addEventListener("click", () => {
  visibleCount += 3;
  renderTours(currentTours);
});

$("checkoutBtn")?.addEventListener("click", () => {
  toast("Checkout is demo only.");
});

$("clearCartBtn")?.addEventListener("click", () => {
  cart = [];
  saveCart();
  renderCart();
  toast("Cart cleared.");
});

/* ---------- Init ---------- */
renderTours(currentTours);
renderCart();

/* ===== Country page: render tours by region ===== */
function renderCountryTours(region) {
  const grid = document.getElementById("countryTourGrid");
  if (!grid) return;

  const list = TOURS.filter(t => t.region === region);
  grid.innerHTML = "";

  list.forEach(t => {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";
    col.innerHTML = `
      <div class="card tg-tour-card border-0 shadow-sm h-100">
        <img src="${t.img}" class="tg-tour-img" alt="${t.title}">
        <div class="card-body">
          <h5>${t.title}</h5>
          <p class="text-secondary small">${t.desc}</p>
          <div class="d-flex justify-content-between align-items-center">
            <strong>${money(t.price)}</strong>
            <button class="btn btn-primary btn-sm rounded-pill"
              onclick="addToCart('${t.id}')">Add</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}

fetch("navbar.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById("navbar").innerHTML = data;
  });

