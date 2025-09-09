document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'אוכף עור קלאסי', price: 1500, image: 'images/product1.jpg', description: 'אוכף עור איכותי לרכיבת שטח, מתאים לרוב סוגי הסוסים.' },
        { id: 2, name: 'רתמת ראש', price: 250, image: 'images/product2.jpg', description: 'רתמת ראש מעור עם עיטורים, נוחה לשימוש יום-יומי.' },
        { id: 3, name: 'מגני רגליים', price: 350, image: 'images/product3.jpg', description: 'סט מגני רגליים קדמיים ואחוריים, להגנה מקסימלית.' },
        { id: 4, name: 'שמפו לסוסים', price: 85, image: 'images/product4.jpg', description: 'שמפו מקצועי בניחוח לבנדר לניקוי יסודי של פרוות הסוס.' },
        { id: 5, name: 'מזון מועשר', price: 120, image: 'images/product5.jpg', description: 'שק מזון 25 ק"ג מועשר בוויטמינים ומינרלים.' },
        { id: 6, name: 'מברשת פרווה', price: 45, image: 'images/product6.jpg', description: 'מברשת דו-צדדית לטיפוח הפרווה והזנב.' }
    ];

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const productGrid = document.querySelector('.product-grid');
    const featuredProductsSection = document.querySelector('.featured-products-section .product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const clearCartBtn = document.querySelector('.clear-cart-btn');
    const checkoutBtn = document.querySelector('.checkout-btn');

    function renderProducts(container, displayType = 'full') {
        if (!container) return;
        container.innerHTML = '';
        const productsToDisplay = displayType === 'full' ? products : products.slice(0, 3);
        
        productsToDisplay.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add(displayType === 'full' ? 'product-card' : 'product-item');

            let content = `
                <img src="${product.image}" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>${product.description}</p>
                <span class="price">${product.price.toFixed(2)} ₪</span>
            `;

            if (displayType === 'full') {
                content += `
                    <div class="add-to-cart-container">
                        <div class="quantity-control-product">
                            <button class="minus-btn" data-id="${product.id}">-</button>
                            <span>1</span>
                            <button class="plus-btn" data-id="${product.id}">+</button>
                        </div>
                        <button class="add-to-cart-btn" data-id="${product.id}">הוסף לעגלה</button>
                    </div>
                `;
            }
            
            productCard.innerHTML = content;
            container.appendChild(productCard);
        });

        if (displayType === 'full') {
            document.querySelectorAll('.add-to-cart-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const id = parseInt(e.target.dataset.id);
                    const quantity = parseInt(e.target.closest('.add-to-cart-container').querySelector('.quantity-control-product span').textContent);
                    addToCart(id, quantity);
                });
            });

            document.querySelectorAll('.quantity-control-product').forEach(control => {
                const plusBtn = control.querySelector('.plus-btn');
                const minusBtn = control.querySelector('.minus-btn');
                const quantitySpan = control.querySelector('span');

                plusBtn.addEventListener('click', () => {
                    let quantity = parseInt(quantitySpan.textContent);
                    quantity++;
                    quantitySpan.textContent = quantity;
                });

                minusBtn.addEventListener('click', () => {
                    let quantity = parseInt(quantitySpan.textContent);
                    if (quantity > 1) {
                        quantity--;
                        quantitySpan.textContent = quantity;
                    }
                });
            });
        }
    }

    function addToCart(productId, quantity = 1) {
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        alert(`${product.name} נוסף לעגלה!`);
    }

    function updateCartDisplay() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const row = document.createElement('tr');
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price.toFixed(2)} ₪</td>
                <td>
                    <div class="quantity-control">
                        <button class="minus-btn" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="plus-btn" data-id="${item.id}">+</button>
                    </div>
                </td>
                <td>${itemTotal.toFixed(2)} ₪</td>
            `;
            cartItemsContainer.appendChild(row);
        });

        if (cartTotalPrice) {
            cartTotalPrice.textContent = total.toFixed(2);
        }
        
        document.querySelectorAll('.cart-page .minus-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                updateCartItemQuantity(id, -1);
            });
        });

        document.querySelectorAll('.cart-page .plus-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = parseInt(e.target.dataset.id);
                updateCartItemQuantity(id, 1);
            });
        });
    }

    function updateCartItemQuantity(productId, change) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            cart[itemIndex].quantity += change;
            if (cart[itemIndex].quantity <= 0) {
                cart.splice(itemIndex, 1);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
        }
    }

    function clearCart() {
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        alert('העגלה נוקתה בהצלחה!');
    }

    function handleCheckout() {
        const messageBox = document.createElement('div');
        messageBox.classList.add('message-overlay');
        messageBox.innerHTML = `
            <div class="message-content">
                <h2>הודעה חשובה</h2>
                <p>האתר הזה הוא בדיחה, כל המוצרים באתר הזה זה תמונות ב AI</p>
                <button class="close-message-btn">סגור</button>
            </div>
        `;

        document.body.appendChild(messageBox);
        
        document.querySelector('.close-message-btn').addEventListener('click', () => {
            messageBox.remove();
        });
    }

    if (productGrid) {
        renderProducts(productGrid, 'full');
    }
    
    if (featuredProductsSection) {
        renderProducts(featuredProductsSection, 'featured');
    }

    if (cartItemsContainer) {
        updateCartDisplay();
    }

    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', handleCheckout);
    }
});