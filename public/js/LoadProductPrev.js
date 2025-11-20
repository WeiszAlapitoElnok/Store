async function loadProducts() {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        const products = await response.json();

        // tároljuk a termékeket a böngészőben (localStorage)
        localStorage.setItem('products', JSON.stringify(products));

        // megjelenítés
        const grid = document.getElementById('product-grid');
        grid.innerHTML = ''; // előző tartalom törlése
        let i = 1;
    products.slice(0,3).forEach((p, idx) => {
      const card = document.createElement('div');
      card.classList.add('product');

      card.innerHTML = `
        <div class="product-media placeholder">
          <img src="media/${i}.jpeg" width="100%" height="110%" alt="">
        </div>
        <div class="product-body">
          <h4>${p.name}</h4>
          <p class="muted">${p.description}</p>
          <div class="product-actions">
            <span class="price">€${p.price}</span>
            <button class="btn btn-sm details-btn" data-id="${p.id || idx}">Details</button>
          </div>
        </div>
      `;
      i++;
      grid.appendChild(card);
});
    // attach listeners for Details buttons (delegation could be used but keep simple)
    document.querySelectorAll('.details-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        showProductDetail(id, products);
      });
    });
  
    // showProductDetail: creates and opens a modal with large product view and other products below
    function showProductDetail(id, products) {
      const prod = products.find(p => String(p.id) === String(id)) || products[id] || products[0];

      // remove existing modal if present
      const existing = document.getElementById('product-detail-modal');
      if (existing) existing.remove();

      const modal = document.createElement('div');
      modal.id = 'product-detail-modal';
      modal.className = 'product-modal open';
      modal.innerHTML = `
        <div class="product-modal-panel">
          <button class="modal-close" aria-label="Close">&times;</button>
          <div class="product-detail-large">
            <div class="product-media">
              <img src="media/1.jpeg" alt="${prod.name}" />
            </div>
            <div class="product-detail-body">
              <h2>${prod.name}</h2>
              <p class="price">€${prod.price}</p>
              <p class="muted">${prod.description}</p>
              <div class="product-detail-actions">
                <button class="btn btn-primary add-to-cart">Add to cart</button>
                <button class="btn btn-outline close-detail">Close</button>
              </div>
            </div>
          </div>
          <h3 class="related-title">Other products</h3>
          <div class="related-grid">
            ${products.filter(p => p !== prod).slice(0,6).map((op, idx) => `
              <div class="related-card">
                <img src="media/${idx+2}.jpeg" alt="${op.name}" />
                <div class="related-info">
                  <strong>${op.name}</strong>
                  <span class="muted">€${op.price}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // close handlers
      modal.querySelectorAll('.modal-close, .close-detail').forEach(el => {
        el.addEventListener('click', () => modal.remove());
      });

      // click outside panel closes
      modal.addEventListener('click', (ev) => {
        if (ev.target === modal) modal.remove();
      });
    }
      } catch (err) {
        console.error('❌ Hiba a lekéréskor:', err);
      }
    }
addEventListener("DOMContentLoaded",loadProducts)