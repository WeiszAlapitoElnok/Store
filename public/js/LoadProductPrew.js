async function loadProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();

        // tároljuk a termékeket a böngészőben (localStorage)
        localStorage.setItem('products', JSON.stringify(products));

        // megjelenítés
        const grid = document.getElementById('product-grid');
        grid.innerHTML = ''; // előző tartalom törlése
    products.slice(0,3).forEach(p => {
      const card = document.createElement('div');
      card.classList.add('product');

      card.innerHTML = `
        <div class="product-media placeholder">
          <img src="media/szeles.jpeg" width="100%" height="110%" alt=""><!--p.img_url-->
        </div>
        <div class="product-body">
          <h4>${p.name}</h4>
          <p class="muted">${p.description}</p>
          <div class="product-actions">
            <span class="price">€${p.price}</span>
            <button class="btn btn-sm">Details</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
});
      } catch (err) {
        console.error('❌ Hiba a lekéréskor:', err);
      }
    }
addEventListener("DOMContentLoaded",loadProducts)