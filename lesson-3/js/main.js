
const API = `https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses`;

let getRequest = (url) => {
    return new Promise((resolve) => {
        let xhr = new XMLHttpRequest();
        // window.ActiveXObject -> new ActiveXObject();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
            return;
            }
            if (xhr.status !== 200) {
                console.log('some error');
                return;
            }
        resolve(xhr.responseText);
        };
        xhr.send();
    });
};

getRequest(`${API}/catalogData.json`)
    .then((x) => {
        let myRequest = JSON.parse(x); //здесь x почему-то подчеркнут, хотя всё работает
        console.log(myRequest);
    });

class Products {
    products = [];
    container = null;
    cart = null; //объект корзины

    constructor(selector) {
        this.container = document.querySelector(selector);
        this._fetchData()
            .then(() => {
                this._render();
                this.calcSum();
                this.cart = new Cart('.cart', '.btn-cart', '.buy-btn');
                this.cart.products = this.products;
            });
    }

    calcSum() {
        return this.products.reduce((accum, item) => accum += item.price, 0);
    }

    _fetchData() {
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .then(data => {
                for (let product of data) {
                    this.products.push(new ProductItem(product));
                }
            })
    }

    _render() {
        for (let product of this.products) {
            if (product.rendered) {
                continue;
            }

            this.container.insertAdjacentHTML('beforeend', product.render());
        }
    }
}

class ProductItem {
    title = '';
    price = 0;
    id = 0;
    img = '';
    rendered = false;

    constructor(product, img = 'https://placehold.it/200x150') {
        ({ product_name: this.title, price: this.price, id_product: this.id } = product);
        this.img = img;
    }

    render() {
        this.rendered = true;
        return `<div class="product-item">
                 <img src="${this.img}" alt="${this.title}">
                 <div class="desc">
                     <h3>${this.title}</h3>
                     <p>${this.price}</p>
                     <button class="buy-btn" data-id="${this.id}">Купить</button>
                 </div>
             </div>`
    }
}


class Cart {
    container = null; //место вставки корзины
    btnCart = null; //кнопка отображения корзины
    btnBuy = null; //кнопки купить
    cartShow = false; //Показать корзину
    cartItems = []; //Массив товаров в корзине
    products = null; //ссылка на продукты

    constructor(container, buttonCart, buttonBuy) {
        this.container = document.querySelector(container);
        this.btnCart = document.querySelector(buttonCart);
        document.querySelector(buttonCart).addEventListener('click', this._showCart.bind(this));//вот тут затупил с this. Сначала не мог понять почему не работает. Вспомнил про bind. Потом вспоминал как его использовать :)
            this.btnBuy = document.querySelectorAll(buttonBuy);
            this.btnBuy.forEach(button => button.addEventListener('click', this.add.bind(this)));

    }

    _render(){
        this.cartItems.forEach(item => {
            if (item.added === false){
                this.container.insertAdjacentHTML('beforeend', item.render());
            }

        })
    }

    //Показать и скрыть корзину
    _showCart(){
        if (this.cartShow === false) {
            this.container.style.display = 'flex';
            this.cartShow = true;
            return;
        }

        if (this.cartShow === true) {
            this.container.style.display = 'none';
            this.cartShow = false;
        }

    }

    //ищет индекс товара в массиве carItems по id продукта
    findItemByProductId(id){
        if (this.cartItems.length === 0){
            return -1;
        }

        for(let i=0; i<this.cartItems.length; i++){
            if (this.cartItems[i].id === id){
                return i;
            }
        }
    }

    //добавить товар в корзину
    add(button){
        let isAdd = false;
        //проверяю, есть ли товар с таким id в корзине
        this.cartItems.forEach(item => {
            if (item.id === Number(button.target.dataset.id)){
                isAdd = true;
            }
        });
        //если такого товара нет, то добавляю его в корзину, отрисовываю и слушаю кнопку "удалить"
        if (isAdd === false){
            this.cartItems.push(new CartItem(this.products, Number(button.target.dataset.id)));
            this._render();
            document.querySelector(`.btn-delete-${this.cartItems[this.cartItems.length-1].id}`)
                .addEventListener('click', this.delete.bind(this));
            return;
        }
        //если товар уже есть, то увеличиваю его количество на один
        if (isAdd === true){
            this.cartItems[this.findItemByProductId(Number(button.target.dataset.id))].quantity++;
            document.querySelector(`div[data-id="${button.target.dataset.id}"] p[class="quantity"]`)
                .innerHTML = `${this.cartItems[this.findItemByProductId(Number(button.target.dataset.id))].quantity} шт.`;
        }
    }

    //удалить товар из корзины
    delete(button){
        if(this.cartItems[this.findItemByProductId(Number(button.target.dataset.id))].quantity === 1){
            document.querySelector(`div[data-id="${button.target.dataset.id}"]`).remove();
            let cartItemsNum = 0;
            for (let i = 0; i < this.cartItems.length; i++) {
                if (this.cartItems[i].id === Number(button.target.dataset.id)) {
                    cartItemsNum = i;
                    break;
                }
            }
            this.cartItems.splice(cartItemsNum, 1);
            return;
        }
        this.cartItems[this.findItemByProductId(Number(button.target.dataset.id))].quantity--;
        document.querySelector(`div[data-id="${button.target.dataset.id}"] p[class="quantity"]`)
            .innerHTML = `${this.cartItems[this.findItemByProductId(Number(button.target.dataset.id))].quantity} шт.`;
    }
}

class CartItem {
    title = '';
    price = 0;
    id = 0;
    img = '';
    added = false; //товар добавлен в корзину
    quantity = 1; //количество

    // some - cartItems array

    constructor(products, productId) {
        //был forEach, переделал на for, чтобы можно было выходить из цикла если элемент найден
        for(let i=0; i<products.length;i++){
            if (products[i].id === productId){
                ({ title: this.title, price: this.price, id: this.id, img: this.img } = products[i]);
                break;
            }
        }
    }
    // someMethod() - метод делает то-то
    render() {
        this.added = true;
        return `<div class="cart-item" data-id="${this.id}">
                 <img src="${this.img}" alt="${this.title}">
                 <h3>${this.title}</h3>
                 <p class="quantity">${this.quantity} шт.</p>
                 <p>${this.price}</p>
                 <button class="btn-delete-${this.id}" data-id="${this.id}">Удалить</button>
                </div>`
    }
}

setTimeout(()=>console.log(list.calcSum()), 5000);

const list = new Products('.products');
//const  cart = new Cart('.cart', '.btn-cart', '.buy-btn');










