const productsGrid = document.getElementById('productsGrid');
const cartCount = document.getElementById('cartCount');
const cartPanel = document.getElementById('cartPanel');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBtn = document.getElementById('cartBtn');
const closeCart = document.getElementById('closeCart');

let cart = [];

// ۱. دریافت محصولات از API
async function fetchProducts() {
    try {
        // نمایش لودر قبل از دریافت
        productsGrid.innerHTML = '<div class="loader">Loading Magic...</div>';
        
        const response = await fetch('https://fakestoreapi.com/products?limit=9');
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const products = await response.json();
        displayProducts(products);
        
    } catch (error) {
        console.error('Error fetching products:', error);
        productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: red;">
            ❌ Failed to load products. Please check your internet or refresh.
        </p>`;
    }
}

// ۲. نمایش محصولات در صفحه
function displayProducts(products) {
    productsGrid.innerHTML = ''; // پاک کردن لودر
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card animate__animated animate__fadeInUp';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title.substring(0, 30)}...</h3>
            <p class="price">$${product.price}</p>
            <button class="add-btn" onclick="addToCart(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, '${product.image}')">
                Add to Cart
            </button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// ۳. افزودن به سبد خرید
window.addToCart = (id, title, price, image) => {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    
    updateCart();
    
    // انیمیشن لرزش سبد خرید هنگام افزودن
    cartBtn.classList.add('animate__animated', 'animate__rubberBand');
    setTimeout(() => cartBtn.classList.remove('animate__rubberBand'), 1000);
};

// ۴. بروزرسانی سبد خرید
function updateCart() {
    // تعداد کل
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalCount;
    
    // لیست آیتم‌ها
    cartItemsContainer.innerHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
        
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" width="40">
            <div style="flex:1">
                <small>${item.title.substring(0, 20)}...</small><br>
                <strong>${item.quantity} x $${item.price}</strong>
            </div>
            <button onclick="removeFromCart(${item.id})" style="border:none; background:none; cursor:pointer; color:red">×</button>
        `;
        cartItemsContainer.appendChild(itemEl);
    });
    
    cartTotal.innerText = totalPrice.toFixed(2);
}

// ۵. حذف از سبد
window.removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== id);
    updateCart();
};

// ۶. باز و بسته کردن پنل سبد
cartBtn.addEventListener('click', () => cartPanel.classList.add('active'));
closeCart.addEventListener('click', () => cartPanel.classList.remove('active'));

// شروع برنامه
fetchProducts();
