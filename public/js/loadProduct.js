async function loadProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();

    // tároljuk a termékeket a böngészőben (localStorage) és globálisan
    localStorage.setItem('products', JSON.stringify(products));
    window.products = products;

    // megjelenítés
    renderProducts(products);
  } catch (err) {
    console.error('❌ Hiba a lekéréskor:', err);
  }
}

function renderProducts(products) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = ''; // előző tartalom törlése
  let i = 1;
  products.forEach(p => {
    const card = document.createElement('div');
    card.classList.add('product');

    // Use img_url from the product when available, otherwise fallback to indexed media
    const imgSrc = p.img_url || `media/${i}.jpeg`;

    card.innerHTML = `
      <div class="product-media placeholder">
        <img src="${imgSrc}" width="100%" height="110%" alt="${p.name}">
      </div>
      <div class="product-body">
        <h4>${p.name}</h4>
        <p class="muted">${p.description || p.desc || ''}</p>
        <div class="product-actions">
          <span class="price">€${p.price}</span>
          <button class="btn btn-sm">Details</button>
        </div>
      </div>
    `;
    i++;
    grid.appendChild(card);
  });
}

function filterProducts() {
  const qEl = document.getElementById('searchInput');
  if (!qEl) return;
  const q = qEl.value.trim();

  // If empty, fetch full list (or render cached)
  if (!q) {
    // try to use cached products if available
    const cached = window.products || JSON.parse(localStorage.getItem('products') || '[]');
    if (cached && cached.length) {
      renderProducts(cached);
      return;
    }
    loadProducts();
    return;
  }

  // Query server for matching names (debounced by caller)
  fetch(`/api/products?search=${encodeURIComponent(q)}`)
    .then(r => r.json())
    .then(results => {
      // update cache with results (note: this is partial result)
      renderProducts(results);
    })
    .catch(err => console.error('❌ Search error:', err));
}

// debounce helper so we don't hit the server on every keystroke
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const debouncedFilter = debounce(filterProducts, 300);
window.filterProducts = debouncedFilter;

addEventListener('DOMContentLoaded', loadProducts);