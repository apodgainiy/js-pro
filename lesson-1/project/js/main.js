const data = [
    { title: 'Notebook', id: 1, price: 2000 },
    { title: 'Keyboard', id: 2, price: 200 },
    { title: 'Mouse', id: 3, price: 100 },
    { title: 'Gamepad', id: 4, price: 87 }
];

const renderProduct = (title = 'Без заголовка', id = 0, price = 0) => {
    return `
        <div class="product-item">
            <h3>${title}</h3>
            <p>${price}</p>
        </div>
    `;
};

const render = (products) => {
    const productsList = products.map(item => renderProduct(item.title, item.id, item.price));
    console.dir(productsList);
    document.querySelector('.products').innerHTML = productsList.join('');
};

render(data);