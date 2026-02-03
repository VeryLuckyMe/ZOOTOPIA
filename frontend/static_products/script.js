document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('productsGrid');
    const loading = document.getElementById('loading');

    // Mock Data
    const mockProducts = [
        {
            productID: 1,
            productName: "Beef - Teriyaki",
            productPrice: 1200.00,
            productImage: "assets/dogfood1.png", // Using existing assets as placeholder
            description: "8kg High-quality beef based dog food rich in protein and essential nutrients for active dogs. Vet recommended.",
            quantity: 50
        },
        {
            productID: 2,
            productName: "Reflective Cat Collar",
            productPrice: 350.00,
            productImage: "assets/collar.png",
            description: "Safety first with our reflective collars for night visibility. Comfortable and adjustable fit for all cat sizes.",
            quantity: 100
        },
        {
            productID: 3,
            productName: "Durable Rubber Chew Toy",
            productPrice: 450.00,
            productImage: "assets/dogbone.png",
            description: "Long-lasting chew toy for aggressive chewers. Helps clean teeth and massage gums while playing.",
            quantity: 25
        },
        {
            productID: 4,
            productName: "Stainless Steel Bowl",
            productPrice: 200.00,
            productImage: "assets/bowl.png",
            description: "Rust-resistant stainless steel bowl with non-slip base. varying sizes available.",
            quantity: 0 // Out of stock
        },
        {
            productID: 5,
            productName: "Catnip Treat",
            productPrice: 150.00,
            productImage: "assets/dogleash.png",
            description: "Dog leash made of durable nylon with a comfortable grip. Perfect for outdoor walks.",
            quantity: 200
        },
        {
            productID: 6,
            productName: "Pet Shampoo",
            productPrice: 550.00,
            productImage: "assets/shampoo.png",
            description: "Soothing shampoo for pets with sensitive skin. Leaves coat shiny and smelling fresh.",
            quantity: 15
        }
    ];

    // Simulate API call
    renderProducts(mockProducts);

    function renderProducts(products) {
        productsGrid.innerHTML = '';

        if (products.length === 0) {
            productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">No products available</div>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const isOutOfStock = product.quantity === 0;

            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${product.productImage}" alt="${product.productName}">
                </div>
                <div class="card-content">
                    <h3 class="product-name">${product.productName}</h3>
                    <p class="product-description">${product.description}</p>
                    <p class="product-price">₱${product.productPrice.toFixed(2)}</p>
                    <span class="product-stock">${isOutOfStock ? 'Out of Stock' : 'Stock: ' + product.quantity}</span>
                </div>
                <div class="card-actions">
                    <button class="add-to-cart-btn" 
                        onclick="addToCart(${product.productID}, '${product.productName}')"
                        ${isOutOfStock ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        ${isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            `;
            productsGrid.appendChild(card);
        });
    }

    // Expose to global scope for onclick attributes
    window.addToCart = function (id, name) {
        // Simulate "Adding..." state
        const btn = event.target.closest('button');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';

        setTimeout(() => {
            // Success
            btn.disabled = false;
            btn.innerHTML = originalText;
            showToast(`${name} added to cart!`);
        }, 800);
    };

    function showToast(message) {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fas fa-check-circle" style="color: #4caf50;"></i> ${message}`;

        container.appendChild(toast);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }
});
